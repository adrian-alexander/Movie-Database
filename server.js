//GOOD DEC 1ST 4:40PM

const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');

const SearchRoute = require('./routes/search');
const MovieList = require('./routes/movielist');
const Movies = require('./routes/movies');
const Person = require('./routes/person');
const Home = require('./routes/home');
const MyAccount = require('./routes/myaccount');
const LoginRegister = require('./routes/login-register');

const session = require('express-session');

const app = express();
const appAuth = express();
app.use(session({ secret: "obgokesrngionrhesznoh", resave: false, saveUninitialized: true }));

app.use(bodyParser.json());
app.use('/private', appAuth);
appAuth.use((req, res, next) => {
  if (req.session.loggedIn == true) {
    next();
  }
  else {
    res.redirect('/login');
  }
})

app.use(express.static('public'));
app.set('view engine', 'ejs');

appAuth.use(SearchRoute);
appAuth.use(MovieList);
appAuth.use(Movies);
appAuth.use(Person);
appAuth.use(MyAccount);
app.use(LoginRegister);

appAuth.use(Home);

app.listen(port, () => console.log('Server is up'));