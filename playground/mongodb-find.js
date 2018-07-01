//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to connect to the database server');
    }
    console.log('connected to Mongo DB server');

    const db = client.db('TodoApp');

    db.collection('Todos').find({}).toArray().then(fullfilled => {
        console.log("Todos");
        console.log(JSON.stringify(fullfilled, undefined, 2));
    }, (err) => {

    });


    //client.close();
});