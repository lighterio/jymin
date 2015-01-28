/**
 * If the argument is numeric, return a number, otherwise return zero.
 * @param Object n
 */
Jymin.ensureNumber = function (
  number,
  defaultNumber
) {
  defaultNumber = defaultNumber || 0;
  number *= 1;
  return isNaN(number) ? defaultNumber : number;
};

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 */
Jymin.zeroFill = function (
  number,
  length
) {
  number = Jymin.ensureString(number);
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0);
  return (new Array(length + 1)).join('0') + number;
};
