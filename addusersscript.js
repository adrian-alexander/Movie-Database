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
fs.writeFileSync('people.json', JSON.stringify(newArray));
console.log(personData);