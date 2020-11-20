const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Auth = require('./routes/auth');
const SearchRoute = require('./routes/search');
const MovieList = require('./routes/movielist');
const Movies = require('./routes/movies');
const Person = require('./routes/person');
const Home = require('./routes/home');
const MyAccount = require('./routes/myaccount');

const app = express();

//Connect to db
mongoose.connect('mongodb://admin:admin@localhost:27017/normal_users', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
})

db.once('open', () => {
    console.log('Database conection established!');
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(SearchRoute);
app.use(MovieList);
app.use(Movies);
app.use(Person);
app.use(Home);
app.use(MyAccount);
app.use(Auth);

app.listen(port, () => console.log('Server is up'));
