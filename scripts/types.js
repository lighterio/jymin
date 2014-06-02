// Make an undefined value available.
var undefined = window.undefined;

/**
 * Return true if a variable is a given type.
 */
var isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
var isUndefined = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
var isBoolean = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
var isNumber = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
var isString = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
var isFunction = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
var isObject = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
var isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
var isArray = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Array);
};
