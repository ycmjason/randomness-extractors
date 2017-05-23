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

function innerProductExtractor(bs1, bs2){
  // ref: Generating Quasi-Random Sequences from Two Communicating Slightly-random Sources. -- Umesh V. Vazirani
  // pre: 1. bs1, bs2 are array of bits
  //      2. bs1 and bs2 are of same length
  if(!Array.isArray(bs1) || !Array.isArray(bs2)) throw errors.InvalidTypeError;
  if(bs1.length !== bs2.length) throw errors.InvalidInputError;
  
  return GFInnerProduct(bs1, bs2, 2);
}

module.exports = innerProductExtractor;
