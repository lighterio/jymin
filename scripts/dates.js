/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
Jymin.getTime = function (date) {
  return (date || new Date()).getTime();
};

/**
 * Get an ISO-standard date string (even in super duper old browsers).
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
Jymin.getIsoDate = function (date) {
  date = date || new Date();
  if (date.toISOString) {
    date = date.toISOString();
  }
  else {
    // Build an ISO date string manually in really old browsers.
    var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
    date = date.toUTCString().replace(utcPattern, function (a, d, m, y, t) {
      m = Jymin.zeroFill(date.getMonth(), 2);
      t += '.' + Jymin.zeroFill(date.getMilliseconds(), 3);
      return y + '-' + m + '-' + d + 'T' + t + 'Z';
    });
  }
  return date;
};

/**
 * Take a date and return something like: "August 26, 2014 at 7:42pm".
 *
 * @param  {Object}   date  Date object or constructor argument.
 * @return {String}         Long formatted date string.
 */
Jymin.formatLongDate = function (date) {
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  Jymin.isDate(date) ? 0 : (date = new Date(+date || date));
  var m = MONTHS[date.getMonth()];
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + " " + date.getDate() + ", " + date.getFullYear() + " at " + h +
    ":" + minutes + (isAm ? "am" : "pm");
}

/**
 * Take a date, and return something like: "8/26/14 7:42pm".
 *
 * @param  {Object}   date  Date object or constructor argument.
 * @return {String}         Short formatted date string.
 */
Jymin.formatShortDate = function (date) {
  Jymin.isDate(date) ? 0 : (date = new Date(+date || date));
  var m = date.getMonth() + 1;
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + "/" + date.getDate() + "/" + date.getFullYear() % 100 + " " + h +
    ":" + minutes + (isAm ? "am" : "pm");
}
