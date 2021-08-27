const express = require("express"),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies =[
  {
    title: 'Iron Man',
    year: '2008',
    genre: 'Action',
    director: 'Jon Favreau',
    description:'adding later'
  },
  {
    title: 'Iron Man 2',
    year: '2010',
    genre: 'Action',
    director: 'Jon Favreau',
    description:'adding later'
  },
  {
    title:'Thor',
    year: '2011',
    genre: 'Action',
    director: 'Kenneth Branagh',
    description:'adding later'
  },
  {
    title: 'Captain America: The First Avenger',
    year: '2011',
    genre: 'Action',
    director: 'Joe Johnston',
    description:'adding later'
  },
  {
    title: 'The Incredibel Hulk',
    year: '2008',
    genre: 'Action',
    director: 'Lewis Laterrier',
    description:'adding later'
  },
  {
    title: 'The Avengers',
    year: '2012',
    genre: 'Action',
    director: 'Joss Whedon',
    description:'adding later'
  },
  {
    title: 'Iron Man 3',
    year: '2013',
    genre: 'Action',
    director: 'Shane Black',
    description:'adding later'
  },
  {
    title: 'Thor: The Dark World',
    year: '2013',
    genre: 'Action',
    director: 'Alan Taylor',
    description:'adding later'
  },
  {
    title: 'Captain America: The Winter Soldier',
    year: '2014',
    genre: 'Action',
    director: 'Joe Russo & Anthony Russo',
    description:'adding later'
  },
  {
    title: 'Guardians of the Galaxy',
    year: '2014',
    genre: 'Action',
    director: 'James Gunn',
    description:'adding later'
  },
  {
    title: 'Avengers: Age of Ultron',
    year: '2015',
    genre: 'Action',
    director: 'Joss Whedon',
    description:'adding later'
  },
  {
    title: 'Ant-Man',
    year: '2015',
    genre: 'Action',
    director: 'Peyton Reed',
    description:'adding later'
  },
  {
    title: 'Captain America: Civil War',
    year: '2016',
    genre: 'Action',
    director: 'Joe Russo & Anthony Russo',
    description:'adding later'
  },
  {
    title: 'Doctor Strange',
    year: '2016',
    genre: 'Action',
    director: 'Scott Derrickson',
    description:'adding later'
  }
]


//Returning a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Marvel Media!');
});

//Returning the top movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
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
  res.send("Successful GET request returning a description of the genre.");
});

//Get data about a director
app.get("/movies/directors/:director" , (req,res) => {
  res.send("Successful GET request returning a description of the director.")
});

//Allow new user to register
app.post("/users", (req, res) => {
  res.send("Registration was successful!");
});
​
//Allow user to update their information
app.put("/users/:username", (req, res) => {
  res.send("Your profile was successfully updated.");
});
​
//Allow user to add a movie to their list
app.post("/users/:username/favorites", (req, res) => {
  res.send(req.params.title + " was added to favorites.");
});
​
//Alow user to remove a movie from their list
app.delete("/users/:username/favorites/:title", (req, res) => {
  res.send(req.params.title + " was removed from favorites.");
});
​
//Allow user to deregister
app.delete("/users/:username", (req, res) => {
  res.send("Your account has been successfully removed");
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
