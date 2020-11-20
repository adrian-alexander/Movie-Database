const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        let user = new User ({
            name: req.body.username,
            password: req.body.password,
        })
        user.save()
            .then(user => {
                res.json({
                    message: 'User registered successfully!'
                })
            })
            .catch(error => {
                res.json({
                    message: 'An error occured!'
                })
            })
    })
}

module.exports = {
    register
}