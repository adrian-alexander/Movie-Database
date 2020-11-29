const search = require('../search')
const express = require('express');
const app = express();

app.get('/search', (req, res) => {
    let searchTerm = req.query.searchTerm.toLowerCase();
    let type = req.query.type.toLowerCase().split(", ");
    res.json(search(searchTerm, type));
})

module.exports = app