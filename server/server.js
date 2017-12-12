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

// GET create new order
app.get('/credit-order', function(request, response) {
    // axios.headers.post['Content-Type'] = 'application/json';
    axios.post(api.url, api.payload, { headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
        response.send('Order placed. Order name is ' + result.data.order.name);
    }).catch((err)=> {
        response.send('Nu merge ' + err);
    });

});

// POST create new order
app.post('/credit-order', function(request, response) {

    const url = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com/admin/orders.json';
    let payload = request.body.payload;
    let devUrl = 'https://1ec55068e218efe4d060390e1e065ea8:66a5ab8b4fffeaba915fcb06587fac03@canton-tea.myshopify.com/admin/orders.json';
    axios.post(url, JSON.parse(payload), {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
                console.log(result);
                // response.setHeader('Content-Type', 'application/json');
                // response.send(JSON.stringify({ response: 'ok' }))
                // response.redirect('https://checkout.shopify.com/' + shop + '/orders/' + result.data.order.token);
            }).catch((err)=> {
                console.log(err);
                response.send('Nu merge ' + err);
            });

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
