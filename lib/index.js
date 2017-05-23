var extractorNames = exports.extractorNames = ['innerProductExtractor'];

extractorNames.forEach(name => {
  exports[name] = function(b1, b2){
    if(b1.length > b2.length) b1 = b1.slice(0, b2.length);
    if(b1.length < b2.length) b2 = b2.slice(0, b1.length);
    return require(`./extractors/${name}`)(b1, b2);
  };
});
