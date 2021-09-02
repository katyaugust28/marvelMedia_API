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

let topMovies =[
  {
    title: 'Iron Man',
    year: '2008',
    genre: 'Action',
    director: 'Jon Favreau',
    description:'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.'
  },
  {
    title: 'Iron Man 2',
    year: '2010',
    genre: 'Action',
    director: 'Jon Favreau',
    description:'With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father\'s legacy.'
  },
  {
    title:'Thor',
    year: '2011',
    genre: 'Action',
    director: 'Kenneth Branagh',
    description:'The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.'
  },
  {
    title: 'Captain America: The First Avenger',
    year: '2011',
    genre: 'Action',
    director: 'Joe Johnston',
    description:'Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a "Super-Soldier serum". But being Captain America comes at a price as he attempts to take down a war monger and a terrorist organization.'
  },
  {
    title: 'The Incredible Hulk',
    year: '2008',
    genre: 'Action',
    director: 'Lewis Laterrier',
    description:'Bruce Banner, a scientist on the run from the U.S. Government, must find a cure for the monster he turns into whenever he loses his temper.'
  },
  {
    title: 'The Avengers',
    year: '2012',
    genre: 'Action',
    director: 'Joss Whedon',
    description:'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.'
  },
  {
    title: 'Iron Man 3',
    year: '2013',
    genre: 'Action',
    director: 'Shane Black',
    description:'When Tony Stark\'s world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.'
  },
  {
    title: 'Thor: The Dark World',
    year: '2013',
    genre: 'Action',
    director: 'Alan Taylor',
    description:'When the Dark Elves attempt to plunge the universe into darkness, Thor must embark on a perilous and personal journey that will reunite him with doctor Jane Foster.'
  },
  {
    title: 'Captain America: The Winter Soldier',
    year: '2014',
    genre: 'Action',
    director: 'Joe Russo & Anthony Russo',
    description:'As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat from history: an assassin known as the Winter Soldier.'
  },
  {
    title: 'Guardians of the Galaxy',
    year: '2014',
    genre: 'Action',
    director: 'James Gunn',
    description:'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.'
  },
  {
    title: 'Avengers: Age of Ultron',
    year: '2015',
    genre: 'Action',
    director: 'Joss Whedon',
    description:'When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it\'s up to Earth\'s mightiest heroes to stop the villainous Ultron from enacting his terrible plan.'
  },
  {
    title: 'Ant-Man',
    year: '2015',
    genre: 'Action',
    director: 'Peyton Reed',
    description:'Armed with a super-suit with the astonishing ability to shrink in scale but increase in strength, cat burglar Scott Lang must embrace his inner hero and help his mentor, Dr. Hank Pym, pull off a plan that will save the world.'
  },
  {
    title: 'Captain America: Civil War',
    year: '2016',
    genre: 'Action',
    director: 'Joe Russo & Anthony Russo',
    description:'Political involvement in the Avengers\' affairs causes a rift between Captain America and Iron Man.'
  },
  {
    title: 'Doctor Strange',
    year: '2016',
    genre: 'Action',
    director: 'Scott Derrickson',
    description:'While on a journey of physical and spiritual healing, a brilliant neurosurgeon is drawn into the world of the mystic arts.'
  }
]


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

//Update the year of a movie by title
app.put('/movies/:title/:year', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.title = req.params.title;
  });
  if (movie) {
    movie.year = parseInt(req.params.year);
    res.status(201).send('Movie with the title '  + req.params.title + ' was assigned the year ' + req.params.year);
  } else {
    res.status(404).send('Movie with the title '  + req.params.title + ' was not found.');
  };
});

app.use(express.static('public'));

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
app.get("/movies/directors/:director" , (req,res) => {
  Movies.findOne({ Director: req.params.Director.Name})
  .then((director) => {
    res.json(director);
  })
  .catch(() => {
    console.error(err);
    res.status(500).send('Error: ' + error);
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
