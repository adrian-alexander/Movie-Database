//DONE DEC 1 4:40PM

const express = require('express');
const search = require('../search')
const app = express();

app.get('/person/:personName', (req, res) => {
    let personName = req.params.personName.toLowerCase();
    let listOfMovies = search(personName, ['actors', 'writer', 'director']);

    res.render('person.ejs', { movies: listOfMovies, personName: personName });
})

module.exports = app