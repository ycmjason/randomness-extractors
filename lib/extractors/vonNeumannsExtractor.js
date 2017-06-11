var range = require('lodash.range');
var _chunk = require('lodash.chunk');
var padLeft = require('pad-left-simple');

var errors = require('../errors');
var groupArray = require('../utils/groupArray');

var chunk = (arr, n) => _chunk(arr, n).filter(c => c.length === n);

function vonNeumannsExtractor(sources){
  // pre: 1. sources[0] is array of bits
  if(!Array.isArray(sources[0])) throw errors.InvalidTypeError;
  var chunks = chunk(sources[0], 2);
  var f = (x, y) => x === y? null: x;
  return chunks.map(chunk => f(...chunk)).join('');
}

module.exports = vonNeumannsExtractor;
