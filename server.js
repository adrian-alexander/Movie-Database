const movieData = require('./movie-data.json');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ejs = require('ejs');
const { send } = require('process');
const bodyParser = require('body-parser');

//app.get = listen for get requests
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('')

function search(searchTerm, type) {
    let filteredList = [];
    for (let movie of movieData) {
        //Search movie title
        if (movie.Title.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("movie")))
                filteredList.push({ information: movie.Title, url: "/movie/" + movie.imdbID, type: "movie" });
        }
        //Search movie genre
        else if (movie.Genre.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("genre")))
                filteredList.push({ information: movie.Title, url: "/movie/" + movie.imdbID, type: "genre" });
        }
        //Search director
        else if (movie.Director.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("director")))
                filteredList.push({ information: movie.Title, url: "/movie/" + movie.imdbID, type: "director" });
        }
        //Search writer
        else if (movie.Writer.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("writer")))
                filteredList.push({ information: movie.Title, url: "/movie/" + movie.imdbID, type: "writer" });
        }
        //Search actors
        else if (movie.Actors.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("actors")))
                filteredList.push({ information: movie.Title, url: "/movie/" + movie.imdbID, type: "actors" });
        }
    }
    return (filteredList);
}

app.get('/search', (req, res) => {
    let searchTerm = req.query.searchTerm.toLowerCase();
    let type = req.query.type.toLowerCase().split(", ");
    res.json(search(searchTerm, type));
})


//GET /movies/:movieID
app.get('/movies/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == movieID) {
            movie = Object.assign({}, movieData[i]);
            break;
        }
    }
    res.json(movie);

})

app.get('/movielist', (req, res) => {
    let pageNumber = Number(req.query.pageNumber);
    if ((pageNumber == undefined) || isNaN(pageNumber)) {
        pageNumber = 0;
    }
    let pageLength = req.query.pageLength;
    if (pageLength == undefined) {
        pageLength = 20;
    }
    let totalPages = Math.ceil(movieData.length / pageLength);
    let startIndex = pageNumber * pageLength;
    let endIndex = startIndex + (pageLength - 1);
    let movieList = [];
    let movieRow = [];
    let count = 0;
    for (let i = startIndex; i <= Math.min(endIndex, movieData.length - 1); i++) {
        if (count <= 4) {
            movieRow.push(movieData[i]);
            count++;
        }
        if (count == 4) {
            count = 0;
            movieList.push(movieRow);
            movieRow = [];
        }
    }
    if (movieRow.length != 0) {
        movieList.push(movieRow);
    }
    res.render('movielist.ejs', { movies: movieList, pageNumber: pageNumber, pageLength: pageLength, totalPages: totalPages });
})


app.post('/movies', (req, res) => {
    console.log(req.body);
    let template = [
        'Title', 'Year',
        'Released', 'Runtime', 'Genre',
        'Director', 'Writer', 'Actors',
        'Plot', 'Language', 'Country',
        'Poster',
        'imdbID', 'Type',
        'BoxOffice', 'Production',
        'Response'
    ]

    for (let key of template) {
        if (!req.body[key]) {
            res.status(400);
            res.send("Bad Request");
            return;
        }
    }
    movieData.push(req.body);
    res.status(200);
    res.send("OK");
})

function parseString(str) {
    //Regex explanation: ^ = start of line, (.*?) = all text after the start of the line, 
    //\s? = optional space, \(.*\) = matching any text surrounded by brackets, ? = that whole bit is optional, $ = go to the end of the line
    let splitComma = str.split(", ");
    let noBrackets = [];
    for (let element of splitComma) {
        noBrackets.push(element.match(/^(.*?)(\s?\(.*\))?$/)[1]);
    }
    return noBrackets;
}
//go into movielist, find the movie we wanna show and then save that all the data for the movie
app.get('/movie/:movieID', (req, res) => {
    let movieID = req.params.movieID;
    let movie = {};
    for (let i = 0; i < movieData.length; i++) {
        if (movieData[i].imdbID == movieID) {
            movie = Object.assign({}, movieData[i]);
            break;
        }
    }

    //Gets average movie review
    let sum = 0;
    let count = 0;
    for (rating in movie.Ratings) {
        //if it's a percentage
        if (movie.Ratings[rating].Value.includes("%")) {
            sum += parseFloat(movie.Ratings[rating].Value);
            count += 1;
            continue;
        }

        //if it's /10
        if (movie.Ratings[rating].Value.includes("/10")) {
            sum += eval(movie.Ratings[rating].Value) * 100;
            count += 1;
            continue;
        }

        //if it's /100
        if (movie.Ratings[rating].Value.includes("/100")) {
            sum += eval(movie.Ratings[rating].Value) * 100;
            count += 1;
            continue;
        }
        sum += eval(movie.Ratings[rating].Value);
        count += 1;
    }
    let average = Math.round(sum / count);
    movie.Director = parseString(movie.Director);
    movie.Genre = parseString(movie.Genre);
    movie.Actors = parseString(movie.Actors);
    movie.Writer = parseString(movie.Writer);



    res.render('movie.ejs', { movie: movie, average: average, searchTermLink: "/search.html?searchTerm=", typeLink: "&type=" },);
})

app.get('/person/:personName', (req, res) => {
    let personName = req.params.personName.toLowerCase();
    let listOfMovies = search(personName, ['actors', 'writer', 'director']);

    res.render('person.ejs', { movies: listOfMovies, personName: personName });
})

app.get('/home', (req, res) => {
    res.render('home.ejs');
})

app.get('/myaccount', (req, res) => {
    res.render('myaccount.ejs');
})

app.get('/user/username', (req, res) => {
    let username = req.params.username;
    res.render('user.ejs');
})

app.get('/user/')

app.listen(port, () => console.log('Server is up'));
