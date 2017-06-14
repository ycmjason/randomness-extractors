var rye = require('rye');
var range = require('lodash.range');
var padLeft = require('pad-left-simple');
var chunk = require('lodash.chunk');

var errors = require('../errors');

var binary_field = new rye.PrimeField(2);
var binary_polynom_ring = new rye.PolynomRing(binary_field);

// ref: https://oeis.org/A058943
var irreducible_polynoms = [
  '10',   // x
  '111',  // x^2 + x + 1
  '1011', // x^3 + x + 1
  '10011',
  '100101',
  '1000011',
  '10000011',
  '100011011',
  '1000000011',
  '10000001001',
  '100000000101',
  '1000000001001',
  '10000000011011',
].map(x => x.split('').reverse()).map(coefficients => binary_polynom_ring.polynom(coefficients))

var GFInnerProduct = (xs, ys, size) => {
  if(xs.length !== ys.length) throw errors.InvalidInputError;
  if(size > irreducible_polynoms.length) throw errors.InvalidInputError;

  // construct GF(2^size)
  var field = new rye.FactorRing(binary_polynom_ring, irreducible_polynoms[size - 1]);
  
  return range(xs.length)
    .map(i => field.mul(xs[i], ys[i]))
    .reduce((acc, curr) => field.add(curr, acc));
};

function innerProductExtractor(sources, n = 1){
  // ref: Generating Quasi-Random Sequences from Two Communicating Slightly-random Sources. -- Umesh V. Vazirani
  // pre: 1. sources[0], sources[1] are array of bits
  //      2. sources[0] and sources[1] are of same length
  if(sources.length < 2) throw errors.InvalidInputError;
  if(!Array.isArray(sources[0]) || !Array.isArray(sources[1])) throw errors.InvalidTypeError;
  if(sources[0].length !== sources[1].length) throw errors.InvalidInputError;

  sources = sources.map(source => chunk(source, n).slice(0, -1))
    .map(source => source.map(chnk => Number.parseInt(chnk.join(''), 2)));

  return padLeft(GFInnerProduct(sources[0], sources[1], n).toString(2), n, '0');
}

module.exports = innerProductExtractor;
