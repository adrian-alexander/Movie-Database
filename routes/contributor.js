const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const addPersonScript = require('../addPersonScript');
app.use(express.urlencoded({ extended: false }))

app.get('/contributor', (req, res) => {
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let currentUser;
    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }
    if (currentUser.userType == "normal") {
        res.redirect('/private/myaccount');
        return;
    }
    res.render('contributor.ejs')
})

app.get('/contributor/addmovie', (req, res) => {
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let currentUser;
    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }
    if (currentUser.userType == "normal") {
        res.redirect('/private/myaccount');
        return;
    }
    res.render('addmovie.ejs')

})

app.get('/contributor/addperson', (req, res) => {
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let currentUser;
    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }
    if (currentUser.userType == "normal") {
        res.redirect('/private/myaccount');
        return;
    }
    res.render('addperson.ejs')

})


app.post('/contributor/addmovie', async (req, res) => {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));
    let peopleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')))
    let count = 0;
    for (let movie of movieData) {
        if (req.body.imdbID == movie.imdbID) {
            count++;
            break;
        }
    }
    if (count == 0) {
        //Now check if the people exist in the database
        let directorCount = 0;
        let writerCount = 0;
        let actorCount = 0;
        let directors = req.body.director.split(/\s*,\s*/);
        let writers = req.body.writer.split(/\s*,\s*/)
        let actors = req.body.actors.split(/\s*,\s*/)
        for (let person of peopleData) {
            for (let director of directors) {
                if (director.includes(person.name)) {
                    directorCount++;
                }
            }
            for (let writer of writers) {
                if (writer.includes(person.name)) {
                    writerCount++;
                }
            }
            for (let actor of actors) {
                if (actor.includes(person.name)) {
                    actorCount++;
                }
            }
        }
        if ((directorCount == directors.length) && (writerCount == writers.length) && (actorCount == actors.length)) {
            movieData.push({
                'Title': req.body.title,
                'Year': req.body.year,
                'Runtime': req.body.runtime,
                'Genre': req.body.genre,
                'Director': req.body.director,
                'Writer': req.body.writer,
                'Actors': req.body.actors,
                'Plot': req.body.plot,
                'Poster': req.body.poster,
                'imdbID': req.body.imdbID
            })
            const stringifyMovieData = JSON.stringify(movieData);
            fs.writeFileSync('movie-data.json', stringifyMovieData);
            res.redirect('/private/contributor/');
            console.log("Successfully added a movie to the database!");
            return;
        }
        else {
            res.redirect('/private/contributor/');
            console.log("A person doesn't exist in the database.");
        }
    }
    else {
        res.redirect('/private/contributor/');
        console.log("Movie already exists in the database.");
    }
})

app.post('/contributor/addperson', async (req, res) => {
    console.log(req.body.name);
    let peopleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')));
    let count = 0;
    //This goes through the people.json and searches for the person's name. If there are any matches, it adds 1 to the count.
    for (let person of peopleData) {
        if (req.body.name.toLowerCase() == person.name.toLowerCase()) {
            count++
            break;
        }
    }
    if (count == 0) {
        peopleData.push({
            'name': req.body.name
        })
        const stringifyPeopleData = JSON.stringify(peopleData);
        fs.writeFileSync('people.json', stringifyPeopleData);
        //addPersonScript();
        console.log("Success!")
        res.redirect('/private/contributor/');
    }
    else {
        res.redirect('/private/contributor/');
        console.log("Person already exists in the database.");
    }
})

module.exports = app;