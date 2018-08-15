const express = require('express')
const { storeNewUser } = require('./../src/auth')

const router = express.Router()

router.post('/user-login', (request, response)=> {
    var body = request.body
    
})


module.exports = router
