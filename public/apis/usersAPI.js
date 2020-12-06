const express = require('express');
const app = express();
//const publicSearch = require('../../publicSearch');
const fs = require('fs');
const path = require('path');
let userDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../../important/', 'users.json')));

app.get('/api/users', (req, res) => {
    if (req.query.name) {
        for (userName of userDataJSON) {
            if (userName.name.includes(req.query.name)) {
                res.send(userName);
                break;
            }
        }
    }
    if (req.query.name == "") {
        res.send(userDataJSON);
    }
    else {
        res.send("No users with that name");
        res.status(404);
    }
})

app.get('/api/users/:user', (req, res) => {
    let userID = req.params.user;
    let user = {};
    for (let i = 0; i < userDataJSON.length; i++) {
        if (userDataJSON[i].userID == userID) {
            user = Object.assign({}, userDataJSON[i]);
            break;
        }
    }
    res.send(user);
})

module.exports = app;