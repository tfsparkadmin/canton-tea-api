const express = require('express')
const { storeNewUser } = require('./../src/auth')
const { storeMetafield } = require('./../src/metafield')
const shopify = require('./../src/shopify')

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
            let obj = {
                key: 'token',
                value: result.token,
                value_type: 'string',
                namespace: 'auth_token',
                owner_resource: 'customer',
                owner_id: body.id
            }
            console.log(body.id)
            shopify.metafield.create(obj).then((result)=> {
                response.status(200).json(result)
            }).catch((error)=> {
                console.log(error)
            })
        }, 10000)
    })
    response.status(200).json()
    console.log('some stuff')
})



module.exports = router
