const shopify = require('./shopify')

const storeMetafield = (object, callback)=> {
    shopify.metafield.create(object).then((result)=> {
        callback(result)
    }).then((error)=> {
        console.log(error)
    })
}

module.exports = {
    storeMetafield
}
