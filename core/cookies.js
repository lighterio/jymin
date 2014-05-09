/**
 * Return all cookies.
 * @return object: Cookie names and values.
 */
function getAllCookies() {
	var str = document.cookie;
	var decode = decodeURIComponent;
	var obj = {};
	var pairs = str.split(/ *; */);
	var pair;
	if ('' == pairs[0]) return obj;
	for (var i = 0; i < pairs.length; ++i) {
		pair = pairs[i].split('=');
		obj[decode(pair[0])] = decode(pair[1]);
	}
	return obj;
}


/**
 * Get a cookie by name.
 * @return string: Cookie value.
 */
function getCookie(
	name // string*: Name of the cookie.
) {
	return getAllCookies()[name];
}


/**
 * Set a cookie.
 */
function setCookie(
	name,   // string*: Name of the cookie.
	value,  // string*: Value to set.
	options // object:  Name/value pairs for options including "maxage", "expires", "path", "domain" and "secure".
) {
	options = options || {};
	var encode = encodeURIComponent;
	var str = encode(name) + '=' + encode(value);
	if (null == value) {
		options.maxage = -1;
	}
	if (options.maxage) {
		options.expires = new Date(+new Date + options.maxage);
	}
	if (options.path) str += ';path=' + options.path;
	if (options.domain) str += ';domain=' + options.domain;
	if (options.expires) str += ';expires=' + options.expires.toUTCString();
	if (options.secure) str += ';secure';
	document.cookie = str;
}

/**
 * Delete a cookie.
 */
var deleteCookie = function deleteCookie(
	name   // string*: Name of the cookie.
) {
	setCookie(name, null);
}

