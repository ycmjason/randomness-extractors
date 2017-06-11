var errors = require('./errors');

var isBitArr = (arr) => {
  return arr.filter(i => i !== 0 && i !== 1).length === 0;
};

var extractorFactory = function(extractor){
  return function(sources, ...args){
    sources = sources.map(source => source.map(b => Number.parseInt(b)));
    sources.forEach(source => { if(!isBitArr(source)) throw errors.InvalidBitError});

    // to make sure all sources are of same length
    var shortestLength = sources.map(source => source.length)
      .reduce((min, len) => (min <= len)? min: len);
    sources = sources.map(source => source.slice(0, shortestLength));

    return extractor.apply(null, [sources].concat(args));
  };
};

module.exports = {
  vonNeumannsExtractor: extractorFactory(require('./extractors/vonNeumannsExtractor')),
  innerProductExtractor: extractorFactory(require('./extractors/innerProductExtractor')),
};

if(typeof window !== "undefined") window.Extractors = module.exports;
