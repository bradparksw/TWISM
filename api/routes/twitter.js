var express = require('express');
var router = express.Router();
var axios = require('axios');
var http = require('superagent');

require('dotenv').config();

/* GET users listing. */

function getBearerToken(consumerKey, consumerSecret, callback) {
    const base64EncodedKey = new Buffer(`${consumerKey}:${consumerSecret}`).toString('base64')
    http
      .post('https://api.twitter.com/oauth2/token?grant_type=client_credentials')
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
      .set('Authorization', `Basic ${base64EncodedKey}`)
      .end(callback)
  }

router.get('/users/:username', function(req, res, next) {

    var username = req.params.username;

    var bearerToken = "";
    
    getBearerToken(process.env.CONSUMER_KEY, process.env.API_KEY, (err, res) => {
        if (err) {
          console.error(err)
        } else {
          bearerToken = res.body;
        }
      })

    const config = {
        headers: { Authorization: `Bearer ${bearerToken}` }
    }

    const bodyParameters = {
        screen_name = username,
        count = 10
    }

    axios.get(
        'https://api.twitter.com/1.1/statuses/user_timeline.json',
        bodyParameters,
        config,
    ).then(function(response) {
        console.log(response);
    })
  
  
    res.send('respond with a resource');
});

module.exports = router;



