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
        bearer_token: process.env.BEARER_TOKEN
    });
    
    ids = [];

    twitterClient.get('statuses/user_timeline', {
        screen_name: req.params.username,
        count: 10
    }, function(error, tweets) {
        if(error) throw error;
        res.send(tweets);
    });

});

module.exports = router;



