const express = require('express')
const router = express.Router()
const { storeNewUser, verifyToken } = require('./../src/auth')
const { jwtAuth } = require('./../middleware/jwt-auth')
const shopify = require('./../src/shopify')


router.use('/', require('./orders'))

router.use('/webhooks', require('./webhooks'))

router.use('/auth', require('./auth'))

router.get('/test', (request, response)=> {
    // shopify.metafield.create({
    //     key: 'token',
    //     value: 'Serban',
    //     value_type: 'string',
    //     namespace: 'auth_token',
    //     owner_resource: 'customer',
    //     owner_id: 263383875623
    // }).then((result)=> {
    //     response.json(result)
    // }).catch((error)=> {
    //     response.json(error)
    // })

    shopify.metafield.list({
        metafield: { owner_resource: 'customer', owner_id: 263383875623 }
    }).then((result)=> {
        response.json(result)
    }).catch((error)=> {
        response.json(error)
    })
})

module.exports = router
