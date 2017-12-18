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

const baseUrl = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com';
const devUrl = 'https://1ec55068e218efe4d060390e1e065ea8:66a5ab8b4fffeaba915fcb06587fac03@canton-tea.myshopify.com';
const plainUrl = 'https://canton-tea.myshopify.com';

app.post('/shop', function(request, response) {
    let url = devUrl;
    if(app.get('port') !== 3000)
    {
        url = baseUrl;
    }
    axios.get(url + '/admin/shop.json').then((result)=> {
        response.send(JSON.stringify(result.data.shop));
    }).catch((err)=> {
      	console.log(err);
    });
});

app.post('/collections', function(request, response) {
    let url = devUrl;
    if(app.get('port') !== 3000)
    {
        url = baseUrl;
    }
    axios.get(url + '/admin/custom_collections.json').then((result)=> {
        response.send(JSON.stringify(result.data.custom_collections));
    }).catch((err)=> {
        console.log(err)
        response.send(err)
    })
});

app.post('/products', function(request, response) {
    let url = devUrl;
    if(app.get('port') !== 3000)
    {
        url = baseUrl;
    }

    let id = request.body.id;
    axios.get(url + '/admin/products.json?collection_id=' + id).then((result)=> {
        response.send(result.data.products);
    }).catch((err)=> {
        console.log(err)
        response.send(err)
    })
});

app.post('/cart', function(request, response) {
    axios.get(devUrl + '/cart.js').then((result)=> {
        console.log(result.data)
        response.send('ok');
    }).catch((err)=> {
        console.log(err)
        response.send(err)
    })
});

// POST create new order
app.post('/credit-order', function(request, response) {

    let payload = request.body;
    let url = devUrl;
    if(app.get('port') !== 3000)
    {
        url = baseUrl;
    }

    let id = request.body.id;

    axios.post(url, payload, {headers: {
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
