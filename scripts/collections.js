/**
 * Iterate over an array, and call a function on each item.
 */
var forEach = function (
  array,   // Array:    The array to iterate over.
  callback // Function: The function to call on each item. `callback(item, index, array)`
) {
  if (array) {
    for (var index = 0, length = getLength(array); index < length; index++) {
      var result = callback(array[index], index, array);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
var forIn = function (
  object,  // Object*:   The object to iterate over.
  callback // Function*: The function to call on each pair. `callback(value, key, object)`
) {
  if (object) {
    for (var key in object) {
      var result = callback(key, object[key], object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Decorate an object with properties from another object. If the properties
 */
var decorateObject = function (
  object,     // Object: The object to decorate.
  decorations // Object: The object to iterate over.
) {
    if (object && decorations) {
    forIn(decorations, function (key, value) {
      object[key] = value;
    });
    }
    return object;
};

/**
 * Ensure that a property exists by creating it if it doesn't.
 */
var ensureProperty = function (
  object,
  property,
  defaultValue
) {
  var value = object[property];
  if (!value) {
    value = object[property] = defaultValue;
  }
  return value;
};

/**
 * Get the length of an array.
 * @return number: Array length.
 */
var getLength = function (
  array // Array|DomNodeCollection|String: The object to check for length.
) {
  return isInstance(array) || isString(array) ? array.length : 0;
};

/**
 * Get the first item in an array.
 * @return mixed: First item.
 */
var getFirst = function (
  array // Array: The array to get the
) {
  return isInstance(array) ? array[0] : undefined;
};

/**
 * Get the first item in an array.
 * @return mixed: First item.
 */
var getLast = function (
  array // Array: The array to get the
) {
  return isInstance(array) ? array[getLength(array) - 1] : undefined;
};

/**
 * Check for multiple array items.
 * @return boolean: true if the array has more than one item.
 */
var hasMany = function (
  array // Array: The array to check for item.
) {
  return getLength(array) > 1;
};

/**
 * Push an item into an array.
 * @return mixed: Pushed item.
 */
var push = function (
  array, // Array: The array to push the item into.
  item   // mixed: The item to push.
) {
  if (isArray(array)) {
    array.push(item);
  }
  return item;
};

/**
 * Pop an item off an array.
 * @return mixed: Popped item.
 */
var pop = function (
  array // Array: The array to push the item into.
) {
  if (isArray(array)) {
    return array.pop();
  }
};

var merge = function (
  array, // Array:  The array to merge into.
  items  // mixed+: The items to merge into the array.
) {
  // TODO: Use splice instead of pushes to get better performance?
  var addToFirstArray = function (item) {
    array.push(item);
  };
  for (var i = 1, l = arguments.length; i < l; i++) {
    forEach(arguments[i], addToFirstArray);
  }
};

/**
 * Push padding values onto an array up to a specified length.
 * @return number: The number of padding values that were added.
 */
var pad = function (
  array,       // Array:  The array to check for items.
  padToLength, // number: The minimum number of items in the array.
  paddingValue // mixed|: The value to use as padding.
) {
  var countAdded = 0;
  if (isArray(array)) {
    var startingLength = getLength(array);
    if (startingLength < length) {
      paddingValue = isUndefined(paddingValue) ? '' : paddingValue;
      for (var index = startingLength; index < length; index++) {
        array.push(paddingValue);
        countAdded++;
      }
    }
  }
  return countAdded;
};
