const express = require('express');
const app = express();
const schema = require('../schema');

app.use(express.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
  res.render('./login.ejs');
})

//DONT DELETE
app.post('/login', async (req, res) => {
  let found = await schema.userModel.findOne({
    email: req.body.email,
    password: req.body.password
  })
  console.log(found);
  if (found != null) {
    req.session.loggedIn = true;
    req.session.user = found;
    res.redirect('/private/home');
    return;
  }
  else {
    res.status(401);
    res.redirect('/login');
  }
})

app.get('/register', (req, res) => {
  res.render('./register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    let user = new schema.userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    await user.save();
    res.redirect('/login')
  } catch(e) {
    console.log(e)
    res.redirect('/register')
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
})

module.exports = app;