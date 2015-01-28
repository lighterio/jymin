/**
 * Return true if a variable is a given type.
 */
Jymin.isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
Jymin.isUndefined = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
Jymin.isBoolean = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
Jymin.isNumber = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
Jymin.isString = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
Jymin.isFunction = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
Jymin.isObject = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
Jymin.isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
Jymin.isArray = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isInstance(value, Array);
};

/**
 * Return true if a variable is a date.
 */
Jymin.isDate = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isInstance(value, Date);
};
