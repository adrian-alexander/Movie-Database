const express = require('express');
const app = express();

app.get('/myaccount', (req, res) => {
    let buttonText = "";
    if (req.session.user.userType == "normal") {
        buttonText = "Click here to change account type to Contributor";
    }
    else {
        buttonText = "Click here to change account type to Normal";
    }
    res.render('myaccount.ejs', {user: req.session.user, buttonText: buttonText});
})

module.exports = app