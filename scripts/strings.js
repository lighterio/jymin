/**
 * Ensure a value is a string.
 */
var ensureString = function (
  value
) {
  return isString(value) ? value : '' + value;
};

/**
 * Return true if the string contains the given substring.
 */
var containsString = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) > -1;
};

/**
 * Return true if the string starts with the given substring.
 */
var startsWith = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) == 0;
};

/**
 * Trim the whitespace from a string.
 */
var trimString = function (
  string
) {
  return ensureString(string).replace(/^\s+|\s+$/g, '');
};

/**
 * Split a string by commas.
 */
var splitByCommas = function (
  string
) {
  return ensureString(string).split(',');
};

/**
 * Split a string by spaces.
 */
var splitBySpaces = function (
  string
) {
  return ensureString(string).split(' ');
};

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
var decorateString = function (
  string,
  replacements
) {
  string = ensureString(string);
  forEach(replacements, function(replacement) {
    string = string.replace('*', replacement);
  });
  return string;
};

/**
 * Perform a RegExp match, and call a callback on the result;
  */
var match = function (
  string,
  pattern,
  callback
) {
  var result = string.match(pattern);
  if (result) {
    callback.apply(string, result);
  }
};

/**
 * Reduce a string to its alphabetic characters.
 */
var extractLetters = function (
  string
) {
  return ensureString(string).replace(/[^a-z]/ig, '');
};

/**
 * Reduce a string to its numeric characters.
 */
var extractNumbers = function (
  string
) {
  return ensureString(string).replace(/[^0-9]/g, '');
};

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
var buildQueryString = function (
  object
) {
  var queryParams = [];
  forIn(object, function(value, key) {
    queryParams.push(escape(key) + '=' + escape(value));
  });
  return queryParams.join('&');
};

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
var getBrowserVersionOrZero = function (
  browserName
) {
  var match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent);
  return match ? +match[1] : 0;
};
