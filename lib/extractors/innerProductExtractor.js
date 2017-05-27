var rye = require('rye');
var range = require('lodash.range');
var padLeft = require('pad-left-simple');

var errors = require('../errors');
var groupArray = require('../utils/groupArray');

var GFInnerProduct = (xs, ys, size) => {
  if(xs.length !== ys.length) throw errors.InvalidInputError;
  var field = new rye.PrimeField(size);
  return range(xs.length)
    .map(i => field.mul(xs[i], ys[i]))
    .reduce((acc, curr) => field.add(curr, acc));
};

var numOfBitsToRepresent = (n) => (n-1).toString(2).length;
var bitArrToNumber = (bArr) => Number.parseInt(bArr.join(''), 2);

function innerProductExtractor(sources, n = 2){
  // ref: Generating Quasi-Random Sequences from Two Communicating Slightly-random Sources. -- Umesh V. Vazirani
  // pre: 1. sources[0], sources[1] are array of bits
  //      2. sources[0] and sources[1] are of same length
  if(sources.length < 2) throw errors.InvalidInputError;
  if(!Array.isArray(sources[0]) || !Array.isArray(sources[1])) throw errors.InvalidTypeError;
  if(sources[0].length !== sources[1].length) throw errors.InvalidInputError;

  if(n !== 2){
    sources = sources.map(source => groupArray(source, numOfBitsToRepresent(n)))
                     .map(source => source.map(group => Number.parseInt(group.join(''), 2) % n));
  }

  return padLeft(GFInnerProduct(sources[0], sources[1], n).toString(2), numOfBitsToRepresent(n), 0);
}

module.exports = innerProductExtractor;
