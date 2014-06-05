var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Models
var Beer = require('./models/beer');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

var app = express();
var port = process.env.PORT || 3000;

// Create router
var router = express.Router();

app.use(bodyParser());

// Dummy route
router.get('/', function(req, res, next) {
  res.json({ message: 'You are running dangerously low on beer!' });
});

// Create a new route
var beersRoute = router.route('/beers');

// Create endpoint /api/beers for GET
beersRoute.get(function(req, res, next){
  Beer.find(function(err, beers) {
    if (err) res.send(err);
    if (!beers.length) {
      beers = { message: 'The locker is empty, quick, add some beer!' };
    }
    res.json(beers);
  });
});

// Create endpoint /api/beers for POST
beersRoute.post(function(req, res, next){
  var beer = new Beer();

  // Set properties from POST data
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  // Save the beer and check for errors
  beer.save(function(err) {
    if (err) res.send(err);

    res.json({ message: 'Beer added to the locker!', data: beer });
  });
});

// Create route for single beer
var beerRoute = router.route('/beers/:beer_id');

// Create endpoint /api/beers/:beer_id for GET
beerRoute.get(function(req, res, next){
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err) res.send(err);

    res.json(beer);
  });
});

// PUT
beerRoute.put(function(req, res, next) {
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err) res.send(err);

    beer.quantity = req.body.quantity;

    beer.save(function(err){
      if (err) res.send(err);

      res.json(beer);
    });
  });
});

// DELETE
beerRoute.delete(function(req, res, next) {
  Beer.findByIdAndRemove(req.params.beer_id, function(err) {
    if (err) res.send(err);

    res.json({ message: 'Beer removed from the locker!' });
  });
});

// Register all routes to be prefixed
// with /api
app.use('/api', router);

app.listen(port, function() {
  console.log('Insert beer on port ', port);
});