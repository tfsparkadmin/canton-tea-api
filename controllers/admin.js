const express = require('express')
var path = require('path')
const shopifyAPI = require('shopify-node-api')
const randomstring = require('randomstring')
const shopifyConfig = require('./../src/shopifyConfig.js')
const router = express.Router()


router.get('/', function(request, response) {
    // response.sendFile(path.join(__dirname + './../public/index.html'))
    response.send('ceva')
})

router.get('/install', function(request, response) {
    var Shopify = new shopifyAPI(shopifyConfig)
    response.redirect(Shopify.buildAuthURL())
})

router.get('/callback', function(request, response) {
    var Shopify = new shopifyAPI(shopifyConfig)
    var query_params = request.query;

    Shopify.exchange_temporary_token(query_params, function(err, data){
        response.json(data)
    })
})

module.exports = router
