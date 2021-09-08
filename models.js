const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');

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
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword =(password) => {
  return bcrypt.hashSync(password,10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

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
