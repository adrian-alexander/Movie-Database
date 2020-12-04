const fs = require('fs');
const path = require('path');




let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie-data.json')));
let personData = new Set();
let array = ["Directors", "Actors", "Writers"];

function parseString(str) {
    if (str == undefined) {
        return [];
    }
    //Regex explanation: ^ = start of line, (.*?) = all text after the start of the line, 
    //\s? = optional space, \(.*\) = matching any text surrounded by brackets, ? = that whole bit is optional, $ = go to the end of the line
    let splitComma = str.split(", ");
    let noBrackets = [];
    for (let element of splitComma) {
        noBrackets.push(element.match(/^(.*?)(\s?\(.*\))?$/)[1]);
    }
    return noBrackets;
}

//Adds the people to the array
for (let movie of movieData) {
    for (let field of array) {
        for (let person of parseString(movie[field])) {
            personData.add(person);
        }
    }
}
let newArray = [];
let count = 0;
for (let thing of personData) {
    newArray.push({
        name: thing,
        id: count
    });
    count++;
}

//Add the movies they worked on
for (let person of newArray) {
    //console.log(person.name);
    //console.log(search(person.name, ['actors', 'writer', 'director']));
}
let person = 'George Lucas';
//console.log(person);

function search(searchTerm, type) {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie-data.json')));
    let personData = JSON.parse(fs.readFileSync(path.join(__dirname, 'people.json')));
    let filteredList = [];
    for (let movie of movieData) {
        //Search movie title
        if (movie.Title.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("movie")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "movie" });
            continue;
        }
        //Search movie genre
        if (movie.Genre.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("genre")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "genre" });
            continue;
        }
        //Search director
        else if (movie.Director.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("director")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "director" });
            continue;
        }
        //Search writer
        else if (movie.Writer.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("writer")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "writer" });
            continue;
        }
        //Search actors
        else if (movie.Actors.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("actors")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "actors" });
            continue;
        }
        //Search year
        else if (movie.Year.includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("year")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "year" });
            continue;
        }
    }
    return (filteredList);
}








let thing = search(person, ['actors', 'writer', 'director']);

console.log(thing);

fs.writeFileSync('people.json', JSON.stringify(newArray));