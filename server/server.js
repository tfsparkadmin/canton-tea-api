const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://canton-tea.myshopify.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

let baseUrl = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com';

app.post('/shop', function(request, response) {
    axios.get(baseUrl + '/admin/shop.json').then((response)=> {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(response.data.shop));
      }).catch((err)=> {
      	console.log(err);
      });
});

// POST create new order
app.post('/credit-order', function(request, response) {

    let payload = request.body;

    let url = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com/admin/orders.json';


    let devUrl = 'https://1ec55068e218efe4d060390e1e065ea8:66a5ab8b4fffeaba915fcb06587fac03@canton-tea.myshopify.com/admin/orders.json';
    axios.post(devUrl, payload, {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
                console.log(result);
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({ response: 'ok', token: result.data.order.token, redirect: result.data.order.order_status_url}));
            }).catch((err)=> {
                console.log(err);
                response.send('Nu merge ' + err);
            });
});



app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
