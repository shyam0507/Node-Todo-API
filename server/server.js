var express = require('express');
var bodyParser = require('body-parser');

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


app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app
};