const connect = require('./mongoose')


const UserSchema = new connect.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
})

const User = connect.model('User', UserSchema)

module.exports = User
