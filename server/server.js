const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const api = require('./api.js');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.json());

// POST create new todo
app.get('/run', function(request, response) {
    // axios.headers.post['Content-Type'] = 'application/json';
    axios.post(api.url, api.payload, {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
        console.log(result.data);
        response.send('Merge');
    }).catch((err)=> {
        console.log(err);
        response.send('Nu merge ' + process.env.SHOPIFY_SHOP_NAME);
    });
    console.log(process.env.SHOPIFY_API_KEY);

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
