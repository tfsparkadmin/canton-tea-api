const express = require('express')
const axios = require('axios')
const shopify = require('./../src/shopify')
const router = express.Router()


const baseUrl = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com';
const devUrl = 'https://1ec55068e218efe4d060390e1e065ea8:66a5ab8b4fffeaba915fcb06587fac03@canton-tea.myshopify.com';
const plainUrl = 'https://canton-tea.myshopify.com';

let url = devUrl
if(process.env.PORT !== 3000)
{
    url = baseUrl
}


router.post('/shop', function(request, response) {
    axios.get(url + '/admin/shop.json').then((result)=> {
        response.send(JSON.stringify(result.data.shop));
    }).catch((err)=> {
      	console.log(err);
    });
});

router.post('/collections', function(request, response) {
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

router.post('/products', function(request, response) {
    let id = request.body.id;
    axios.get(url + '/admin/products.json?collection_id=' + id).then((result)=> {
        response.send(result.data.products);
    }).catch((err)=> {
        console.log(err)
        response.send(err)
    })
})

router.post('/cart', function(request, response) {
    axios.get(devUrl + '/cart.js').then((result)=> {
        console.log(result.data)
        response.send('ok');
    }).catch((err)=> {
        console.log(err)
        response.send(err)
    })
})

// POST create new order
router.post('/credit-order', function(request, response) {
    let payload = request.body;
    axios.post(url + '/admin/orders.json', payload).then((result)=> {
        response.setHeader('Content-Type', 'application/json')
        response.send(JSON.stringify({
            response: 'ok',
            token: result.data.order.token,
            redirect: result.data.order.order_status_url
        }))
    }).catch((err)=> {
        console.log(err)
    })
})

router.post('/shipping-methods', function(request, response) {
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
                if(zones[i].countries[j].code == countryCode || zones[i].countries[j].code === '*')
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
                            shipping_tax.push(weight[k]);
                        }
                    }

                    // Get shipping zone by price
                    let price = zones[i].price_based_shipping_rates;
                    for(let h = 0; h < price.length; h++)
                    {

                        let min = parseFloat(price[h].min_order_subtotal);
                        let max = (price[h].max_order_subtotal !== null) ? parseFloat(price[h].max_order_subtotal) : 9999999999999;

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

        response.send(JSON.stringify(result))
    }).catch((err)=> {
        response.send(JSON.stringify(err))
    })

    // response.send(JSON.stringify(payload));
})

router.get('/get-shipping-zones', function(request, response) {
    shopify.shippingZone.list({ limit: 5 }).then((zones)=> {
        response.send(JSON.stringify(zones))
    }).catch((err)=> {
        response.send(JSON.stringify(err))
    })
})

router.get('/create-checkout', function(request, response) {
    shopify.checkout.list({ limit: 5 }).then((result)=> {
        response.send(JSON.stringify(result));
    }).catch((err)=> {
        response.send(JSON.stringify(err));
    });
})

module.exports = router
