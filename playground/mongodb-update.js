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



    //find one and delete
    // db.collection('Todos').findOneAndUpdate({
    //     "_id": new ObjectID("5b3886b83ca5ff4eb68fe18a")
    // }, {
    //     $set: {
    //         'completed': true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(result => {

    //     console.log(result);

    // });

    db.collection('Users').findOneAndUpdate({
        "_id": ObjectID("5b3887ecfde621514894f5d0")
    }, {
        $set: {
            'name': 'Shyam nath'
        },

        $inc: {
            age: 1
        }
    }, function (err, result) {
        console.log(result);
    });


    //client.close();
});