const { verifyToken } = require('./../src/auth')

const jwtAuth = (request, response, next)=> {
    let authToken = request.query.auth_token
    if(authToken)
    {
        verifyToken(authToken, (result)=> {
            if(result === true)
            {
                next()
            } else {
                response.status(401).send()
            }
        })
    } else {
        response.status(401).send()
    }
}

module.exports = {
    jwtAuth
}
