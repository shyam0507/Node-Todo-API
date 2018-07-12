const {
    mongoose
} = require('./../server/db/mongoose');

const {
    Todo
} = require('./../server/models/todo');


const {
    User
} = require('./../server/models/user');

const {
    ObjectID
} = require('mongodb');

//Remove all
// Todo.remove({}).then(data => {
//     console.log("Removed", data);
// });

//Remove By Id
// Todo.findByIdAndRemove('5b46e84f92df18123f433bbc').then(doc => {
//     console.log(doc);
// });

//Remove one
Todo.findOneAndRemove({
    _id: '5b46e8ed92df18123f433bbe'
}).then(doc => {
    console.log(doc);
});