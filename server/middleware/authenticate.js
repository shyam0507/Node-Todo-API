var {
    User
} = require('./../models/user');

var authenticate = async (req, res, next) => {

    var token = req.header('x-auth');
    //console.log(token);

    try {
        var user = await User.findByToken(token);
        if (!user) {
            throw new Error('user not found');
        }

        req.user = user;
        req.token = token;
        //console.log("In Auth", req.user);
        next();
    } catch (error) {
        //console.log(error);
        res.status(401).send();
    }


}

module.exports = {
    authenticate
}