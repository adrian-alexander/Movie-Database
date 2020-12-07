const express = require('express');
let app = express();
let fs = require('fs');
let path = require('path');

app.get('/users/:user', (req, res, next) => {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let peopleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')));
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

    let movieNames = {};
    for (let movie of movieData) {
        if (user.favouriteMovies.includes(movie.imdbID) || user.watchlist.includes(movie.imdbID)) {
            movieNames[movie.imdbID] = movie;
        }
    }

    let peopleNames = {};
    for (let person of peopleData) {
        if (user.peopleFollowing.includes(person.personID)) {
            peopleNames[person.personID] = person;
        }
    }

    let userNames = {};
    for (let users of userData) {
        if (user.usersFollowing.includes(users.userID)) {
            userNames[users.userID] = users;
        }
    }
    res.render('user.ejs', {userNames: userNames, peopleNames: peopleNames, movieNames: movieNames, followingButtonText: followingButtonText, user: user});

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