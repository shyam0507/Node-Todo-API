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

// var id = '5b456dd7a19086144138b1ac1';

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid')
// }

// Todo.find({
//     _id: id //moongose parses to Objet id internally
// }).then((todos) => {
//     console.log('Todos', todos);
// });


// Todo.findOne({
//     _id: id //moongose parses to Objet id internally
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by id', todo);
// }).catch(e => console.log(e));


var id = '5b407813f607ed16326979d4';
User.findById(id).then((user) => {
    if (!user) {
        return console.log('Id not found');
    }
    console.log('User by id', user);
}).catch(e => console.log(e));