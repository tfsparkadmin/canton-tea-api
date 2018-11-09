const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongooseOptions = {
    useNewUrlParser: true
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

module.exports = mongoose;
