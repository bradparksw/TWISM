var express = require('express');
var router = express.Router();
const apiReq = require('request');

require('dotenv').config();

async function getCandles(symbol, startTime, endTime) {
    return new Promise(function (resolve, reject) {
        apiReq(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=1&from=${startTime}&to=${endTime}&token=${process.env.FINNHUB_KEY}`, { json: true }, (err, res, body) => {
            if (err) { 
                reject(err); 
            }
            console.log(body);
            if (body.s == 'ok') {
                resolve(body);
            } else { 
                resolve(null);
            }
        });
    });
}

router.get('/:tweetId/:symbol/:startTime/:tweetedUNIX/:endTime', async function(req, res) {
    let chart = {
        tweetId: req.params.tweetId,
        tweetedUNIX: req.params.tweetedUNIX,
        stockCandles: await getCandles(req.params.symbol, req.params.startTime, req.params.endTime),
        symbol: req.params.symbol
    }
    res.send(chart);
});

module.exports = router;
