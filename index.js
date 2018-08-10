const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


require('dotenv').config()

var app = express()

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(bodyParser.json())
app.use('/public', express.static('public'))


app.use(require('./controllers'))


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'))
})
