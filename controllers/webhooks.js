const express = require('express')
const { storeNewUser } = require('./../src/auth')

const router = express.Router()

router.post('/customer-created', function(request, response) {
    console.log(request.body)
    // Must get first name, last name, email and id of the newly creted user
    // storeNewUser({
    //     firstName: 'Mihai',
    //     lastName: 'Blebea',
    //     email: 'mblebea@tfspark.com'
    // }, (result)=> {
    //     storeMetafield({
    //         key: 'token',
    //         value: result.token,
    //         value_type: 'string',
    //         namespace: 'auth_token',
    //         owner_resource: 'customer',
    //         owner_id: customer_id
    //     }, ()=> {
    //         response.status(200).json(result.token)
    //     })
    // })
    response.status(200).send()
})



module.exports = router
