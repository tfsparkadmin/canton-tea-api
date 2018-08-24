const express = require('express')
const router = express.Router()
const { storeNewUser, verifyToken } = require('./../src/auth')
const shopify = require('./../src/shopify')


router.use('/', require('./orders'))

router.use('/webhooks', require('./webhooks'))

router.use('/generate-tokens', require('./generate-tokens'))

module.exports = router
