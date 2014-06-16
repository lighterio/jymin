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
var getUtcTimestamp = function (
  date // Date: Date object. (Default: now)
) {
  var utcMonths = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  };
  date = date || new Date();
  var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
  return date.toUTCString().replace(utcPattern, function (a, d, m, y, t) {
    return y + '-' + utcMonths[m] + '-' + d + ' ' + t;
  });
};
