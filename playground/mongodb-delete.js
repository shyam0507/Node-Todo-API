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

    //delete many
    // db.collection('Todos').deleteMany({
    //     'text': 'Buy grocessory'
    // }).then(result => {

    //     console.log(result)

    // });

    //delete one
    // db.collection('Todos').deleteOne({
    //     'text': 'Buy grocessory'
    // }).then(result => {

    //     console.log(result)

    // });

    //find one and delete
    db.collection('Todos').findOneAndDelete({
        'text': 'Buy grocessory'
    }).then(result => {

        console.log(result);

    });


    //client.close();
});