var rye = require('rye');
var range = require('lodash.range');

var errors = require('../errors');

var GFInnerProduct = (xs, ys, size) => {
  if(xs.length !== ys.length) throw errors.InvalidInputError;
  var field = new rye.PrimeField(size);
  return range(xs.length)
    .map(i => field.mul(xs[i], ys[i]))
    .reduce((acc, curr) => field.add(curr, acc));
};

function innerProductExtractor(sources){
  // ref: Generating Quasi-Random Sequences from Two Communicating Slightly-random Sources. -- Umesh V. Vazirani
  // pre: 1. sources[0], sources[1] are array of bits
  //      2. sources[0] and sources[1] are of same length
  if(sources.length < 2) throw errors.InvalidInputError;
  if(!Array.isArray(sources[0]) || !Array.isArray(sources[1])) throw errors.InvalidTypeError;
  if(sources[0].length !== sources[1].length) throw errors.InvalidInputError;
  
  return GFInnerProduct(sources[0], sources[1], 2);
}

module.exports = innerProductExtractor;
