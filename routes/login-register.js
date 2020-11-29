const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash')
const methodOverride = require('method-override');
const fs = require('fs');
const data = fs.readFileSync('users.json');
const userFile = JSON.parse(data);

const initializePassport = require('../passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = userFile;
console.log(users);

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: "f97gbydf78ybrs78bgsr87yhrbesdhb98drs",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('home.ejs', { username: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('./login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('./register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        watchlist: [],
        favouriteMovie: '',
        userType: 'normal',
        following: [],
        followers: [] 
      })
      const stringifyUsers = JSON.stringify(users);
      fs.writeFile('users.json', stringifyUsers, finished);
      function finished(err) {
        console.log("Successfully copied user to file.");
      }
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })

  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  module.exports = app;