/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (value, index, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @param  {Function}             fn     A function to call on each item.
 * @return {Number}                      The number of items iterated over without breaking.
 */
Jymin.forEach = function (array, fn) {
  if (array) {
    array = Jymin.isString(array) ? Jymin.splitByCommas(array) : array;
    for (var index = 0, length = Jymin.getLength(array); index < length; index++) {
      var result = fn(array[index], index, array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (index, value, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}     array  A collection, expected to have indexed items and a length.
 * @param  {Function}  fn                   A function to call on each item.
 * @return {Number}                         The number of items iterated over without breaking.
 */
Jymin.each = function (array, fn) {
  if (array) {
    array = Jymin.isString(array) ? Jymin.splitByCommas(array) : array;
    for (var index = 0, length = Jymin.getLength(array); index < length; index++) {
      var result = fn(index, array[index], array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Get the length of an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have a length.
 * @return {Number}                     The length of the collection.
 */
Jymin.getLength = function (array) {
  return (array || 0).length || 0;
};

/**
 * Get the first item in an Array/Object/string/etc.
 * @param {Array|Object|string}  array  A collection, expected to have index items.
 * @return {Object}                     The first item in the collection.
 */
Jymin.getFirst = function (array) {
  return (array || 0)[0];
};

/**
 * Get the last item in an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @return {Object}                     The last item in the collection.
 */
Jymin.getLast = function (array) {
  return (array || 0)[Jymin.getLength(array) - 1];
};

/**
 * Check for the existence of more than one collection items.
 *
 * @param {Array|Object|string}   array  A collection, expected to have a length.
 * @return {boolean}                     True if the collection has more than one item.
 */
Jymin.hasMany = function (array) {
  return Jymin.getLength(array) > 1;
};

/**
 * Push an item into an array.
 *
 * @param  {Array}  array  An array to push an item into.
 * @param  {Object} item   An item to push.
 * @return {Object}        The item that was pushed.
 */
Jymin.push = function (array, item) {
  if (Jymin.isArray(array)) {
    array.push(item);
  }
  return item;
};

/**
 * Pop an item off an array.
 *
 * @param  {Array}  array  An array to pop an item from.
 * @return {Object}        The item that was popped.
 */
Jymin.pop = function (array) {
  if (Jymin.isArray(array)) {
    return array.pop();
  }
};

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @params {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
Jymin.merge = function (array) {
  Jymin.forEach(arguments, function (items, index) {
    if (index) {
      Jymin.forEach(items, function (item) {
        Jymin.push(array, item);
      });
    }
  });
  return array;
};

/**
 * Push padding values onto an array up to a specified length.
 *
 * @return number:
 * @param  {Array}  array        An array to pad.
 * @param  {Number} padToLength  A desired length for the array, after padding.
 * @param  {Object} paddingValue A value to use as padding.
 * @return {Number}              The number of padding values that were added.
 */
Jymin.padArray = function (array, padToLength, paddingValue) {
  var countAdded = 0;
  if (Jymin.isArray(array)) {
    var startingLength = Jymin.getLength(array);
    if (startingLength < length) {
      paddingValue = Jymin.isUndefined(paddingValue) ? '' : paddingValue;
      for (var index = startingLength; index < length; index++) {
        Jymin.push(array, paddingValue);
        countAdded++;
      }
    }
  }
  return countAdded;
};
