const { request } = require('express');
var express = require('express');
var router = express.Router();
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");


var utf8 = require('utf8');

require('dotenv').config();

router.get('/:textString', async function(req, res) {

    var key = process.env.AZURE_KEY;
    var endpoint = process.env.AZURE_ENDPOINT;

    const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

    var str = [req.params.textString];
    
    var companies = [];

    const entityResults = await textAnalyticsClient.recognizeEntities(str);

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



