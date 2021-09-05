const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/marvelMediaDB', { useNewURLParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('common'));

let auth = require('./auth')(app); //ensures Express is available in auth.js file
const passport = require('passport');
require('./passport');

//Return a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Marvel Media!');
});

//Returning the top movies
app.get('/movies/featured', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.find({ Featured: true})
  .then((featured) => {
    res.json(featured);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
})

//Return a list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.find()
  .then ((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + error);
  });
});

//Get data about a single movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ Title : req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get data about a genre by name/title
app.get("/movies/genres/:genre", passport.authenticate('jwt', { session: false}), (req,res) => {
  Genres.findOne({ Name: req.body.Name})
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//Get data about a director
app.get("/movies/directors/:Name" , passport.authenticate('jwt', { session: false}), (req,res) => {
  Movies.findOne({ "Director.Name" : req.params.Name})
  .then((movies) => {
    res.json(movies.Director);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Allow new user to register
app.post("/users", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOne({ Username: req.body.Username}).then ((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({ //collect all info from the HTTP request body, use Mongoose to populate a user doc, then add it to the db
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then ((user) => {res.status(201).json(user)})
      .catch((error) => {
        console.error(err);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
});

// Get all users
app.get("/users", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get("/users/:Username", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//update user information
app.put("/users/:Username", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
   {
     Username: req.body.Username,
     Password: req.body.Password,
     Email: req.body.Email,
     Birthday: req.body.Birthday
   }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// add to favorites
app.post("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//delete by movie id
app.delete("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//delete user
app.delete("/users/:Username", passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found.");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  . catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


//error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working.');
});

//listen
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
