const errorMsg = (value, msg)=> {
    if(value === undefined)
    {
        throw (msg) ? msg : 'Value not set on zones object'
    }
}

const minTax = (zone)=> {
    errorMsg(zone.min_order_subtotal)
    return parseFloat(zone.min_order_subtotal)
}

const maxTax = (zone)=> {
    errorMsg(zone.max_order_subtotal)
    return (zone.max_order_subtotal !== null) ? parseFloat(zone.max_order_subtotal) : 9999999999999
}

const weightMin = (zone)=> {
    errorMsg(zone.weight_low, 'Weight low not set')
    return zone.weight_low * 1000
}

const weightMax = (zone)=> {
    errorMsg(zone.weight_high, 'Weight high not set')
    return zone.weight_high * 1000
}


const taxByPrice = (zones, cart)=> {
    errorMsg(cart.total_price, 'Total price not set on cart object')
    return zones.filter((zone)=> {
        if(minTax(zone) <= parseFloat(cart.total_price) && maxTax(zone) > parseFloat(cart.total_price))
        {
            return zone
        }
    })
}

const taxByWeight = (zones, cart)=> {
    errorMsg(cart.total_weight, 'Total weight not set on cart object')
    return zones.filter((zone)=> {
        if(weightMin(zone) <= cart.total_weight && weightMax(zone) >= cart.total_weight)
        {
            return zone
        }
    })
}

const calculateTax = (data, cart, countryCode)=> {
    let shipping_tax = []
    let tax_lines = []

    data.forEach((zone)=> {
        console.log(zone)
        zone.countries.forEach((country)=> {
            // if(country.code === countryCode || country.code === "*")
            // {
            //     tax_lines.push({
            //         price: cart.total_price * country.tax,
            //         rate:  country.tax,
            //         title: country.tax_name
            //     })
            //
            //     let taxWeight = taxByWeight(zone.weight_based_shipping_rates, cart)
            //     if(taxWeight.length > 0)
            //     {
            //         shipping_tax.push(taxWeight)
            //     }
            //
            //     let taxPrice = taxByPrice(zone.price_based_shipping_rates, cart)
            //     if(taxPrice.length > 0)
            //     {
            //         shipping_tax.push(taxPrice)
            //     }
            // }
            tax_lines.push({
                price: cart.total_price * country.tax,
                rate:  country.tax,
                title: country.tax_name
            })
        })

        let taxWeight = taxByWeight(zone.weight_based_shipping_rates, cart)
        if(taxWeight.length > 0)
        {
            shipping_tax.push(taxWeight)
        }

        let taxPrice = taxByPrice(zone.price_based_shipping_rates, cart)
        if(taxPrice.length > 0)
        {
            shipping_tax.push(taxPrice)
        }
        // })
    })

    return {
        shipping_tax,
        tax_lines
    }
}


module.exports = {
    taxByPrice,
    taxByWeight,
    calculateTax
}
