var express = require('express');
var router = express.Router();
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const Twitter = require('twitter');
const apiReq = require('request');

require('dotenv').config();

async function getSymbol(keyword) {
    return new Promise(function (resolve, reject) {
        apiReq(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${process.env.ALPHA_KEY}`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err);
                reject(err); 
            }
            if (body.bestMatches) {
                for (let i = 0; i < body.bestMatches.length; i++) {
                    if (body.bestMatches[i]['4. region'] == 'United States' || 
                        body.bestMatches[i]['8. currency'] == 'USD') {
                            console.log(body.bestMatches[i]['1. symbol']);
                            resolve(body.bestMatches[i]['1. symbol']);
                            break;
                    }
                }
            }
            resolve(null);
        });
    });
}

router.get('/:tweetId', async function(req, res) {

    var key = process.env.AZURE_KEY;
    var endpoint = process.env.AZURE_ENDPOINT;

    const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));
    
    const twitterClient = new Twitter({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_KEY_SECRET,
        bearer_token: process.env.BEARER_TOKEN,
        tweet_mode: 'extended'
    });

    var tweetId = req.params.tweetId
    var tweet = null

    var companies = [];
    var analyzeStr = [];

    do {
        var tweet = await twitterClient.get('statuses/show', {
            id: tweetId,
            tweet_mode: 'extended'
        });
        
        var tweetStr = tweet.full_text;
        if (analyzeStr.length >= 5) {
            analyzeStr[4] += tweetStr;
        } else {
            analyzeStr.push(tweetStr);
        }
        
        var words = tweetStr.split(" ");
        for (let i = 0; i < words.length; i++) {
            if ((words[i][0] == "@" || words[i][0] == "$") && !/\d/.test(words[i])) {
                if (!companies.includes(words[i].substring(1)) && !companies.includes(words[i])) {
                    companies.push(words[i].substring(1));
                }
            }
        }

        tweetId = tweet.in_reply_to_status_id_str
    } while (tweetId != null)
    

    const entityResults = await textAnalyticsClient.recognizeEntities(analyzeStr);
    entityResults.forEach(document => {
        document.entities.forEach(entity => {
            console.log(entity.category, entity.text);
            if (entity.category == "Organization" || entity.category == "Product" || entity.category == "Person") {
                companies.push(entity.text);
            }
        });
    });
    
    const uniqueCompanies = new Set(companies);
    const companyArr = [...uniqueCompanies];

    let symbols = [];
    for (i = 0; i < companyArr.length; i++) {
        let symbol = await getSymbol(companyArr[i]);
        if (symbol != null) {
            symbols.push(symbol);
        }
    }

    result = {
        id : req.params.tweetId,
        symbols : symbols
    }

    res.send(result);

});

module.exports = router;