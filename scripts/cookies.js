/**
 * Return all cookies.
 * @return object: Cookie names and values.
 */
var getAllCookies = function () {
  var obj = {};
  var documentCookie = trim(document.cookie);
  if (documentCookie) {
    var cookies = documentCookie.split(/\s*;\s*/);
    forEach(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/);
      obj[unescape(pair[0])] = unescape(pair[1]);
    });
  }
  return obj;
};

/**
 * Get a cookie by name.
 * @return string: Cookie value.
 */
var getCookie = function (
  name // string: Name of the cookie.
) {
  return getAllCookies()[name];
};

/**
 * Set a cookie.
 */
var setCookie = function (
  name,   // string:  Name of the cookie.
  value,  // string:  Value to set.
  options // object|: Name/value pairs for options including "maxage", "expires", "path", "domain" and "secure".
) {
  options = options || {};
  var str = escape(name) + '=' + unescape(value);
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
 * Delete a cookie.
 */
var deleteCookie = function deleteCookie(
  name   // string: Name of the cookie.
) {
  setCookie(name, null);
};
