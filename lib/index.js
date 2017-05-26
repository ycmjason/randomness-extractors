var errors = require('./errors');

var extractorNames = exports.extractorNames = ['innerProductExtractor'];

var isBitArr = (arr) => {
  return arr.filter(i => i !== 0 && i !== 1).length === 0;
};

extractorNames.forEach(name => {
  exports[name] = function(sources){
    sources = sources.map(source => source.map(b => Number.parseInt(b)));
    sources.forEach(source => { if(!isBitArr(source)) throw errors.InvalidBitError});

    var shortestLength = sources.map(source => source.length)
                                .reduce((min, len) => (min <= len)? min: len);
    // to make sure all sources are of same length
    sources = sources.map(source => source.slice(0, shortestLength));

    return require(`./extractors/${name}`)(sources);
  };
});
