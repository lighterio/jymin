/**
 * Get the current location host.
 */
Jymin.getHost = function () {
  return location.host;
};

/**
 * Get the base of the current URL.
 */
Jymin.getBaseUrl = function () {
  return location.protocol + '//' + Jymin.getHost();
};

/**
 * Get the query parameters from a URL.
 */
Jymin.getQueryParams = function (url) {
  url = url || location.href;
  var query = url.substr(url.indexOf('?') + 1).split('#')[0];
  var pairs = query.split('&');
  query = {};
  Jymin.forEach(pairs, function (pair) {
    var eqPos = pair.indexOf('=');
    var name = pair.substr(0, eqPos);
    var value = pair.substr(eqPos + 1);
    query[name] = value;
  });
  return query;
};

/**
 * Get the query parameters from the hash of a URL.
 */
Jymin.getHashParams = function (hash) {
  hash = (hash || location.hash).replace(/^#/, '');
  return hash ? Jymin.getQueryParams(hash) : {};
};
