const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  Genres = Models.Genre,
  bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mavelMediaDB', { useNewURLParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ Extended: true}));
app.use(morgan('common'));


//Return a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Marvel Media!');
});

//Returning the top movies
app.get('/movies/featured', (req, res) => {
  Movies.find({ Featured: req.params.Featured.true})
  .then((featured) => {
    res.json(featured);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
})

//Return a list of all movies
app.get('/movies', (req, res) => {
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
app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.title === req.params.title;
  }));
});

//Add a movie
app.post('/movies/', (req, res) => {
  let newMovie= req.body;
  if (!newMovie.title){
    const message= 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id=uuid.v4();
    topMovies.push(newMovie);
  }
});

//Get data about a genre by name/title
app.get("/movies/genres/:genre", (req,res) => {
  Genres.findOne({ Name: req.params.Name})
  .then((genre) => {
    res.json(genre);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
});

//Get data about a director
app.get("/movies/directors/:Name" , (req,res) => {
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
app.post("/users", (req, res) => {
  //Checks if the username already exists
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
app.get('/users', (req, res) => {
  Users.find()
  .then ((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + error);
  });
});

// Get user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username})
  .then((user) => {
    res.json(user);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + error);
  });
});
​
//Allow user to update their information
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
  {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }
  },
  { new: true }, //makes sure the document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});
​
//Allow user to add a movie to their list
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate ({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID}
  },
  { new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
​
//Alow user to remove a movie from their list
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate ({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID}
  },
  { new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
​
//Allow user to deregister
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {//checks to make sure user exists
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200). send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
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
