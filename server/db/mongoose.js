var mongoose = require('mongoose');

//Shyam
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI);


module.export = {
    mongoose
};

process.env