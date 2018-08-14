const express = require('express')
const axios = require('axios')
const shopify = require('./../src/shopify')

const router = express.Router()

router.get('/customer-created', function(request, response) {
    response.send('found it')
})

module.exports = router
