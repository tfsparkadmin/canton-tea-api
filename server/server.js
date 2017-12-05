const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 3000));
// Setup middleware
app.use(bodyParser.json());

// POST create new todo
app.get('/run', function(request, response) {
    //Create task model
    response.send('Merge');

});


app.listen(app.get('port'), function() {
    console.log('Started server on port', app.get('port'));
});
