
const express = require('express');
const app = express();

app.get('/home', (req, res) => {
    //console.log(req.session);
    res.render('./home.ejs', { name: req.session.user.name})
  })

module.exports = app;