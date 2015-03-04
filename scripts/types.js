/**
 * Check whether a value is of a given primitive type.
 *
 * @param  {Any}     value  A value to check.
 * @param  {Any}     type   The primitive type.
 * @return {boolean}        True if the value is of the given type.
 */
Jymin.isType = function (value, type) {
  return typeof value == type;
};

/**
 * Check whether a value is undefined.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is undefined.
 */
Jymin.isUndefined = function (value) {
  return typeof value == 'undefined';
};

/**
 * Check whether a value is a boolean.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a boolean.
 */
Jymin.isBoolean = function (value) {
  return typeof value == 'boolean';
};

/**
 * Check whether a value is a number.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a number.
 */
Jymin.isNumber = function (value) {
  return typeof value == 'number';
};

/**
 * Check whether a value is a string.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a string.
 */
Jymin.isString = function (value) {
  return typeof value == 'string';
};

/**
 * Check whether a value is a function.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a function.
 */
Jymin.isFunction = function (value) {
  return typeof value == 'function';
};

/**
 * Check whether a value is an object.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an object.
 */
Jymin.isObject = function (value) {
  return typeof value == 'object';
};

/**
 * Check whether a value is null.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is null.
 */
Jymin.isNull = function (value) {
  return value === null;
};

/**
 * Check whether a value is an instance of a given type.
 *
 * @param  {Any}      value        A value to check.
 * @param  {Function} Constructor  A constructor for a type of object.
 * @return {boolean}               True if the value is an instance of a given type.
 */
Jymin.isInstance = function (value, Constructor) {
  return value instanceof Constructor;
};

/**
 * Check whether a value is an array.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an array.
 */
Jymin.isArray = function (value) {
  return Jymin.isInstance(value, Array);
};

/**
 * Check whether a value is a date.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a date.
 */
Jymin.isDate = function (value) {
  return Jymin.isInstance(value, Date);
};

/**
 * Check whether a value is an error.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an error.
 */
Jymin.isError = function (value) {
  return Jymin.isInstance(value, Error);
};

/**
 * Check whether a value is a regular expression.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a regular expression.
 */
Jymin.isRegExp = function (value) {
  return Jymin.isInstance(value, RegExp);
};
