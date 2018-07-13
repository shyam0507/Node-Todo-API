require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

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

/**
 * Add a new todo
 * promise method
 */
app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});


/**
 * Add a new todo
 * async await mechanism
 */
app.post('/todos-async', async (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    try {
        var doc = await todo.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }


});

app.get('/todos', async (req, res) => {

    try {

        var todos = await Todo.find();
        res.send({
            todos
        });

    } catch (error) {
        res.status(400).send(error);
    }

});


//get the todo by id
app.get('/todo/:id', async (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo not found invalid id');

    }

    try {
        var todo = await Todo.findById(id);
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


app.delete('/todo/:id', async (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {

        var todo = await Todo.findByIdAndRemove(id);

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
app.patch('/todo/:id', async (req, res) => {

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

        var todo = await Todo.findByIdAndUpdate(id, {
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

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};