// const shopifyAPI = require('shopify-node-api')
// const randomstring = require('randomstring')
//
// var auth = new shopifyAPI({
//     shop:                  process.env.SHOP_NAME,
//     shopify_api_key:       '081bf64a563489379cdb4d3ec048fb2f',
//     shopify_shared_secret: 'e936d9e5be58e3733e796ed4e5788347',
//     shopify_scope:         'write_products',
//     redirect_uri:          'http://localhost:3000/admin/callback',
//     nonce:                 randomstring.generate(7)
// })

module.exports = {
    shop:                  'mihaidev.myshopify.com',
    shopify_api_key:       '081bf64a563489379cdb4d3ec048fb2f',
    shopify_shared_secret: 'e936d9e5be58e3733e796ed4e5788347',
    shopify_scope:         'write_products',
    redirect_uri:          'http://localhost:3000/admin/callback',
    nonce:                 'nonce'
}
