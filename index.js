const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Always specify your env location, kids.
dotenv.config({ path: '.env' });

var app = express();

app.set('port', (process.env.PORT || 3002));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.use(require('./controllers'));

app.listen(app.get('port'), function () {
    console.log('Started server on port', app.get('port'));
});
