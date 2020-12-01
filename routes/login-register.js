//DONE DEC 1 4:40PM

const express = require('express');
const app = express();
const fs = require('fs');
const data = fs.readFileSync('users.json');
const userFile = JSON.parse(data);

const users = userFile;

app.use(express.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
  res.render('./login.ejs');
})

//DONT DELETE
app.post('/login', async (req, res) => {
  try {
    for (let i = 0; i < users.length; i++) {
      if (req.body.email === users[i].email && req.body.password === users[i].password) {
        req.session.loggedIn = true;
        req.session.user = users[i];
        res.redirect('/private/home');
        return;
      }
    }
  }
  catch (err) {
    res.status(401);
    res.redirect('/login');
  }
})

app.get('/register', (req, res) => {
  res.render('./register.ejs')
})

app.post('/register', async (req, res) => {
  let count = 0;
  for (let i = 0; i < users.length; i++) {
    if (req.body.email == users[i].email) {
      count++;
    }
  }
  if (count == 0) {
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      watchlist: [],
      favouriteMovies: [],
      userType: 'normal',
      usersFollowing: [],
      peopleFollowing: []
    })
    const stringifyUsers = JSON.stringify(users);
    fs.writeFile('users.json', stringifyUsers, finished);
    function finished(err) {
      console.log("Successfully copied user to file.");
    }
    res.redirect('/login')
  }
  else {
    res.redirect('/register');
    return;
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
})

module.exports = app;