var mongoose = require('mongoose');

// Define schema
var BeerSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
});

module.exports = mongoose.model('Beer', BeerSchema);