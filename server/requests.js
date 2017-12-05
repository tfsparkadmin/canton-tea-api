import axios from 'axios';

function createOrder()
{
    const url = 'https://1ec55068e218efe4d060390e1e065ea8:66a5ab8b4fffeaba915fcb06587fac03@canton-tea.myshopify.com/admin/orders.json';
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

    axios.post(url, payload).then((response)=> {
        console.log(response.data);
    }).catch((err)=> {
        console.log(err)
    });
}

export {
    createOrder
}
