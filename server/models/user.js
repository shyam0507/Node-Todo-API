var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//mongoose.set('debug', true);



var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message: '{VALUE} is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

/**
 * Custom method to restrict the JSON values that are passed to the user
 */
UserSchema.methods.toJSON = function () {
    var user = this;

    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);


};

/**
 * Custom method to generate Auth Token
 * the method is based on the user instance 
 */
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({
        _id: user._id.toHexString()
    }, 'abc123');

    //push the token to the data
    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    });
};

/**
 * Custom Model method to find and verify the token
 */
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    //console.log('token', token);

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        //console.log(e);
        return new Promise(function (resolve, reject) {
            return reject();
        });
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {

    var User = this;

    return User.findOne({
        email
    }).then(user => {

        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {

            bcrypt.compare(password, user.password,
                (err, res) => {

                    if (res) {
                        resolve(user);
                    } else {
                        reject();
                    }

                });

        });

    });

};

UserSchema.pre('save', function (next) {

    var user = this;
    //check if password was modified
    if (user.isModified('password')) {

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });

        });

    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};