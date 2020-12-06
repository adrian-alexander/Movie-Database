const search = require('../important/search');
const express = require('express');
const app = express();

app.get('/find', (req, res) => {
    res.render('search.ejs');
})
app.get('/search', (req, res) => {
    let searchTerm = req.query.searchTerm.toLowerCase();
    let type = req.query.type.toLowerCase().split(", ");
    res.json(search(searchTerm, type));
})

module.exports = app