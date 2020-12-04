const fs = require('fs');
const path = require('path');

function publicSearch(searchTerm, type) {
    let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie-data.json')));
    let personData = JSON.parse(fs.readFileSync(path.join(__dirname, 'people.json')));
    let filteredList = [];
    for (let movie of movieData) {
        //Search movie title
        if (movie.Title.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("movie"))) {
            }
            filteredList.push({
                title: movie.Title,
                imdbID: movie.imdbID,
                type: "movie"
            });
        }
        //Search movie genre
        else if (movie.Genre.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("genre")))
                filteredList.push({
                    title: movie.Title,
                    imdbID: movie.imdbID,
                    type: "genre"
                });
        }
        //Search year
        else if (movie.Year.toLowerCase().includes(searchTerm)) {
            if ((!type) || (type.includes("all")) || (type.includes("year")))
                filteredList.push({
                    title: movie.Title,
                    imdbID: movie.imdbID,
                    type: "year"
                });
        }
        //Search minrating
        else if (searchTerm == "minrating") {
            console.log("whyisntthisworking");
            let sum = 0;
            let count = 0;
            for (rating in movie.Ratings) {
                if (movie.Ratings[rating].Value.includes("%")) {
                    sum += parseFloat(movie.Ratings[rating].Value);
                    count += 1;
                    continue;
                }

                if (movie.Metascore && movie.Metascore != "N/A") {
                    sum += parseFloat(movie.Metascore);
                    count += 1;
                    continue;
                    ;
                }

                if (movie.imdbRating && movie.imdbRating != "N/A") {
                    sum += parseFloat((movie.imdbRating * 10));
                    count += 1;
                    continue;
                }
            }
            let average = Math.round(sum / count);
            if (average > type) {
                filteredList.push({
                    title: movie.Title,
                    imdbID: movie.imdbID,
                    type: "minrating"
                });
            }
        }
    }
    return (filteredList);
}

module.exports = publicSearch