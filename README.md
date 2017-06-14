# Randomness Extractors
[![Build Status](https://travis-ci.org/ycmjason/randomness-extractors.svg?branch=master)](https://travis-ci.org/ycmjason/randomness-extractors)

Extract (hopefully) almost uniform random bit from source(s) of biased and correlated bits.

## Install
```
npm install --save randomness-extractors
```

## Extractors

### Von Neumann's Extractor
Reference: J. Von Neumann, “Various techniques used in connection with random digits,” Applied Math Series, Notes by G. E. Forsythe, in National Bureau of Standards, Vol. 12, pp. 36-38, 1951.

```javascript
var Extractors = require('randomness-extractors');

var source = [0, 0, 1, 0, 1, 1, 0, 1];
Extractors.vonNeumannsExtractor([source]); // '10'
```

### Inner Product Extractor
Reference: [https://people.eecs.berkeley.edu/~vazirani/pubs/2com.pdf](https://people.eecs.berkeley.edu/~vazirani/pubs/2com.pdf)

You could do inner product of the two sources in GF(2) to extract a random bit. Optionally, you could also perform the inner product in GF(2^n), 1 <= n <= 13, to obtain n random bits.

```javascript
var Extractors = require('randomness-extractors');
Extractors.innerProductExtractor([[0, 0, 0, 1, 1], [1, 1, 1, 1, 0]]) // '0';

var source1 = [0, 0, 1, 0, 1, 1, 0, 0];
var source2 = [1, 0, 1, 1, 0, 1, 1, 0];

var n = 3; // inner-product of GF(2^3)
Extractors.innerProductExtractor([source1, source2], n) // '001'
```

## Browser usage

You can get the extractors by including the `dist/out.js`.

```javascript
...

<script src="node_modules/randomness-extractors/dist/out.js"></script>
<script>
Extractors.innerProductExtractor([0, 0, 0, 1, 1], [1, 1, 1, 1, 0]) // '0';
</script>

...
```

Or you could use browsify/webpack to require the package.

## Test
```
npm test
```
