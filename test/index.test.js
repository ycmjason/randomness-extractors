process.env.NODE_ENV = 'test';

var assert = require('assert');

var Extractors = require('../lib/index');

describe('Randomness Extractor', function(){
  describe('innerProductExtractor', function(){
    var specs = [
      { input: ["00001",     "11110"],                  expect: '0' },
      { input: ["00011",     "11110"],           n:2,   expect: '1' },
      { input: ["00111",     "11110"],           n:2,   expect: '0' },
      { input: ["00111111",  "11110"],           n:2,   expect: '0' },
      { input: ["00111",     "11110101001010"],         expect: '0' },
      { input: ["00101100",  "10110110"],        n: 3,  expect: '00' },
      { input: ["00101100000",  "10110110"],     n: 3,  expect: '00' },
      { input: ["00101100",  "10110110000"],     n: 3,  expect: '00' },
      { input: ["11101011",  "001011000"],       n: 5,  expect: '011' },
    ];

    specs.forEach(spec => {
      it(`# innerProductExtractor(${spec.input.join(', ')}) === ${spec.expect}`, function(){
        spec.input = spec.input.map(b => b.split(''));
        assert.equal(Extractors.innerProductExtractor.call(null, spec.input, spec.n), spec.expect)
      });
    });
  });

  describe('vonNeumannsExtractor', function(){
    var specs = [
      { input: "00001", expect: '' },
      { input: "011011", expect: '01' },
      { input: "00101010", expect: '111' },
    ];

    specs.map(spec => spec.input = spec.input.split(''));

    specs.forEach(spec => {
      it(`# vonNeumannsExtractor(${spec.input.join(', ')}) === ${spec.expect}`, function(){
        assert.equal(Extractors.vonNeumannsExtractor(spec.input), spec.expect)
      });
    });
  });
});
