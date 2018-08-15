const express = require('express')
const { storeNewUser } = require('./../src/auth')

const router = express.Router()

router.get('/customer-created', function(request, response) {
    console.log(request.body)
    storeNewUser({
        firstName: 'Mihai',
        lastName: 'Blebea',
        email: 'mblebea@tfspark.com'
    }, (result)=> {
        response.status(200).json(result.token)
    })
})



module.exports = router
