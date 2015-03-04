/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param {Date}    date  An optional Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
Jymin.getTime = function (date) {
  return date ? date.getTime() : Date.now();
};

/**
 * Get an ISO-standard date string.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
Jymin.getIsoDate = function (date) {
  date = date || new Date();
  //+browser:ok
  date = date.toISOString();
  //-browser:ok
  //+browser:old
  var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
  date = date.toUTCString().replace(utcPattern, function (a, day, m, y, t) {
    m = Jymin.zeroFill(date.getMonth(), 2);
    t += '.' + Jymin.zeroFill(date.getMilliseconds(), 3);
    return y + '-' + m + '-' + day + 'T' + t + 'Z';
  });
  //-browser:old
  return date;
};

/**
 * Take a date and return a formatted date string in long or short format:
 * - Short: "8/26/14 7:42pm"
 * - Long: "August 26, 2014 at 7:42pm"
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @param  {Boolean} isLong  Whether to output the short or long format.
 * @param  {Boolean} isTime  Whether to append the time.
 * @return {String}          The formatted date string.
 */
Jymin.formatDate = function (date, isLong, isTime) {
  if (!Jymin.isDate(date)) {
    date = new Date(+date || date);
  }
  var m = date.getMonth();
  var day = date.getDate();
  var y = date.getFullYear();
  if (isLong) {
    m = Jymin.i18nMonths[m];
  }
  else {
    m++;
    y = ('' + y).substr(2);
  }
  var isAm = 1;
  var hour = +date.getHours();
  var minute = date.getMinutes();
  minute = minute > 9 ? minute : '0' + minute;
  if (!Jymin.i18n24Hour) {
    if (hour > 12) {
      isAm = 0;
      hour -= 12;
    }
    else if (!hour) {
      hour = 12;
    }
  }
  var string;
  if (Jymin.i18nDayMonthYear) {
    string = m;
    m = day;
    day = string;
  }
  if (isLong) {
    string = m + ' ' + day + ', ' + y;
  }
  else {
    string = m + '/' + day + '/' + y;
  }
  if (isTime) {
    if (isLong) {
      string += ' ' + Jymin.i18nAt;
    }
    string += ' ' + hour + ':' + minute;
    if (Jymin.i18n24Hour) {
      string += (isAm ? 'am' : 'pm');
    }
  }
  return string;
};

/**
 * Taka a date object and return a formatted time string.
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @return {[type]}
 */
Jymin.formatTime = function (date) {
  date = Jymin.formatDate(date).replace(/^.* /, '');
};
