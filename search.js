const fs = require('fs');
const path = require('path');

function search(searchTerm, type) {
    searchTerm = searchTerm.toLowerCase();
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

module.exports = search