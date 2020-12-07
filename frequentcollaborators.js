const { map } = require('async');
const { dir } = require('console');
const movieData = require('./movie-data.json');
let peopleMap = new Map();
let names = new Map();
const fs = require('fs');



// for (let movie of movieData) {
//     peopleMap[names] = movie.actors;
//     console.log(peopleMap[names])   
// }
let directorCount = 1;
let actorCount = 1;
for (let movie of movieData) {
    for (director of movie.Director.split(/\s*,\s*/)) {
        if (names.get(director) == director) {
            names.set(director, directorCount);
            directorCount++;
        }
        else {
            names.set(director, directorCount);
        }
    }
}

//console.log(names);

fs.writeFileSync('egseg.txt', names);