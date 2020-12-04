const express = require('express');
const app = express();
const publicSearch = require('../../publicSearch');
const fs = require('fs');
const path = require('path');
let peopleDataJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../..', 'people.json')));


app.get('/api/people', (req, res) => {
    if (req.query.name.toLowerCase()) {
        for (searchTerm of peopleDataJSON) {
            if (searchTerm.name.toLowerCase().includes(req.query.name.toLowerCase())) {
                res.send(searchTerm);
                break;
            }
        }
    }
    if (req.query.name == "") {
        res.send(peopleDataJSON);
    }
    else {
        res.send("No people with that name");
        res.status(404);
    }

})

app.get('/api/people/:person', (req, res) => {
    let personID = req.body.personID;
    console.log(personID);
    let person = {};
    for (let i = 0; i < peopleDataJSON.length; i++) {
        if (peopleDataJSON[i].personID == personID) {
            person = Object.assign({}, peopleDataJSON[i]);
        }
    }
    res.json(person);
})

module.exports = app;