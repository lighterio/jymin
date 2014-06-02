/**
 * Empty handler.
 */
var doNothing = function () {};
var globalResponseSuccessHandler = doNothing;
var globalResponseFailureHandler = doNothing;

/**
 * Make an AJAX request, and handle it with success or failure.
 * @return boolean: True if AJAX is supported.
 */
var getResponse = function (
  url,       // string:    The URL to request data from.
  data,      // object|:   Data to post. The method is automagically "POST" if data is truey, otherwise "GET".
  onSuccess, // function|: Callback to run on success. `onSuccess(response, request)`.
  onFailure, // function|: Callback to run on failure. `onFailure(response, request)`.
  evalJson   // boolean|:  Whether to evaluate the response as JSON.
) {
  // If the optional data argument is omitted, shuffle it out.
  if (isFunction(data)) {
    evalJson = onFailure;
    onFailure = onSuccess;
    onSuccess = data;
    data = 0;
  }
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    request = new ActiveXObject('Microsoft.XMLHTTP');
  } else {
    return false;
  }
  if (request) {
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        var isSuccess = (request.status == 200);
        var callback = isSuccess ?
          onSuccess || globalResponseSuccessHandler :
          onFailure || globalResponseFailureHandler;
        var response = request.responseText;
        if (isSuccess && evalJson) {
          try {
            // Trick Uglify into thinking there's no eval.
            var e = window.eval;
            e('eval.J=' + response);
            response = e.J;
          }
          catch (e) {
            log('ERROR: Could not parse JSON: "' + response + '"');
          }
        }
        callback(response, request);
      }
    };
    request.open(data ? 'POST' : 'GET', url, true);
    request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    if (data) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    }
    request.send(data || null);
  }
  return true;
};

/**
 * Request a JSON resource with a given URL.
 * @return boolean: True if AJAX is supported.
 */
var getJson = function (
  url,       // string:    The URL to request data from.
  onSuccess, // function|: Callback to run on success. `onSuccess(response, request)`.
  onFailure  // function|: Callback to run on failure. `onFailure(response, request)`.
) {
  return getResponse(url, onSuccess, onFailure, true);
};
