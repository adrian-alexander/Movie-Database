const port = 3001;
const express = require('express');
const bodyParser = require('body-parser');

const SearchRoute = require('./routes/search');
const MovieList = require('./routes/movielist');
const Movies = require('./routes/movies');
const Person = require('./routes/person');
const Home = require('./routes/home');
const MyAccount = require('./routes/myaccount');
const LoginRegister = require('./routes/login-register');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(SearchRoute);
app.use(MovieList);
app.use(Movies);
app.use(Person);
app.use(Home);
app.use(MyAccount);
app.use(LoginRegister);

app.listen(port, () => console.log('Server is up'));
//hello