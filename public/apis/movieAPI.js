const express = require('express');
const app = express();
const publicSearch = require('../../important/publicSearch');
const fs = require('fs');
const path = require('path');
let movieDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../../important', 'movie-data.json')));

app.get('/api/movies', (req, res) => {
    let searchTerm = req.query.searchTerm.toLowerCase();
    let type = req.query.type.toLowerCase().split(", ");
    res.json(publicSearch(searchTerm, type));
})

app.get('/api/movies/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    for (let i = 0; i < movieDataJSON.length; i++) {
        if (movieDataJSON[i].imdbID == movieID) {
            movie = Object.assign({}, movieDataJSON[i]);
        }
    }
    res.json(movie);
})

app.post('/api/movies', (req, res) => {
    let template = [
        'Title', 
        'Year',
        'Runtime', 
        'Genre',
        'Director', 
        'Writer', 
        'Actors',
        'Plot', 
        'Poster',
        'imdbID', 
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
    fs.writeFileSync(path.join(__dirname, '../../important', 'movie-data.json'), movieDataStringify);
    res.status(200);
    res.send("OK");
})

module.exports = app;