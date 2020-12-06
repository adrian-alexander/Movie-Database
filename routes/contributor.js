const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

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
        res.send("Not a contributor.");
        res.status(405);
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
        res.send("Not a contributor.");
        res.status(405);
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
        res.send("Not a contributor.");
        res.status(405);
        return;
    }
    res.render('addperson.ejs')
    
})


app.post('/contributor/addmovie', async (req, res) => {
    console.log("SO GAY");
    console.log(req.body);
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'addmovie.json')));
    movieData.push({
        'Title': req.body.Title, 
        'Year': req.body.Year,
        'Runtime': req.body.Runtime,
        'Genre': req.body.Genre,
        'Director': req.body.Director,
        'Writer': req.body.Writer,
        'Actors': req.body.Actors,
        'Plot': req.body.Plot,
        'Poster': req.body.Poster,
        'imdbID': req.body.ImdbID
    })
    console.log(movieData);
    const stringifyMovieData = JSON.stringify(movieData);
    fs.writeFileSync('addmovie.json', stringifyMovieData);
    //res.send('Successfully added a movie');
    //res.redirect('/private/contributor/');

})
module.exports = app;