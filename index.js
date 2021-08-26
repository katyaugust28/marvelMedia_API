const express = require("express"),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies =[
  {
    title: 'Iron Man',
    year: '2008'
  },
  {
    title: 'Iron Man 2',
    year: '2010'
  },
  {
    title:'Thor',
    year: '2011'
  },
  {
    title: 'Captain America: The First Avenger',
    year: '2011'
  },
  {
    title: 'The Incredibel Hulk',
    year: '2008'
  },
  {
    title: 'The Avengers',
    year: '2012'
  },
  {
    title: 'Iron Man 3',
    year: '2013'
  },
  {
    title: 'Thor: The Dark World',
    year: '2013'
  },
  {
    title: 'Captain America: The Winter Soldier',
    year: '2014'
  },
  {
    title: 'Guardians of the Galaxy',
    year: '2014'
  },
  {
    title: 'Avengers: Age of Ultron',
    year: '2015'
  },
  {
    title: 'Ant-Man',
    year: '2015'
  },
  {
    title: 'Captain America: Civil War',
    year: '2016'
  },
  {
    title: 'Doctor Strange',
    year: '2016'
  }
]

//Returning the top movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//Returning a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my Marvel Media!');
});

//Get data about a single movie
app.get('/movies/[title]', (req, res) => {
  res.send('Successful GET request returning data on a single movie');
});

//Add a movie
app.post('/movies/', (req, res) => {
  res.send('Successful POST request adding a new movie to the collection');
});

//Remove a movie by ID
app.delete('/movies/[ID]', (req, res) => {
  res.send('Successful DELETE request removing a movie by using its ID');
});

//Update the year of a movie by Title
app.put('/movies/[title]/[year]', (req, res) => {
  res.send('Successful PUT request updating the year of a certain movie');
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
