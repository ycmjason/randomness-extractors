var assert = require('assert');

var groupArray = require('../../lib/utils/groupArray');

describe('groupArray', function(){
  it('# [0, 1, 0, 0] => [[0, 1], [0, 0]]', function(){
    assert.deepEqual(groupArray([0, 1, 0, 0], 2), [[0, 1], [0, 0]]);
  });
  it('# [0, 1, 0, 0] => [[0, 1, 0]]', function(){
    assert.deepEqual(groupArray([0, 1, 0, 0], 3), [[0, 1, 0]]);
  });
});
