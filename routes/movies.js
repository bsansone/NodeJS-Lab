var express = require('express');
var router = express.Router();
var _ = require('underscore');

var movies = [
  {
    id: 1,
    title: 'Monty Python and the Holy Grail',
    genre: 'Comedy',
    year: '1975',
    rating: '8.3'

  },
  {
    id: 2,
    title: 'Inception',
    genre: 'Thriller',
    year: '2010',
    rating: '8.8'
  },
  {
    id: 3,
    title: 'WALL-E',
    genre: 'Animation',
    year: '2008',
    rating: '8.4'
  },
  {
    id: 4,
    title: 'Fight Club',
    genre: 'Drama',
    year: '1999',
    rating: '8.9'
  }
];

function lookupMovie(movie_id) {
  return _.find(movies, function(c) {
    return c.id == parseInt(movie_id);
  });
}

function findMaxId() {
  return _.max(movies, function(movie) {
    return movie.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {movies: movies});
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_movie_id = (findMaxId()).id + 1;
	var new_movie = {
		id: new_movie_id,
		title: req.body.title,
		genre: req.body.genre,
		year: req.body.year,
		rating: req.body.rating
	};
	movies.push(new_movie);

	//res.send("New movie created with id: " + new_movie.id);
	res.redirect('/movies/');
});

router.get('/add', function(req, res, next) {
	res.render('add', {movie:{}});
});

router.route('/:movie_id')
	.all(function(req, res, next){
		movie_id = req.params.movie_id;
		movie = lookupMovie(movie_id);
		next();
	})
	.get(function(req,res,next){
		res.render('details', {movie: movie});
	})
	.post(function(req,res,next){
		res.send('Post for movie ' + movie_id);
	})
	.put(function(req,res,next){
		res.send('Put for movie ' + movie_id);
	})
	.delete(function(req,res,next){
		res.send('Delete for movie ' + movie_id);
	});

module.exports = router;