const express = require('express')
const router = express.Router()
const { storeNewUser } = require('./../src/auth')


router.use('/', require('./orders'))

router.use('/webhooks', require('./webhooks'))

router.use('/test', (request, response)=> {
    var user = storeNewUser('Mihai', 'Blebea', 'mblebea@tfspark.com')
    response.json(user)
})

module.exports = router
