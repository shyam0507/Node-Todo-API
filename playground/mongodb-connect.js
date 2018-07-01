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

    db.collection('Todos').insertOne({
        text: 'Buy grocessory',
        completed: false
    }, (err, result) => {
        if (err) {
            console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result, undefined, 2));
    });


    // db.collection('Users').insertOne({
    //     name: 'Shyam',
    //     age: 27,                                  
    //     location: 'Noida'
    // }, (err, result) => {
    //     if (err) {
    //         console.log('Unable to insert user', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    client.close();
});