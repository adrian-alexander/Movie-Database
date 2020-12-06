const express = require('express');
let app = express();
let fs = require('fs');
let path = require('path');

app.get('/users/:user', (req, res, next) => {
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let followingButtonText = "Follow";
    let userName = req.params.user;
    let currentUser;

    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }

    for (let user of userData) {
        if (userName == user.userID) {
            for (let userID of currentUser.usersFollowing) {
                if (user.userID == userID) {
                    followingButtonText = "Remove";
                    break;
                }
                else {
                    followingButtonText = "Follow";
                }
            }
            break;
        }
    }

    if (!req.params.user.match(/^\d+$/)) {
        next();
        return;
    }

    let userID = req.params.user;
    let user;
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].userID == userID) {
            user = userData[i];
            break;
        }
    }
    res.render('user.ejs', {followingButtonText: followingButtonText, user: user});

})

//Get current user
app.get('/users/me/', (req, res) => {
    res.json(req.session.user);
})

app.post('/users/me', (req, res) => {
    let userDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let currentUser;
    for (let i in userDataJSON) {
        if (req.session.user.userID == userDataJSON[i].userID) {
            currentUser = i;
            break;
        }
    }

    for (let key of Object.keys(req.body)) {
        //Update req.session
        req.session.user[key] = req.body[key];
        //Update user next
        userDataJSON[currentUser][key] = req.body[key];
    }
    fs.writeFileSync(path.join(__dirname, '..', 'users.json'), JSON.stringify(userDataJSON));
    res.status(200);
    res.send({});
})





module.exports = app;