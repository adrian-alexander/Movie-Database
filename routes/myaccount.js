const express = require('express');
const app = express();

const schema = require('../schema');

app.get('/myaccount', async (req, res) => {
    let user = await schema.userModel.findById(req.session.user._id).populate("favouriteMovie");
    res.render('myaccount.ejs', {user: user});
    console.log(user);
})

module.exports = app