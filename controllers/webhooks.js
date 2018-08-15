const express = require('express')
const { storeNewUser } = require('./../src/auth')

const router = express.Router()

router.post('/customer-created', function(request, response) {
    let body = request.body
    storeNewUser({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        id: body.id
    }, (result)=> {
        console.log(result)
        storeMetafield({
            key: 'token',
            value: result.token,
            value_type: 'string',
            namespace: 'auth_token',
            owner_resource: 'customer',
            owner_id: body.id
        }, ()=> {
            response.status(200).json(result.token)
        })
    })
})



module.exports = router
