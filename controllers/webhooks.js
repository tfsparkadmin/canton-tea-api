const express = require('express')
const { storeNewUser } = require('./../src/auth')
const { storeMetafield } = require('./../src/metafield')
const shopiry = require('./../src/shopify')

const router = express.Router()

router.post('/customer-created', function(request, response) {
    let body = request.body
    storeNewUser({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        id: body.id
    }, (result)=> {
        setTimeout(()=> {
            shopify.metafield.create({
                key: 'token',
                value: result.token,
                value_type: 'string',
                namespace: 'auth_token',
                owner_resource: 'Customer',
                owner_id: body.id
            }).then((result)=> {
                response.status(200).json(result)
            }).catch((error)=> {
                response.json(error)
            })
        }, 10000)
        // storeMetafield({
        //     key: 'token',
        //     value: result.token,
        //     value_type: 'string',
        //     namespace: 'auth_token',
        //     owner_resource: 'Customer',
        //     owner_id: body.id
        // }, (metafields)=> {
        //     response.status(200).json(result.token)
        // })
    })
    // response.status(200).json(result.token)
})



module.exports = router
