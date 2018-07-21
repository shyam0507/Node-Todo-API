const {
    ObjectID
} = require('mongodb');

const {
    Todo
} = require('./../../models/todo');

const {
    User
} = require('./../../models/user');

const jwt = require('jsonwebtoken');


//Dummy User
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'shyam432168@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId,
            access: 'auth'
        }, 'abc123').toString()
    }]

}, {
    _id: userTwoId,
    email: 'nuevothoughts.shyam@gmail.com',
    password: 'userTwoPass',
}];

//Dummy todos
const todos = [{
    _id: new ObjectID(),
    text: 'Todo 1'
}, {
    _id: new ObjectID(),
    text: 'Todo 2',
    completed: true
}];

const populateTodos = (done) => {
    //console.log("In Before");
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {

        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);

    }).then(() => {
        done();
    });
};


module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}