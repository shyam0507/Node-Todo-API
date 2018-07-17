var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

mongoose.set('debug', true);

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
            message: '{Value} is not valid'
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

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};