const Shopify = require('shopify-api-node')


const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    apiKey:   process.env.API_KEY,
    password: process.env.PASSWORD
})

module.exports = shopify
