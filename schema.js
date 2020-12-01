const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    favouriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
    watchList: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
    usersFollowing: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], //Not sure if this actually works
    recommendedMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
    peopleFollowing: []
  });

let userModel = mongoose.model('User', userSchema);

let peopleSchema = mongoose.Schema({
  Name: String
})

let movieSchema = mongoose.Schema({
  Title: String,
        Year: Number,
        "Rated": String,
        
        
        "Genre": [String],
        "Director": String,
        "Writer": [String],
        "Plot": String,
        "Poster": String,
        "Ratings": [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rating"
        }],
        "Metascore": Number,
        "imdbRating": Number,
    }
);

let ratingsSchema = mongoose.Schema({
  "Source": String,
  "Value": String
})

let ratingsModel = mongoose.model('Rating', ratingsSchema);

let movieModel = mongoose.model('Movie', movieSchema);

module.exports = {userModel: userModel, ratingsModel: ratingsModel, movieModel: movieModel};