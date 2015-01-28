/**
 * Get all cookies from the document, and return a map.
 *
 * @return {Object}  The map of cookie names and values.
 */
Jymin.getAllCookies = function () {
  var obj = {};
  var documentCookie = Jymin.trim(document.cookie);
  if (documentCookie) {
    var cookies = documentCookie.split(/\s*;\s*/);
    Jymin.forEach(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/);
      obj[Jymin.unescape(pair[0])] = Jymin.unescape(pair[1]);
    });
  }
  return obj;
};

/**
 * Get a cookie by its name.
 *
 * @param  {String} name  A cookie name.
 * @return {String}       The cookie value.
 */
Jymin.getCookie = function (name) {
  return Jymin.getAllCookies()[name];
};

/**
 * Set or overwrite a cookie value.
 *
 * @param {String} name     A cookie name, whose value is to be set.
 * @param {Object} value    A value to be set as a string.
 * @param {Object} options  Optional cookie options, including "maxage", "expires", "path", "domain" and "secure".
 */
Jymin.setCookie = function (name, value, options) {
  options = options || {};
  var str = Jymin.escape(name) + '=' + Jymin.unescape(value);
  if (null === value) {
    options.maxage = -1;
  }
  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage);
  }
  document.cookie = str +
    (options.path ? ';path=' + options.path : '') +
    (options.domain ? ';domain=' + options.domain : '') +
    (options.expires ? ';expires=' + options.expires.toUTCString() : '') +
    (options.secure ? ';secure' : '');
};

/**
 * Delete a cookie by name.
 *
 * @param {String} name  A cookie name, whose value is to be deleted.
 */
Jymin.deleteCookie = function (name) {
  Jymin.setCookie(name, null);
};
