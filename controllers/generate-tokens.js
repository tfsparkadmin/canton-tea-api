const express = require('express')
const shopify = require('./../src/shopify')
const { storeNewUser } = require('./../src/auth')

const router = express.Router()


const baseUrl = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com';

router.get('/users', (request, response)=> {
    shopify.customer.list().then((customers)=> {
        // response.json(customers)
        customers.map((customer)=> {
            storeNewUser({
                firstName: customer.first_name,
                lastName: customer.last_name,
                email: customer.email,
                id: customer.id
            }, (result)=> {
                let obj = {
                    key: 'token',
                    value: result.token,
                    value_type: 'string',
                    namespace: 'auth_token',
                    owner_resource: 'customer',
                    owner_id: customer.id
                }
                shopify.metafield.create(obj).then((result)=> {
                    console.log(result)
                }).catch((error)=> {
                    console.log(error)
                })
            })
        })
    })
})

module.exports = router
