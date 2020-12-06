const express = require('express');
let app = express();
let fs = require('fs');
let path = require('path');
let userDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));

app.get('/user/:user', (req, res, next) => {
    if (!req.params.user.match(/^\d+$/)) {
        next();
        return;
    }

    let userID = req.params.user;
    let user;
    for (let i = 0; i < userDataJSON.length; i++) {
        if (userDataJSON[i].userID == userID) {
            user = userDataJSON[i];
            break;
        }
    }
    res.render('user.ejs', {user: user});

})

//Get current user
app.get('/users/me/', (req, res) => {
    res.json(req.session.user);
})

app.post('/users/me', (req, res) => {
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