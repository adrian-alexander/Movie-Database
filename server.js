const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
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

const SearchRoute = require('./routes/search');
const MovieList = require('./routes/movielist');
const Movies = require('./routes/movies');
const Person = require('./routes/person');
const Home = require('./routes/home');
const MyAccount = require('./routes/myaccount');
const LoginRegister = require('./routes/login-register');
const User = require('./routes/user');

const movieAPI = require('./public/apis/movieAPI');
const peopleAPI = require('./public/apis/peopleAPI');
const usersAPI = require('./public/apis/usersAPI');

appAuth.use(SearchRoute);
appAuth.use(MovieList);
appAuth.use(Movies);
appAuth.use(Person);
appAuth.use(MyAccount);
appAuth.use(Home);
appAuth.use(User);

app.use(LoginRegister);
app.use(movieAPI);
app.use(peopleAPI);
app.use(usersAPI);

app.listen(port, () => console.log('Server is up @ http://localhost:3000'));