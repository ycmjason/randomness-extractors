# Randomness Extractors
[![Build Status](https://travis-ci.org/ycmjason/randomness-extractors.svg?branch=master)](https://travis-ci.org/ycmjason/randomness-extractors)

Extract (hopefully) almost uniform random bit from source(s) of biased and correlated bits.

## Install
```
npm install --save randomness-extractors
```

## Extractors

### inner product extractor
Reference: [https://people.eecs.berkeley.edu/~vazirani/pubs/2com.pdf](https://people.eecs.berkeley.edu/~vazirani/pubs/2com.pdf)

```javascript
var Extractors = require('randomness-extractors');
Extractors.innerProductExtractor([0, 0, 0, 1, 1], [1, 1, 1, 1, 0]) // 0;

```

## Test
```
npm test
```
