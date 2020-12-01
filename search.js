//GOOD DEC 1 4:40PM

const movieData = require('./movie-data.json');

function search(searchTerm, type) {
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
    }
    return (filteredList);
}

module.exports = search