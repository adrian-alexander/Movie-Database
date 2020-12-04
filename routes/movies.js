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
    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
            break;
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



    res.render('movie.ejs', { movie: movie, average: average, searchTermLink: "/private/find?searchTerm=", typeLink: "&type=" },);
})

module.exports = app