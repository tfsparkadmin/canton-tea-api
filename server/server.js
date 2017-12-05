const express = require('express');
const bodyParser = require('body-parser');

const request = require('./request.js');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.json());

// POST create new todo
app.get('/', function(request, response) {
    request.createOrder();
    console.log(process.env.SHOPIFY_SHOP_NAME);
    response.send('Merge');

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
