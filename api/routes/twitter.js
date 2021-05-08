const { request } = require('express');
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');


var utf8 = require('utf8');

require('dotenv').config();

router.get('/user/:username', async function(req, res) {

    const twitterClient = new Twitter({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_KEY_SECRET,
        bearer_token: process.env.BEARER_TOKEN,
        tweet_mode: 'extended'
    });
    
    ids = [];

    twitterClient.get('statuses/user_timeline', {
        screen_name: req.params.username,
        count: 10,
        tweet_mode: 'extended',
        include_rts: true
    }, function(error, tweets) {
        if(error) throw error;
        var searchRes = Object.assign({}, ...tweets.map((tweet) => ({[tweet.id_str]: tweet.created_at})));
        console.log(searchRes);
        res.send(searchRes);
    });

});

router.get('/tweet/:tweetId', async function(req, res) {

    const twitterClient = new Twitter({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_KEY_SECRET,
        bearer_token: process.env.BEARER_TOKEN,
        tweet_mode: 'extended'
    });

    twitterClient.get('statuses/show', {
        id: req.params.tweetId
    }, function(error, tweet) {
        if(error) throw error;
        console.log("sucessfull");
        res.send(tweet);
    });

});

module.exports = router;



