const express = require("express"),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies =[
  {
    id: '1',
    title: 'Iron Man',
    year: '2008'
  },
  {
    id: '2',
    title: 'Iron Man 2',
    year: '2010'
  },
  {
    id: '3',
    title:'Thor',
    year: '2011'
  },
  {
    id: '4',
    title: 'Captain America: The First Avenger',
    year: '2011'
  },
  {
    id: '5',
    title: 'The Incredibel Hulk',
    year: '2008'
  },
  {
    id: '6',
    title: 'The Avengers',
    year: '2012'
  },
  {
    id: '7',
    title: 'Iron Man 3',
    year: '2013'
  },
  {
    id: '8',
    title: 'Thor: The Dark World',
    year: '2013'
  },
  {
    id: '9',
    title: 'Captain America: The Winter Soldier',
    year: '2014'
  },
  {
    id: '10',
    title: 'Guardians of the Galaxy',
    year: '2014'
  },
  {
    id: '11',
    title: 'Avengers: Age of Ultron',
    year: '2015'
  },
  {
    id: '12',
    title: 'Ant-Man',
    year: '2015'
  },
  {
    id: '13',
    title: 'Captain America: Civil War',
    year: '2016'
  },
  {
    id: '14',
    title: 'Doctor Strange',
    year: '2016'
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

//Remove a movie by ID
app.delete('/movies/:ID', (req, res) => {
  let movie= topMovies.find((movie) => {
    return movie.id === req.params.id;
  })
  if (movie) {
    topMovies =topMovies.filter((obj) => {
      return obj.id !== req.params.id});
      res.status(201).send('Movie with the ID ' + req.params.id + ' was deleted.');
  } else {
    res.status(404).send('Movie with the ID ' + req.params.id + ' was not found.')
  }
});

//Update the year of a movie by title
app.put('/movies/:title/:year', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.title = req.params.title;
  });
  if (movie) {
    movie.year = parseInt(req.params.year);
    res.status(201).send('Movie ${req.params.title} was assigned the year of ${req.params.year}.');
  } else {
    res.status(404).send('Movie with the title '  + req.params.title + ' was not found.');
  };
});

app.use(express.static('public'));


//error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working.');
});

//listen
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
