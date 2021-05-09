var express = require('express');
var router = express.Router();
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const Twitter = require('twitter');
const apiReq = require('request');

require('dotenv').config();

async function getSymbol(keyword) {
    return new Promise(function (resolve, reject) {
        apiReq(`https://finnhub.io/api/v1/search?q=${keyword}&token=${process.env.FINNHUB_KEY}`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err);
                reject(err); 
            }
            if (body.count > 0) {
                if (body.result[0].symbol.includes(".")) {
                    var symbol = body.result[0].symbol.split(".")[0];
                    for (let i = 0; i < body.result.length; i++) {
                        if (body.result[i].symbol == symbol) {
                            resolve(body.result[i]);
                            break;
                        }
                    }
                    resolve(body.result[0]);
                } else {
                    resolve(body.result[0]);
                }
            } else {
                resolve(null);
            }
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
        
        var tweetStr = tweet.full_text
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
            if (entity.category == "Organization" || entity.category == "Product") {
                companies.push(entity.text);
            }
        });
    });
    
    const uniqueCompanies = new Set(companies);
    const companyArr = [...uniqueCompanies];
    console.log(companyArr);

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



    console.log(symbols);
    res.send(result);

});

module.exports = router;