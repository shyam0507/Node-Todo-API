const {
    SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = 'abc123!';
var hashedPassword = '$2a$10$snq2xuATJdG7DXYNnPTGtOMxq6k/S1ddzP2/i1g0b8uXBySzjWUAK';

//generate hash
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 10
// };


// var token = jwt.sign(data, '123abc');
// console.log('token', token);


// var decoded = jwt.verify(token, '123abc');

// console.log('Decoded', decoded);

// var message = 'I am user number 3';

// var hash = SHA256(message).toString();

// console.log('Message: ', message);
// console.log('Hash: ', hash);

// var data = {

// }