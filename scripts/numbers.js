/**
 * If the argument is numeric, return a number, otherwise return zero.
 *
 * @param  {Object} number  An object to convert to a number, if necessary.
 * @return {number}         The number, or zero.
 */
Jymin.ensureNumber = function (number) {
  return isNaN(number *= 1) ? 0 : number;
};

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 *
 * @param  {number} number  A number to pad.
 * @param  {number} length  A length to pad to.
 * @return {String}         The zero-padded number.
 */
Jymin.zeroFill = function (number, length) {
  number = '' + number;
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - Jymin.getLength(number), 0);
  return (new Array(length + 1)).join('0') + number;
};
