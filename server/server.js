const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const api = require('./api.js');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST create new todo
app.get('/credit-order', function(request, response) {
    // axios.headers.post['Content-Type'] = 'application/json';
    axios.post(api.url, api.payload, {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
        response.send('Order placed. Order name is ' + result.data.order.name);
    }).catch((err)=> {
        response.send('Nu merge ' + err);
    });

});

app.post('/credit-order', function(request, response) {

    // this is the payload
    let payload = {
        order:
        {
            customer:
            {
              id: 207119551,
              name: 'Mihai Blebea',
              email: "mblebea@tfspark.com"
            },
            financial_status: "pending",
            line_items:
            [
                {
                    variant_id: 5910473146407,
                    quantity: 1
                }
            ]
        }
    }

    let data = JSON.parse(request.body.payload);
    for(let i = 0; i < data.length; i++)
    {
        payload.order.line_items.push({ variant_id: data[i].variant_id, quantity: data[i].quantity });
    };

    axios.post(api.url, payload, {headers: {
                "Content-Type": "application/json"}
            }).then((result)=> {
        response.send('Order placed by ' + request.body.payload + '. Order name is ' + result.data.order.name);
    }).catch((err)=> {
        response.send('Nu merge ' + err);
    });

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
