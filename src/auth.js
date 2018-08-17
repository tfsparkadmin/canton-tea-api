const jwt = require('jsonwebtoken')
const User = require('./../database/user')


const salt = '123456abc'

const generateToken = (firstName, lastName, email)=> {
    return token = jwt.sign({
        firstName: firstName,
        lastName: lastName,
        email: email
    }, salt)
}

const storeNewUser = (payload, callback)=> {
    var token = generateToken(payload.firstName, payload.lastName, payload.email)
    if(token)
    {
        var user = new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            token: token
        })

        User.update({ email: payload.email }, {
            $set: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                token: token
            }
        },{ upsert: true }).then((result)=> {
            callback(result)
        }).catch((error)=> {
            console.log(error)
        })



        // user.save().then((result)=> {
        //     callback(result)
        // }).catch((error)=> {
        //     console.log(error)
        // })
    }
    return null
}

const verifyToken = (token, callback)=> {
    User.findOne({ token: token }).then((result)=> {
        if(result !== null)
        {
            callback(true)
        } else {
            callback(false)
        }
    }).catch((error)=> {
        console.log(error)
    })
}

module.exports = {
    generateToken,
    storeNewUser,
    verifyToken
}
