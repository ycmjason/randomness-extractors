(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.MissingArgError = new Error('Missing Argument Error: expecting arguments');
exports.InvalidInputError = new Error('Invalid Input: the input somehow is invalid');
exports.InvalidTypeError = new Error('Invalid Type Error: the type of the argument(s) given to the function/constructor is unexpected');
exports.InvalidBitError = new Error('Invalid Bit Error: unexpected non 0 or 1 bit');

},{}],2:[function(require,module,exports){
'use strict';

var rye = require('rye');
var range = require('lodash.range');
var padLeft = require('pad-left-simple');

var errors = require('../errors');
var groupArray = require('../utils/groupArray');

var GFInnerProduct = function GFInnerProduct(xs, ys, size) {
  if (xs.length !== ys.length) throw errors.InvalidInputError;
  var field = new rye.PrimeField(size);
  return range(xs.length).map(function (i) {
    return field.mul(xs[i], ys[i]);
  }).reduce(function (acc, curr) {
    return field.add(curr, acc);
  });
};

var numOfBitsToRepresent = function numOfBitsToRepresent(n) {
  return (n - 1).toString(2).length;
};
var bitArrToNumber = function bitArrToNumber(bArr) {
  return Number.parseInt(bArr.join(''), 2);
};

function innerProductExtractor(sources) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  // ref: Generating Quasi-Random Sequences from Two Communicating Slightly-random Sources. -- Umesh V. Vazirani
  // pre: 1. sources[0], sources[1] are array of bits
  //      2. sources[0] and sources[1] are of same length
  if (sources.length < 2) throw errors.InvalidInputError;
  if (!Array.isArray(sources[0]) || !Array.isArray(sources[1])) throw errors.InvalidTypeError;
  if (sources[0].length !== sources[1].length) throw errors.InvalidInputError;

  if (n !== 2) {
    sources = sources.map(function (source) {
      return groupArray(source, numOfBitsToRepresent(n));
    }).map(function (source) {
      return source.map(function (group) {
        return Number.parseInt(group.join(''), 2) % n;
      });
    });
  }

  return padLeft(GFInnerProduct(sources[0], sources[1], n).toString(2), numOfBitsToRepresent(n), 0);
}

module.exports = innerProductExtractor;

},{"../errors":1,"../utils/groupArray":5,"lodash.range":7,"pad-left-simple":8,"rye":9}],3:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var range = require('lodash.range');
var _chunk = require('lodash.chunk');
var padLeft = require('pad-left-simple');

var errors = require('../errors');
var groupArray = require('../utils/groupArray');

var chunk = function chunk(arr, n) {
  return _chunk(arr, n).filter(function (c) {
    return c.length === n;
  });
};

function vonNeumannsExtractor(sources) {
  // pre: 1. sources[0] is array of bits
  if (!Array.isArray(sources[0])) throw errors.InvalidTypeError;
  var chunks = chunk(sources[0], 2);
  var f = function f(x, y) {
    return x === y ? null : x;
  };
  return chunks.map(function (chunk) {
    return f.apply(undefined, _toConsumableArray(chunk));
  }).join('');
}

module.exports = vonNeumannsExtractor;

},{"../errors":1,"../utils/groupArray":5,"lodash.chunk":6,"lodash.range":7,"pad-left-simple":8}],4:[function(require,module,exports){
'use strict';

var errors = require('./errors');

var isBitArr = function isBitArr(arr) {
  return arr.filter(function (i) {
    return i !== 0 && i !== 1;
  }).length === 0;
};

var extractorFactory = function extractorFactory(extractor) {
  return function (sources) {
    sources = sources.map(function (source) {
      return source.map(function (b) {
        return Number.parseInt(b);
      });
    });
    sources.forEach(function (source) {
      if (!isBitArr(source)) throw errors.InvalidBitError;
    });

    // to make sure all sources are of same length
    var shortestLength = sources.map(function (source) {
      return source.length;
    }).reduce(function (min, len) {
      return min <= len ? min : len;
    });
    sources = sources.map(function (source) {
      return source.slice(0, shortestLength);
    });

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return extractor.apply(null, [sources].concat(args));
  };
};

module.exports = {
  vonNeumannsExtractor: extractorFactory(require('./extractors/vonNeumannsExtractor')),
  innerProductExtractor: extractorFactory(require('./extractors/innerProductExtractor'))
};

if (typeof window !== "undefined") window.Extractors = module.exports;

},{"./errors":1,"./extractors/innerProductExtractor":2,"./extractors/vonNeumannsExtractor":3}],5:[function(require,module,exports){
"use strict";

var groupArray = module.exports = function (arr, n) {
  var newArr = [];
  var temp = [];
  arr.forEach(function (e) {
    temp.push(e);
    if (temp.length === n) {
      newArr.push(temp);
      temp = [];
    }
  });
  return newArr;
};

},{}],6:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array ? array.length : 0;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = chunk;

},{}],7:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

module.exports = range;

},{}],8:[function(require,module,exports){
module.exports = function leftPad(s, size, ch){
  if(s.length >= size) return s;
  if(ch === undefined) ch = ' ';
  var pad = new Array(size - s.length).fill(ch).join('');
  return pad + s;
}

},{}],9:[function(require,module,exports){
(function(global) {
	// --------------------------------------------------------------------
	//                         Auxiliary functions
	// --------------------------------------------------------------------

	function baseExpand(num, base) {
	    if (num < base) {
			return [num];
		}

	    var modulo = num % base;
	    var result = baseExpand((num - modulo) / base, base);
	    result.unshift(modulo);
	    return result;        
	}
	    
	function baseContract(powers, base, accumulator) {
		accumulator = accumulator || 1;
		if(powers.length <= 0) {
			return 0;
		}

	    var result = powers[0] * accumulator;	
		accumulator *= base;
		
		return (result + baseContract(powers.slice(1), base, accumulator));
	}

	// --------------------------------------------------------------------
	//                         IntegerRing class
	// This class represents the ring of integers. Its elements can be
	// added, multiplied or divided by each other. Each element has also
	// the norm property, and it can be inversed.
	// The elements of this ring are just integer numbers.
	// --------------------------------------------------------------------
	function IntegerRing() {
		// --------------------------------------------------------------------
		//                         Factor set function
		// Mnemonics: x -> { [y mod x] }
		// This function returns elements of the ring by module of given element
		// --------------------------------------------------------------------
		this.factorSet = function(element) {
			// Calculating the order of factor ring
			var order = this.norm(element);
			// Doing a check that element is not null
			if(order === -Infinity) {
				throw 'Factorization by zero!'
			}
			
			// Allocating an array of elements
			var set = new Array(order);
			// Filling it with numbers [0..x]
			var i = 0;
			for(i=0; i<order; ++i) {
				set[i] = i;
			}
			// Returning result
			return set;
		};
		
		// --------------------------------------------------------------------
		//                          Equality function
		// Mnemonics: (x,y) -> x==y
		// This function compares two elements of the ring.
		// --------------------------------------------------------------------
		this.equal = function(x, y) {
			return (x === y);
		};
		
		// --------------------------------------------------------------------
		//                           Norm function
		// Mnemonics: x -> |x|
		// This function returns the norm of the given element. The norm is just
		// an absolute value of number or minus infinity if number is null
		// --------------------------------------------------------------------
		this.norm = function(x) {
			if(x === 0) {
				// The norm of null number is minus infinity
				return -Infinity;
			}
			
			// Returning absolute value
			return Math.abs(x);
		};
		
		// --------------------------------------------------------------------
		//                           Addition function
		// Mnemonics: (x,y) -> x+y
		// This function adds two elements of the ring
		// --------------------------------------------------------------------
		this.addition = this.add = function(x, y) {
			return x+y;
		};	
		
		// --------------------------------------------------------------------
		//                        Multiplication function
		// Mnemonics: (x,y) -> x*y; 
		// This function multiplicates two elements of the ring.
		// --------------------------------------------------------------------
		this.multiplication = this.mul = function(x, y) {
			return x*y;
		};	
		
		// --------------------------------------------------------------------
		//                        Opposite element function
		// Mnemonics: x -> -x 
		// This function returns inversed(in terms of addition) version of
		// the given element.
		// --------------------------------------------------------------------
		this.opposite = this.opp = function(x) {
			return -x;
		};
		
		// --------------------------------------------------------------------
		//                            Modulo function
		// Mnemonics: (x,y) -> x mod y
		// This function retuns the modulo of division one integer to another.
		// --------------------------------------------------------------------
		this.modulo = this.mod = function(x, y) {
			if( this.norm(y) === -Infinity) {
				throw 'Division by zero!';
			}
			
			return x % y;
		}
		
		// --------------------------------------------------------------------
		//                        Latex string function
		// This function returns latex representation of the given integer
		// --------------------------------------------------------------------
		this.toLatex = function(x) {
			return x.toString();
		};
	}



	// --------------------------------------------------------------------
	//                        PolynomRing class
	// This class represents a ring of polynoms with coefficients from 
	// given field. 'Ring' means that this structure provides such operations:
	// 1. Addition
	// 2. Multiplication
	// 3. Inversion in terms of addition(finding opposite element)
	// All functions operate with instances of the Polynom class(not indexes 
	// like in fields classes, because ring is a infinite structure!).
	// --------------------------------------------------------------------
	function PolynomRing(field) {
	    // The field that contains coefficients values
	    this.field = field;
		
		// --------------------------------------------------------------------
		// This function constructs a polynom with coefficients from current 
		// field. Note that this polynom is ummutable, e.g. you can't change
		// it's coefficients values!
		// The first parameter is an array of indexes of this field's elements.
		// --------------------------------------------------------------------
		this.polynom = function (coefficients) {
			// If coefficients are not defined then the polynom is null 
			if(coefficients === undefined || coefficients.length === 0) {
				coefficients = [0];
			}
			
			// Creating an empty object
			var polynomInstance = {};
			
			// The ring to which this polynom belongs
			polynomInstance.ring  = this;
			
			// The field in which coefficients are contained
			polynomInstance.field = this.field;
					
			// Calculating the degree of the polynom
			var _degree = coefficients.length - 1;	
	        // Skip all high-order nulls
	        while (_degree >= 0 && coefficients[_degree] === this.field.nullElement()) {
	            --_degree;
	        }
			// The degree of the null polynom is minus infinity
	        if (_degree === -1) {
	            _degree = -Infinity;
	        }
			
			// Copying indexes to the private array
			var _coefficients = coefficients.slice(0, 
				(_degree === -Infinity) ? 1 : (_degree + 1));
			
				// This function returns the degree of the polynom
			polynomInstance.degree = function() {
				return _degree;
			};
			
			// This function returns the array of the coefficients
			polynomInstance.coefficients = polynomInstance.coefs = function() {
				// Returning the copy of the original array
				return _coefficients.slice();
			};
			
			// This function returns the value of specified coefficient
			polynomInstance.coefficient = polynomInstance.coef = function(index) {
				// The null polynom has null coefficients
				if(_degree === -Infinity) {
					return this.field.nullElement();
				}	
				
				// We shouldn't throw error in case of bad index, because other 
				// coefficients in fact are null.
				if (index >= 0 && index <= _degree) {
					return _coefficients[index];
				} else {
					return this.field.nullElement();
				}
			};
			
			// This function applicates given value to the polynom, i.e. it returns 
			// a value of the polynom in the specified point
			polynomInstance.application = polynomInstance.app = function(value) {
				// The value of the null polynom is null
				if(_degree === -Infinity) {
					return this.field.nullElement();
				}
				// This will hold result
				var result = this.field.nullElement();
				
				// The current power of x
				var valuePower = this.field.oneElement();

				// Calculating the sum of monomials applicated with this value
				var currentPower = 0;
				for (currentPower = 0; currentPower <= _degree; ++currentPower) {
					result = this.field.add(result, this.field.mul(valuePower, this.coef(currentPower)));
					// Calculating the next power of x
					valuePower = this.field.mul(valuePower, value);
				}

				return result;
			};
			
			// Returning constructed object
			return polynomInstance;
	    };
		
		// --------------------------------------------------------------------
		//                          Factor set function 
		// Mnemonics: (f) -> { [g(x) mod f(x)] }
		// This function returns factor set of the ring by module of given
		// element.
		// --------------------------------------------------------------------
		this.factorSet = function(element) {
			// We cannot divide by the null polynom
			if(element.degree() === -Infinity) {
				throw 'Factorization by null element';
			}
			
			// Calculating the degree of the factor set
			var order = Math.pow(this.field.order, element.degree());
			// Allocating the array for set
			var set = new Array(order);
			
			var i=0;
			for(i=0; i<order; ++i) {
				// Filling the set
				set[i] = this.polynom( baseExpand(i, this.field.order) );
			}
			return set;
		};
		
		// --------------------------------------------------------------------
		//                           Equality function 
		// Mnemonics: (f,g) -> (f(x) == g(x))
		// This function checks if two polynoms are equal
		// --------------------------------------------------------------------
		this.equal = function(f, g) {
			// Checking that polynoms have the same field
			if(f.field.order !== g.field.order) {
				return false;
			}
			
			// Checking polynoms degrees
			if(f.degree() !== g.degree()) {
				return false;
			}
			
			// Checking the null polynom
			var i = f.degree();
			if(i === -Infinity) {
				return true;
			}
			
			// Checking coefficients equality
			for(; i >= 0; --i) {
				if( f.coef(i) !== g.coef(i) ) {
					return false;
				}	
			}
			return true;
		};
		
		// --------------------------------------------------------------------
		//                       Euclidean norm function
		// Mnemonics: f(x) -> deg(f(x))
		// This function returns euclidean norm of the given element. For 
		// polynoms it's just a degree of a polynom.
		// --------------------------------------------------------------------
		this.norm = function(f) {
			return f.degree();
		};

	  	// --------------------------------------------------------------------
		//                          Addition function
		// Mnemonics: (f(x), g(x)) -> (f(x) + g(x))
	    // This funcion adds two polynoms. Note that f and g are instances of
	    // internal class polynom, but not indexes, cause ring is an infinite 
		// structure 
		// --------------------------------------------------------------------
	    this.addition = this.add = function(f, g) {
	        // The degree is maximum degree of two polynoms
	        var degree = Math.max(f.degree(), g.degree());
			
			// The case when both polynoms are null
			if (degree === -Infinity) {
				return this.polynom();
			}
			
	        // Allocating an array for coefficients
	        var sumCoefs = new Array(degree + 1);

	        var i;
	        for (i = 0; i <= degree; ++i) {
	            // Calculate sum of the coeffients using field arithmetics
	            sumCoefs[i] = this.field.add(f.coef(i), g.coef(i));
	        }

	        // Return new polynom with calculated coefficients
	        return this.polynom(sumCoefs);
	    };

		// --------------------------------------------------------------------
		//                       Multiplication function
		// Mnemonics: (f(x), g(x)) -> (f(x) * g(x))
	    // This function calculates the product of two polynoms    
		// --------------------------------------------------------------------
	    this.multiplication = this.mul = function(f, g) {
	        // Calculate the degree of product polynom (sum of degrees)
	        var degree = f.degree() + g.degree();
			
			// The case when at least one of polynoms is null
			if (degree === -Infinity) {
				return this.polynom();
			}
			
	        // Allocate memory for product coefficients        
	        var productCoefs = new Array(degree + 1);

	        var i, j;
	        for (i = 0; i <= degree; ++i) {
	            var currentCoefficient = 0;
	            for (j = 0; j <= i; ++j) {
	                // Calculating coefficient using formula sum(i=1..n+m) f(j)*g(i-j)
	                currentCoefficient = field.add(
	                    field.mul(f.coef(j), g.coef(i - j)), 
	                    currentCoefficient);
	            }

	            // Assigning current coefficient
	            productCoefs[i] = currentCoefficient;
	        }

	        // Returning new polynom with calculated coefficients
	        return this.polynom(productCoefs);
	    };

	    // --------------------------------------------------------------------
		//                           Opposite function
		// Mnemonics: f(x) -> -f(x)
	    // This function returns an opposite polynom to the specified
		// --------------------------------------------------------------------
	    this.opposite = this.opp = function(f) {
	        var self = this;

	        // Coefficients of the opposite polynom are also opposite
	        var oppCoeffs = f.coefficients().map(function(coefficient) {
	            return self.field.opposite(coefficient);
	        });

	        return this.polynom(oppCoeffs);
	    };

		// --------------------------------------------------------------------
		//                            Module function
		// Mnemonics: (f(x), g(x)) -> (f(x) mod g(x))
		// This function calculates the module of division one polynom to another
		// --------------------------------------------------------------------
	    this.modulo = this.mod = function(f, g) {
			return this.divmod(f,g) [1];
	    };
		
	    // --------------------------------------------------------------------
	    //                        Integer division function
	    // Mnemonics: (f(x), g(x)) -> (f(x) div g(x))
		// This function calculates the integer division one polynom to another
	    // --------------------------------------------------------------------
	    this.division = this.div = function(f, g) {
			return this.divmod(f,g) [0];
	    };
		
	    // --------------------------------------------------------------------
	    //                          Full division function
	    // Mnemonics: (f(x), g(x)) -> [f(x) div g(x), f(x) mod g(x))]
	    // This function calculates the full division
	    // --------------------------------------------------------------------
		this.divmod = function(f, g, div) {
	        // Calculating a degree of each polynom
	        var degreeF = f.degree();
	        var degreeG = g.degree();

			// Integer division part
			if(div === undefined) {
				div = [];
			}
			
	        // When degree of f (divident) is less than degree of g (divisor) than
	        // modulo is simply f
	        if (degreeF < degreeG) {
	            return [this.polynom(div), f];
	        }
			
			// We can't divide by the null polynom
			if( degreeG === -Infinity) {
				throw 'Division by zero element of the ring!';
			}

	        // Constructs an array for divisor polynom
	        var divisor = Array(degreeF + 1);

	        // Now we are trying to build polynom which will decrease the divident
	        // degree by one. To do that we shift divisor and multiply all its 
	        // coefficient by special element(to fill highest coefficient of the
	        // divident(f) with null.
			div.unshift(field.mul(f.coef(degreeF), 
							field.inv(g.coef(degreeG))));
							
			var i;
	        for (i = 0; i <= degreeF; ++i) {
	            if (i >= degreeF - degreeG) {
	                var j = (i - degreeF + degreeG);
	                // Doing all transformation with coefficients(in field 
	                // arithmetics of course)
	                var coef = field.mul(g.coef(j), div[0]);

	                divisor[i] = field.opp(coef);
	            }
	            // This will make shift
	            else {
	                divisor[i] = 0;
	            }
	        }
			
			// Now adding this stuff to f and repeat this algorithm with a new,
	        // 'less-degreeful' divident
			var dividedF = this.add(f, this.polynom(divisor));
			
			// Don't forget to add nulls, if degree difference is more than one
			if(dividedF.degree() !== -Infinity) {
				var degreeDifference = f.degree() - dividedF.degree() - 1;
				
				for(i = 0; i < degreeDifference; ++i) {
					div.unshift(this.field.nullElement());
				}
			}
	        
	        // Repeating algorithm
	        return this.divmod(dividedF, g, div);
	    };
		
		// --------------------------------------------------------------------
		//                          Latex string function
		// This function returns latex representation of the given polynom
		// Options: 
		//  level  - sets render depth
		//  modulo - include modulo or not 
		// --------------------------------------------------------------------
		this.toLatex = function(f, options) {
			// Parsing options
			options = options || {};
			options.level  = (options.level  === undefined) ? 1 : options.level;
			options.modulo = (options.modulo === undefined) ? false : options.modulo;  
			
			// Options for the next level of rendering
			var nextOptions = {
				level 	: options.level-1,
				modulo 	: options.modulo
			};
			
			// This will hold result
			var latexStr = '';
			
			if(f.degree() === -Infinity) {
				// If polynom is null, just draw null element
				return this.field.toLatex(this.field.nullElement(), nextOptions);
			}
			
			var monoms = [];
			var i = 0;
			for(i = 0; i <= f.degree(); ++i) {
				// Will not render monoms with null coefficient
				if(f.coef(i) !== this.field.nullElement() ) {
					var currentPower = '';
					
					if(i === 0) {
						// Not render x at 0 degree
						currentPower = '';
					}
					else if(i === 1) {
						// Render only x at 1 degree
						currentPower = 'x';
					} else {
						// Render powers of x at other degrees
						currentPower = 'x^{'+i + '}';
					}	
					
					var currentCoef = '';
					if(options.level > 0) {
						// If level is not null render cofficient completely
						currentCoef = this.field.toLatex(f.coef(i), nextOptions);
					} else {
						if(f.coef(i) !== 1 || i == 0) {
							// If level is null just render index
							currentCoef = f.coef(i).toString();
						}
					}
						
					// Constructing monom result
					var currentMonom = currentCoef + currentPower;
					monoms.unshift(currentMonom);
				}
			}
			
			// The monoms are separated with plus
			latexStr = monoms.join('+');
			
			return latexStr;
		};
	}



	// --------------------------------------------------------------------
	//                        FactorRing class
	// This class represents a ring that built as a factor of the given
	// ring by module of pricipal ideal with given generator.
	// --------------------------------------------------------------------
	function FactorRing(ring, generator) {
		// This will help us to access object inside a callback
		var self = this;
		
		// The ring that will be factorized
		self.ring = ring;
		// The base element of the ideal
		self.generator = generator;	
		
		// Obtaining elements of the factor ring and it's order
		var elementsTable 	= self.ring.factorSet(self.generator);
		self.order 			= elementsTable.length;
		
		// Allocating private data
		var nullIndex 	= NaN; 	// The index of the null element
		var oneIndex 	= NaN;	// The index of the one element
		
		// Allocating private tables. It will speed up some operations like
		// finding an inverse element or opposite element
		var additionTable 		= new Array(this.order);
		var multiplicationTable = new Array(this.order);
		var inverseTable  		= new Array(this.order);
		var oppositeTable 		= new Array(this.order);
		
		// --------------------------------------------------------------------
		//                      Element-by-index function
		// Mnemonics: i -> R(i)
		// This function returns element of the ring by its index
		// --------------------------------------------------------------------
		self.element = function(i) {
			return elementsTable[i];
		};
		
		// --------------------------------------------------------------------
		//                      Index-by-element function
		// Mnemonics: e -> I(e)
		// This function returns the index of the given element
		// --------------------------------------------------------------------
		self.index = function(e) {
			var i = 0;
			for(i=0; i < this.order; ++i) {
				if(self.ring.equal(e, self.element(i))) {
					return i;
				}
			}
			
			// Cannot find element!
			return NaN;
		};
		
		// Now lets fill the addition table. Also we'll probably find
		// the null element. 
		(function fillAdditionTable() {
			var i = 0, j = 0;
			for(i = 0; i < self.order; ++i) {
				// Allocating row in current cell
				additionTable[i] = new Array(self.order);
				
				for(j = 0; j < self.order; ++j) {
					// To be sure, that all table will be filled clearly.
					additionTable[i][j] = NaN;
					
					// Calculating sum element in terms of the ring
					var sumIndex = self.index(
						self.ring.mod(
							self.ring.add(elementsTable[i], elementsTable[j]),
							self.generator	// Factorising
						)
					);
						
					// Filling the table entry
					additionTable[i][j] = sumIndex;
					
					// To find null element we are using theorems:
					// 1. a+a=a <=> a=1 (in ring)
					// 2. There is only one null element in a ring
					if( i === j && j === sumIndex) {
						nullIndex = i;
					}
				}
			}
		}) ();
		
		// Now lets fill the multiplication table. Also we'll probably find
		// the one element. 
		(function fillMultiplicationTable() {
			var i = 0, j = 0;
			for(i = 0; i < self.order; ++i) {
				// Allocating row in current cell
				multiplicationTable[i] = new Array(self.order);
				
				for(j = 0; j < self.order; ++j) {
					// To be sure, that all table will be filled clearly
					multiplicationTable[i][j] = NaN;
				
					// Calculating multiplication in terms of the ring
					var multIndex = self.index(
						self.ring.mod(
							self.ring.mul(elementsTable[i], elementsTable[j]),
							self.generator	// Factorising
						));
					
					// Filling the table entry
					multiplicationTable[i][j] = multIndex;

					// To find the one element using theorems:
					// 1. a*a=a a!=0 <=> a=1
					// 2. There is only one 'one' element(if exists)
					if( i === j && j === multIndex && i !== nullIndex) {
						oneIndex = i;
					}
				}
			}
		}) ();
		
		// Now we are trying to fill the opposite and inverse table.
		// Note, that not all the elements can be inversed(in this 
		// case the inversed index is NaN)
		(function fillOppInvTables() {
			var i = 0, j = 0;
			for( i = 0; i < self.order; ++i) {
				// Filling with NaNs
				oppositeTable[i] = NaN;
				inverseTable[i]  = NaN;
				
				for( j = 0; j < self.order; ++j) {
					// Opposite element definition:
					// b = (-a) <=> def a+b=b+a=0
					if(additionTable[i][j] === nullIndex) {
						oppositeTable[i] = j;
					}
					
					// Inverse element definition:
					// b = 1/a <=> def b*a=1 (a!=0, b!=0)
					if(multiplicationTable[i][j] === oneIndex) {
						inverseTable[i] = j;
					}
				}
			}
		}) ();
		
		// --------------------------------------------------------------------
		//                      Null element index function
		// Mnemonics: () -> (i that R(i)=0 (for each a a+R(i)=a mod B))
		// This function returns the index of the null element
	 	// --------------------------------------------------------------------
		this.nullElement = function() {
			return nullIndex;
		};

		// --------------------------------------------------------------------
		//                      One element index function
		// Mnemonics: () -> (i that R(i)=1 (for each a!=0 a*R(i)=a mod B))
		// This function retruns the index of the one element
		// --------------------------------------------------------------------	
		this.oneElement = function() {
			return oneIndex;
		};
		
		// --------------------------------------------------------------------
		//                          Addition function
		// Mnemonics: (i,j) -> I(R(i) + R(j) mod B)
		// This function adds two elements of the factor ring(by indexes)
		// --------------------------------------------------------------------
		this.addition = this.add = function(i, j) {
			return additionTable[i][j];
		};
		
		// --------------------------------------------------------------------
		//                        Multiplication function
		// Mnemonics: (i,j) -> I(R(i)*R(j) mod B)
		// This function multiplicates two elements of the factor ring (by 
		// indexes)
		// --------------------------------------------------------------------
		this.multiplication = this.mul = function(i, j) {
			return multiplicationTable[i][j];
		};
		
		// --------------------------------------------------------------------
		//                      Opposite element function
		// Mnemonics: i -> (j that (R(i)+R(j) mod B) = R(0))
		// This function returns the index of the opposite element of the given
		// --------------------------------------------------------------------
		this.opposite = this.opp = function(i) {
			return oppositeTable[i];
		};
		
		// --------------------------------------------------------------------
		//                      Inverse element function
		// Mnemonics: i -> (j that (R(i)*R(j) mod B) = R(1))
		// This function returns the index of the inversed element of the given
		// --------------------------------------------------------------------
		this.inverse = this.inv = function(i) {
			return inverseTable[i];
		};
		
		// --------------------------------------------------------------------
		//                       Latex string function
		// This function returns latex representation of element of the ring.
		// Options: 
		//  level  - sets render depth
		//  modulo - include modulo or not 
		// --------------------------------------------------------------------
		this.toLatex = function(i, options) {
			// Parsing options
			options = options || {};
			options.level  = (options.level  === undefined) ? 1 : options.level;
			options.modulo = (options.modulo === undefined) ? false : options.modulo;  
			
			// Defining options for the next level of render
			var nextOptions = {
				level 	: options.level-1,	
				modulo 	: options.modulo
			};
			
			// If index is not a number just draw dash
			if(isNaN(i)) {
				return '-';
			}
			
			// If level is 0 than just draw index
			if(options.level <= 0) {
				return i.toString();
			}
			
			var latexStr = '';
			// Rendering element of the ring
			var elementStr = this.ring.toLatex(this.element(i), nextOptions);
			
			// If module option is set draw modulo
			if(options.modulo) {
				// Rendering generator of the ideal
				var generatorStr = this.ring.toLatex(this.generator, nextOptions);
				// Appending to output
				latexStr = '[' + elementStr + ']' + '_{' + generatorStr + '}';
			} else {
				latexStr = elementStr;
			}
			
			// Returning result
			return latexStr;
		};
	}

	// --------------------------------------------------------------------
	//                          PrimeField class
	// This class represents a prime field structure. It is actually a
	// factorization of the ring of integers by given irreducible element.
	// The irreducible element of this ring is just a prime number.
	// So, in common case, this structure is not actually a field, but a 
	// factor ring.
	// --------------------------------------------------------------------
	function PrimeField(num) {
		// Bulding the ring of integers
		var ring = new IntegerRing();
		
		// Factorizing it by given number
		FactorRing.call(this, ring, num);
	}

	global.IntegerRing = IntegerRing;
	global.PolynomRing = PolynomRing;
	global.FactorRing  = FactorRing;
	global.PrimeField  = PrimeField;

}) (typeof exports === 'undefined' ? this : exports);
},{}]},{},[4]);
