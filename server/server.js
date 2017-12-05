const express = require('express');
const bodyParser = require('body-parser');

var app = express();

// Setup middleware
app.use(bodyParser.json());

// POST create new todo
app.get('/run', function(request, response) {
    //Create task model
    response.send('Merge');

});


app.listen(3000, function() {
    console.log('Started server on port', 3000);
});
