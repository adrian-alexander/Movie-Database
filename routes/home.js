const express = require('express');
const app = express();

app.get('/home', (req, res) => {
    res.render('home.ejs', {user: req.session.user});
})

module.exports = app