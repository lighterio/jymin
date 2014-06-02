/**
 * If the argument is numeric, return a number, otherwise return zero.
 * @param Object n
 */
var ensureNumber = function (
  number,
  defaultNumber
) {
  defaultNumber = defaultNumber || 0;
  number *= 1;
  return isNaN(number) ? defaultNumber : number;
};
