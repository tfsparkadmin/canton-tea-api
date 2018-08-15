const express = require('express')
const router = express.Router()
const { storeNewUser } = require('./../src/auth')


router.use('/', require('./orders'))

router.use('/webhooks', require('./webhooks'))

router.use('/test', (request, response)=> {
    storeNewUser({
        firstName: 'Mihai',
        lastName: 'Blebea',
        email: 'mblebea@tfspark.com'
    }, (result)=> {
        response.json(result)
    })
})

module.exports = router
