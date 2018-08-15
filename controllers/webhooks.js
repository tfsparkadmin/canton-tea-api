const express = require('express')
const axios = require('axios')
const shopify = require('./../src/shopify')

const router = express.Router()

router.get('/customer-created', function(request, response) {
    console.log(request.body)
    response.status(200).send()
})

module.exports = router
