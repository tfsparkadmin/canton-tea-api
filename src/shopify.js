const Shopify = require('shopify-api-node')


const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOP_NAME,
    apiKey:   process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_PASSWORD
})

module.exports = shopify
