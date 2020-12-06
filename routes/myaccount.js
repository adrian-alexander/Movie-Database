const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/myaccount', (req, res) => {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let peopleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')));
    let buttonText = "";
    let currentUser;
    if (req.session.user.userType == "normal") {
        buttonText = "Click here to change account type to Contributor";
    }
    else {
        buttonText = "Click here to change account type to Normal";
    }

    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }

    let movieNames = {};
    for (let movie of movieData) {
        if (currentUser.favouriteMovies.includes(movie.imdbID) || currentUser.watchlist.includes(movie.imdbID)) {
            movieNames[movie.imdbID] = movie;
        }
    }

    let peopleNames = {};
    for (let person of peopleData) {
        if (currentUser.peopleFollowing.includes(person.personID)) {
            peopleNames[person.personID] = person;
        }
    }

    let userNames = {};
    for (let user of userData) {
        if (currentUser.usersFollowing.includes(user.userID)) {
            userNames[user.userID] = user;
        }
    }

    res.render('myaccount.ejs', { userNames: userNames, peopleNames: peopleNames, movieNames: movieNames, user: currentUser, buttonText: buttonText });
})

module.exports = app