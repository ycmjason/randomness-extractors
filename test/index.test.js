process.env.NODE_ENV = 'test';

var assert = require('assert');

var Extractors = require('..');

describe('Randomness Extractor', function(){
  describe('vonNeumannsExtractor', function(){
    var specs = [
      { input: ["00001"], expect: '' },
      { input: ["011011"], expect: '01' },
      { input: ["00101010"], expect: '111' },
    ];

    specs.forEach(spec => spec.input = spec.input.map(b => b.split('')));

    specs.forEach(spec => {
      it(`# vonNeumannsExtractor(${spec.input.join(', ')}) === ${spec.expect}`, function(){
        assert.equal(Extractors.vonNeumannsExtractor(spec.input), spec.expect)
      });
    });
  });

  describe('innerProductExtractor', function(){
    var specs = [
      { input: ["00001",     "11110"],                  expect: '0' },
      { input: ["00011",     "11110"],           n: 1,   expect: '1' },
      { input: ["00111",     "11110"],           n: 1,   expect: '0' },
      { input: ["00111111",  "11110"],           n: 1,   expect: '0' },
      { input: ["00111",     "11110101001010"],         expect: '0' },
      { input: ["00101100",  "10110110"],        n: 2,  expect: '10' },
      { input: ["001011001",  "101101100"],        n: 2,  expect: '10' },
      { input: ["001011001",  "10110110"],        n: 2,  expect: '10' },
    ];

    specs.forEach(spec => spec.input = spec.input.map(b => b.split('')));

    specs.forEach(spec => {
      it(`# innerProductExtractor(${spec.input.join(', ')}, ${spec.n}) === ${spec.expect}`, function(){
        assert.equal(Extractors.innerProductExtractor.call(null, spec.input, spec.n), spec.expect)
      });
    });
  });
});
