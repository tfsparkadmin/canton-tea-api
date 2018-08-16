const express = require('express')
const router = express.Router()
const { storeNewUser, verifyToken } = require('./../src/auth')
const { jwtAuth } = require('./../middleware/jwt-auth')

router.use('/', require('./orders'))

router.use('/webhooks', require('./webhooks'))

router.use('/auth', require('./auth'))

router.get('/test', (request, response)=> {
    // storeNewUser({
    //     firstName: 'Mihai',
    //     lastName: 'Blebea',
    //     email: 'mblebea@tfspark.com'
    // }, (result)=> {
    //     response.json(result)
    // })
    response.send('Works')
})

module.exports = router
