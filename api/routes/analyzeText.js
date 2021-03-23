const { request } = require('express');
var express = require('express');
var router = express.Router();
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
var Twitter = require('twitter');


var utf8 = require('utf8');

require('dotenv').config();

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
        analyzeStr.push(tweetStr);

        var words = tweetStr.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (words[i][0] == "$" && !/\d/.test(words[i])) {
                if (!companies.includes(words[i].substring(1)) && !companies.includes(words[i])) {
                    companies.push(words[i].substring(1));
                }
            }
        }

        tweetId = tweet.in_reply_to_status_id_str
        console.log(tweetId);
    } while (tweetId != null)

    

    console.log(analyzeStr);
    console.log(companies);



    const entityResults = await textAnalyticsClient.recognizeEntities(analyzeStr);


    entityResults.forEach(document => {
        document.entities.forEach(entity => {
            console.log(entity.text, entity.category);
            if (entity.category == "Organization" || entity.category == "Product") {
                companies.push(entity.text);
            }
        });
    });
    

    console.log(companies);

    res.send(companies);

});

module.exports = router;



