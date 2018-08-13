const express = require('express')
const axios = require('axios')
const shopify = require('./../src/shopify')
const { calculateTax } = require('./../src/shipping')
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
        response.json(calculateTax(zones, cart, countryCode))
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
