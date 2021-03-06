const search = require('../search')
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
let movieDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));

//GET /movies/:movieID
app.get('/movies/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
            break;
        }
    }
    res.json(movie);
})


app.post('/movies', (req, res) => {
    let template = [
        'Title', 'Year',
        'Released', 'Runtime', 'Genre',
        'Director', 'Writer', 'Actors',
        'Plot', 'Language', 'Country',
        'Poster',
        'imdbID', 'Type',
        'BoxOffice', 'Production',
        'Response'
    ]

    for (let key of template) {
        if (!req.body[key]) {
            res.status(400);
            res.send("Bad Request");
            return;
        }
    }
    movieDataJSON.push(req.body);
    const movieDataStringify = JSON.stringify(movieDataJSON);
    fs.writeFileSync(path.join(__dirname, '..', 'movie-data.json'), movieDataStringify);
    res.status(200);
    res.send("OK");
})

function parseString(str) {
    //Regex explanation: ^ = start of line, (.*?) = all text after the start of the line, 
    //\s? = optional space, \(.*\) = matching any text surrounded by brackets, ? = that whole bit is optional, $ = go to the end of the line
    let splitComma = str.split(", ");
    let noBrackets = [];
    for (let element of splitComma) {
        noBrackets.push(element.match(/^(.*?)(\s?\(.*\))?$/)[1]);
    }
    return noBrackets;
}
//go into movielist, find the movie we wanna show and then save that all the data for the movie
app.get('/movie/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    let userData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json')));
    let currentUser;
    let watchlistButtonText = "Add to watchlist";
    let favouritesButtonText = "Add to favourite movies";

    let contributor = 0
    if (req.session.user.userType == "contributor") {
        contributor = 1;
    }
    let editLink = "/private/movie/" + movieID + "/edit";

    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
            break;
        }
    }

    //find current user
    for (let user of userData) {
        if (req.session.user.userID == user.userID) {
            currentUser = user;
            break;
        }
    }


    for (let movie1 of currentUser.watchlist) {
        if (movie1 == movie.imdbID) {

            watchlistButtonText = "Remove from watchlist";
            break;
        }
        else {
            watchlistButtonText = "Add to watchlist"
        }
    }

    for (let movie2 of currentUser.favouriteMovies) {
        if (movie2 == movie.imdbID) {
            favouritesButtonText = "Remove from favourite movies";
            break;
        }
        else {
            favouritesButtonText = "Add to favourite movies"
        }
    }

    //Gets average movie review
    let sum = 0;
    let count = 0;
    for (rating in movie.Ratings) {

        if (movie.Ratings[rating].Value.includes("%")) {
            sum += parseFloat(movie.Ratings[rating].Value);
            count += 1;
            continue;
        }

        if (movie.Metascore && movie.Metascore != "N/A") {
            sum += parseFloat(movie.Metascore);
            count += 1;
            continue;
            ;
        }

        if (movie.imdbRating && movie.imdbRating != "N/A") {
            sum += parseFloat((movie.imdbRating * 10));
            count += 1;
            continue;
        }
    }
    let average = Math.round(sum / count);
    movie.Director = parseString(movie.Director);
    movie.Genre = parseString(movie.Genre);
    movie.Actors = parseString(movie.Actors);
    movie.Writer = parseString(movie.Writer);



    res.render('movie.ejs', { editLink: editLink, contributor: contributor, favouritesButtonText: favouritesButtonText, watchlistButtonText: watchlistButtonText, movie: movie, average: average, searchTermLink: "/private/find?searchTerm=", typeLink: "&type=" },);
})


app.get('/movie/:movieID/reviews', (req, res) => {
    let movieID = req.params.movieID;
    let movie;
    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
            break;
        }
    }
    for (let movie of movieDataJSON) {
        if (movie.Reviews == undefined) {
            movie.Reviews = [];
        }
    }
    const movieDataStringify = JSON.stringify(movieDataJSON);
    fs.writeFileSync(path.join(__dirname, '..', 'movie-data.json'), movieDataStringify);
    res.render('reviews.ejs', { movie: movie.Reviews, movieID: movieID });
})

app.post('/movie/:movieID/reviews', (req, res) => {

    for (let movie of movieDataJSON) {
        //so first, find the movie. once found, directly edit it and then save it
        if (req.body[0].movie == movie.imdbID) {
            movie.Reviews.push(req.body[0]);
            break;
        }
    }
    const stringifyMovieData = JSON.stringify(movieDataJSON);
    fs.writeFileSync('movie-data.json', stringifyMovieData);
})


app.get('/movie/:movieID/edit', (req, res) => {
    let movieID = req.params.movieID;
    let movie;
    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
            break;
        }
    }
    res.render('edit.ejs', { movie: movie });

})

app.post('/movie/edit', async (req, res) => {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));
    let peopleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'people.json')))
    let count = 0;
    console.log(req.body.imdbID);
    for (let movie of movieData) {
        if (req.body.imdbID == movie.imdbID) {
            count++;
            break;
        }
    }

    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == req.body.imdbID) {
            movieData[i] = req.body;
            //console.log(movieData[i]);
            break;
        }
    }
    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == req.body.imdbID) {
            //console.log(movieData[i]);
            break;
        }
    }

    console.log(path);
    const stringifyMovieData = JSON.stringify(movieData);
    fs.writeFileSync('movie-data.json', stringifyMovieData);
    res.redirect('/private/home');
    console.log("Successfully edited a movie to the database!");

})
module.exports = app