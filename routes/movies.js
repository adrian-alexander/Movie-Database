const movieData = require('../movie-data.json');
const search = require('../search')
const express = require('express');
const app = express();

//GET /movies/:movieID
app.get('/movies/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == movieID) {
            movie = Object.assign({}, movieData[i]);
            break;
        }
    }
    res.json(movie);
})


app.post('/movies', (req, res) => {
    console.log(req.body);
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
    movieData.push(req.body);
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
    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == movieID) {
            movie = Object.assign({}, movieData[i]);
            break;
        }
    }

    //Gets average movie review
    let sum = 0;
    let count = 0;
    for (rating in movie.Ratings) {
        //if it's a percentage
        if (movie.Ratings[rating].Value.includes("%")) {
            sum += parseFloat(movie.Ratings[rating].Value);
            count += 1;
            continue;
        }

        //if it's /10
        if (movie.Ratings[rating].Value.includes("/10")) {
            sum += eval(movie.Ratings[rating].Value) * 100;
            count += 1;
            continue;
        }

        //if it's /100
        if (movie.Ratings[rating].Value.includes("/100")) {
            sum += eval(movie.Ratings[rating].Value) * 100;
            count += 1;
            continue;
        }
        sum += eval(movie.Ratings[rating].Value);
        count += 1;
    }
    let average = Math.round(sum / count);
    movie.Director = parseString(movie.Director);
    movie.Genre = parseString(movie.Genre);
    movie.Actors = parseString(movie.Actors);
    movie.Writer = parseString(movie.Writer);



    res.render('movie.ejs', { movie: movie, average: average, searchTermLink: "/search.html?searchTerm=", typeLink: "&type=" },);
})

module.exports = app