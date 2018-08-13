const express = require('express')
const router = express.Router()
const { taxByPrice, taxByWeight, calculateTax } = require('./../src/shipping')
const data = require('./data.json')

const cart = {
    total_price: 12,
    total_weight: 400000
}

const countryCode = 'GB'

router.use('/', require('./orders'))

router.use('/test', (request, response)=> {
    response.json(calculateTax(data, cart, countryCode))
})

module.exports = router
