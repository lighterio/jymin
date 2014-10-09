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
/*
 * Takes a js date object and returns something in the format of
 * "August 26,2014 at 7:42pm"
 */
var formatLongDate = function (date) {
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  isDate(date) ? 0 : (date = new Date(+date || date));
  var m = MONTHS[date.getMonth()];
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + " " + date.getDate() + ", " + date.getFullYear() + " at " + h +
    ":" + minutes + (isAm ? "AM" : "PM");
}
/*
 * Takes a js date object and returns something in the format of
 * "8/26/14 7:42pm"
 */
var formatShortDate = function (date) {
  isDate(date) ? 0 : (date = new Date(+date || date));
  var m = date.getMonth() + 1;
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + "/" + date.getDate() + "/" + date.getFullYear() % 100 + " " + h +
    ":" + minutes + (isAm ? "AM" : "PM");
}
