const fs = require('fs');
const path = require('path');
const search = require('./search')
const os = require('os')


let movieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movie-data.json')));
let personData = new Map();
let array = ["Director", "Actors", "Writer"];

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

function addPerson() {
    let id = 0;
    //Adds the people to the array
    for (let movie of movieData) {
        for (let field of array) {
            for (let person of parseString(movie[field])) {
                if (!personData.has(person)) {
                    personData.set(person, { name: person, movies: [], personID: id })
                    id++
                }
                personData.get(person).movies.push({
                    information: movie.Title,
                    url: "/private/movie/" + movie.imdbID,
                    type: field.toLowerCase()
                });
            }
        }
    }
    let personArray = []
    for (let person of personData.values()) {
        personArray.push(person)
    }
    fs.writeFileSync('people.json', JSON.stringify(personArray));
}

module.exports = addPerson;