const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Shopify = require('shopify-api-node');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://cantontea.com');

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


const shopify = new Shopify({
    shopName: 'canton-tea',
    apiKey: '1ec55068e218efe4d060390e1e065ea8',
    password: '66a5ab8b4fffeaba915fcb06587fac03'
});


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
        // response.send(JSON.stringify(result.data.custom_collections));
        let customCol = result.data.custom_collections;
        axios.get(url + '/admin/smart_collections.json').then((res)=> {
            let smartCol = res.data.smart_collections;
            for(let i = 0; i < customCol.length; i++)
            {
                smartCol.push(customCol[i]);
            }

            response.send(JSON.stringify(smartCol));
        }).catch((err)=> {
            console.log(err)
            response.send(err)
        })
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

    // let id = request.body.id;
    console.log(payload)
    axios.post(url + '/admin/orders.json', payload).then((result)=> {
                console.log(result);
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({ response: 'ok', token: result.data.order.token, redirect: result.data.order.order_status_url}));
            }).catch((err)=> {
                console.log(err);
                response.send('Nu merge ' + err);
            });
});

app.post('/shipping-methods', function(request, response) {
    let payload = request.body;
    let address = payload.address;
    let cart    = payload.cart;

    let countryCode = address.country_code;

    shopify.shippingZone.list({ limit: 5 }).then((zones)=> {
        let shipping_tax = [];
        let tax_lines = [];

        for(let i = 0; i < zones.length; i++)
        {
            for(let j = 0; j < zones[i].countries.length; j++)
            {
                if(zones[i].countries[j].code == countryCode)
                {

                    tax_lines.push({
                        price: cart.total_price * zones[i].countries[j].tax,
                        rate: zones[i].countries[j].tax,
                        title: zones[i].countries[j].tax_name
                    });

                    // Get shipping zone by weight
                    let weight = zones[i].weight_based_shipping_rates;
                    for(let k = 0; k < weight.length; k++)
                    {
                        if((weight[k].weight_low * 1000) <= cart.total_weight && (weight[k].weight_high * 1000) >= cart.total_weight)
                        {
                            console.log('this is the correct weight', weight)
                            shipping_tax.push(weight[k]);
                        }
                    }

                    // Get shipping zone by price
                    let price = zones[i].price_based_shipping_rates;
                    for(let h = 0; h < price.length; h++)
                    {

                        let min = parseFloat(price[h].min_order_subtotal);
                        let max = (price[h].max_order_subtotal !== null) ? parseFloat(price[h].max_order_subtotal) : 9999999999999;

                        console.log('min:', min, 'max:', max, 'real_total:', parseFloat(cart.total_price))

                        if(min <= parseFloat(cart.total_price) && max > parseFloat(cart.total_price))
                        {
                            shipping_tax.push(price[h]);
                        }
                    }
                }
            }
        }

        // Combine shipping info with VAT tax in one object to send back to store
        let result = {
            shipping_tax: shipping_tax,
            tax_lines: tax_lines
        }

        response.send(JSON.stringify(result));
    }).catch((err)=> {
        response.send(JSON.stringify(err));
    });

    // response.send(JSON.stringify(payload));
});




app.get('/get-shipping-zones', function(request, response) {
    shopify.shippingZone.list({ limit: 5 }).then((zones)=> {
        response.send(JSON.stringify(zones));
    }).catch((err)=> {
        response.send(JSON.stringify(err));
    });
})

app.get('/create-checkout', function(request, response) {
    shopify.checkout.list({ limit: 5 }).then((result)=> {
        response.send(JSON.stringify(result));
    }).catch((err)=> {
        response.send(JSON.stringify(err));
    });
})


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
