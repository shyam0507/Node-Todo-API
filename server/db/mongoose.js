var mongoose = require('mongoose');

//Shyam
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');


module.export = {
    mongoose
};