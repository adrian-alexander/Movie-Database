//GOOD DEC 1 4:40PM

const fs = require('fs');
const path = require('path');

function search(searchTerm, type) {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie-data.json')));
    let personData = JSON.parse(fs.readFileSync(path.join(__dirname, 'people.json')));
    let filteredList = [];
    for (let movie of movieData) {
        //Search movie title
        if (movie.Title.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("movie")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "movie" });
        }
        //Search movie genre
        else if (movie.Genre.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("genre")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "genre" });
        }
        //Search director
        else if (movie.Director.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("director")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "director" });
        }
        //Search writer
        else if (movie.Writer.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("writer")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "writer" });
        }
        //Search actors
        else if (movie.Actors.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("actors")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "actors" });
        }
        //Search year
        else if (movie.Year.includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("year")))
                filteredList.push({ information: movie.Title, url: "/private/movie/" + movie.imdbID, type: "year" });
        }
    }
    return (filteredList);
}

module.exports = search