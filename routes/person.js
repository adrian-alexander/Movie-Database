//DONE DEC 1 4:40PM

const express = require('express');
const search = require('../search')
const fs = require('fs');
const path = require('path');
const { formatWithOptions } = require('util');
const app = express();

app.get('/person/:personName', (req, res) => {
    let personData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')));
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let personName = req.params.personName;
    let listOfMovies = search(personName, ['actors', 'writer', 'director']);
    let followingButtonText = "Follow";
    let currentUser;


    //first, find the current user
    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }
    //then, find the person in the json file
    //next, check if im following them
    //if i am following them, render their page with the text "Remove"
    //else, text = "Follow"

    for (let people of personData) {
        if (personName.toLowerCase() == people.name.toLowerCase()) {
            for (let personID of currentUser.peopleFollowing) {
                if (people.personID == personID) {
                    followingButtonText = "Remove"
                    break;
                }
                else {
                    followingButtonText = "Follow";
                }
            }
            break;
        }
    }

    res.render('person.ejs', { movies: listOfMovies, personName: personName, followingButtonText: followingButtonText });
})

module.exports = app