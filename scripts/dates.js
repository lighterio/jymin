/**
 * Get Unix epoch milliseconds from a date.
 * @return integer: Epoch milliseconds.
 */
var getTime = function (
  date // Date: Date object. (Default: now)
) {
  date = date || new Date();
  return date.getTime();
};

/**
 * Get Unix epoch milliseconds from a date.
 * @return integer: Epoch milliseconds.
 */
var getIsoDate = function (
  date // Date: Date object. (Default: now)
) {
  if (!date) {
    date = new Date();
  }
  if (date.toISOString) {
    date = date.toISOString();
  }
  else {
    // Build an ISO date string manually in really old browsers.
    var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
    date = date.toUTCString().replace(utcPattern, function (a, d, m, y, t) {
      m = zeroFill(date.getMonth(), 2);
      t += '.' + zeroFill(date.getMilliseconds(), 3);
      return y + '-' + m + '-' + d + 'T' + t + 'Z';
    });
  }
  return date;
};
