const express = require('express');
const app = express();

app.get('/myaccount', (req, res) => {
    res.render('myaccount.ejs', {user: req.session.user});
})

module.exports = app