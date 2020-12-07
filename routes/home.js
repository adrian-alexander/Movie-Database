const express = require('express');
const app = express();
const movieData = require('../movie-data.json');

app.get('/home', (req, res) => {
    //do recommended movies here
    let genres = [];

    if (req.session.user.favouriteMovies != []) {
        for (let movie of req.session.user.favouriteMovies) {
            for (let movieFromJSON of movieData) {
                if (movie == movieFromJSON.imdbID) {
                    genres.push(movieFromJSON.Genre.split(/\s*,\s*/));
                    break;
                }
            }
        }
    }
    let uniqueGenres = [];
    for (let i of genres) {
        for (let j of i) {
            if (!uniqueGenres.includes(j)) {
                uniqueGenres.push(j);
            }
        }
    }

    let recommendedMovies = [];

    for (let genre of uniqueGenres) {
        let count = 0;
        for (let movie of movieData) {
            if (count <= 5) {
                if (movie.Genre.includes(genre)) {
                    if (!recommendedMovies.includes(movie)) {
                        recommendedMovies.push(movie);
                        count++;
                    }
                }
            }
            else {
                break;
            }
        }
    }

    let recommended3 = [];
    for (let i = 0; i < 3; i++) {
        let num = Math.floor(Math.random() * recommendedMovies.length);
        recommended3[i] = recommendedMovies[num];
        recommendedMovies = recommendedMovies.filter((filter => {return filter !== recommended3[i]}));
    }

    res.render('home.ejs', {user: req.session.user, movies: recommended3});
})

module.exports = app