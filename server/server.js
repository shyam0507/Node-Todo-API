require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {
    authenticate
} = require('./middleware/authenticate');

var {
    ObjectID
} = require('mongodb');

var {
    mongoose
} = require('./db/mongoose');

var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

var app = express();

app.use(bodyParser.json()); //middle ware
//app.use(authenticate);

/**
 * Add a new todo
 * async await mechanism
 */
app.post('/todos', authenticate, async (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    try {
        var doc = await todo.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }

});

app.get('/todos', authenticate, async (req, res) => {

    try {
        var todos = await Todo.find({
            _creator: req.user._id
        });
        res.send({
            todos
        });

    } catch (error) {
        res.status(400).send(error);
    }

});


//get the todo by id
app.get('/todo/:id', authenticate, async (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo not found invalid id');

    }

    try {
        var todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        res.send({
            todo
        });
    } catch (error) {
        res.status(400).send(error);
    }
});


app.delete('/todo/:id', authenticate, async (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {

        var todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }
        return res.send({
            todo
        });

    } catch (error) {
        return res.status(404).send();
    }

});

//Update the Todo
app.patch('/todo/:id', authenticate, async (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send({
            'message': 'Id not valid'
        });
    }

    try {

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        //console.log(body);

        var todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body

        }, {
            new: true
        });

        if (!todo) {
            return res.status(404).send();
        }

        return res.send({
            todo
        });

    } catch (error) {
        res.status(404).send();
    }

});


app.post('/users', async (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    console.log("Body", body);
    try {
        var user = await new User(body).save();
        var token = await user.generateAuthToken();

        console.log("In token", token);

        res.header('x-auth', token).json(user.toJSON());

    } catch (error) {
        console.log("In Error", error);
        res.status(400).json(error);
    }

});



app.get('/users/me', authenticate, async (req, res) => {
    //console.log("In Server", req.user);
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })

    }).catch(error => {
        res.status(400).send();
    });

});

app.delete('/users/me/token', authenticate, async (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })

});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};