process.env.NODE_ENV = 'test';

var assert = require('assert');

var Extractors = require('../lib/index');

describe('Randomness Extractor', function(){
  describe('innerProductExtractor', function(){
    var specs = [
      { input: ["00001", "11110"], expect: 0 },
      { input: ["00011", "11110"], expect: 1 },
      { input: ["00111", "11110"], expect: 0 },
    ];
    specs.forEach(spec => {
      it(`# innerProductExtractor(${spec.input[0]}, ${spec.input[1]}) === ${spec.expect}`, function(){
        assert.equal(Extractors.innerProductExtractor(spec.input[0].split(''), spec.input[1].split('')), spec.expect)
      });
    });
  });
});
