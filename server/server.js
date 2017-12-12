const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const api = require('./api.js');

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

// POST create new todo
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

app.post('/credit-order', function(request, response) {

    // this is the payload
    // let payload = {
    //     order:
    //     {
    //         customer:
    //         {
    //           id: request.body.id,
    //           name: request.body.name,
    //           email: request.body.email
    //         },
    //         financial_status: "pending",
    //         line_items:[]
    //     }
    // }


    // let data = request.body;
    // // let shop = data['shop'];
    // let items = data['items'];
    // // let i = 0;
    // // while (items) {
    // //     let item = data["line_" + i].split('/');
    // //     payload.order.line_items.push({ variant_id: item[0], quantity: item[1] });
    // //     i++;
    // // }
    // for(let i = 0; i < items.length; i++)
    // {
    //     let item = items[i].split('/');
    //     payload.order.line_items.push({ variant_id: item[0], quantity: item[1] });
    // }

    let payload = request.body;
    axios.post(api.url, payload, {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
        response.redirect('https://checkout.shopify.com/' + shop + '/orders/' + result.data.order.token);
    }).catch((err)=> {
        response.send('Nu merge ' + err);
    });

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
