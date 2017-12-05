const axios = require('axios');

const url = 'https://' + process.env.SHOPIFY_API_KEY + ':' + process.env.SHOPIFY_PASSWORD + '@' + process.env.SHOPIFY_SHOP_NAME + '.myshopify.com/admin/orders.json';

let payload = {
    "order":
    {
        "customer":
        {
          "id": 207119551,
          "name": 'Mihai Blebea',
          "email": "mblebea@tfspark.com"
        },
        "financial_status": "pending",
        "line_items":
        [
            {
                "variant_id": 5910473146407,
                "quantity": 1
            }
        ]
    }
}


module.exports = {
    url,
    payload
}
