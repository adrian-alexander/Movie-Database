const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


app.get('/movielist', (req, res) => {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'movie-data.json')));
    let pageNumber = Number(req.query.pageNumber);
    if ((pageNumber == undefined) || isNaN(pageNumber)) {
        pageNumber = 0;
    }
    let pageLength = req.query.pageLength;
    if (pageLength == undefined) {
        pageLength = 20;
    }
    let totalPages = Math.ceil(movieData.length / pageLength);
    let startIndex = pageNumber * pageLength;
    let endIndex = startIndex + (pageLength - 1);
    let movieList = [];
    let movieRow = [];
    let count = 0;
    for (let i = startIndex; i <= Math.min(endIndex, movieData.length - 1); i++) {
        if (count <= 4) {
            movieRow.push(movieData[i]);
            count++;
        }
        if (count == 4) {
            count = 0;
            movieList.push(movieRow);
            movieRow = [];
        }
    }
    if (movieRow.length != 0) {
        movieList.push(movieRow);
    }
    res.render('movielist.ejs', { movies: movieList, pageNumber: pageNumber, pageLength: pageLength, totalPages: totalPages });
})

module.exports = app