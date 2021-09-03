const mongoose = require ('mongoose');

//Defining the movie schema
let movieSchema= mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre'},
  Director: {
      Name: String,
      Bio: String,
      Birthyear: String
  },
  Superheroes: [String],
  ImagePath: String,
  Featured: Boolean
});

//Defining the user schema
let userSchema= mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: String,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//Defining the Genre Schema
let genreSchema= mongoose.Schema({
  Genre: {
    Name: String,
    Description: String
  }
});

//Creating the models
let Movie= mongoose.model('Movie', movieSchema);
let User= mongoose.model('User', userSchema);
let Genre= mongoose.model('Genre', genreSchema);

//Exporting the models
module.exports.Movie= Movie;
module.exports.User= User;
module.exports.Genre= Genre;
