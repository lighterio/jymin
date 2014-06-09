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
  url,       // string:    The URL to request a response from.
  body,      // object|:   Data to post. The method is automagically "POST" if body is truey, otherwise "GET".
  onSuccess, // function|: Callback to run on success. `onSuccess(response, request)`.
  onFailure, // function|: Callback to run on failure. `onFailure(response, request)`.
  evalJson   // boolean|:  Whether to evaluate the response as JSON.
) {
  // If the optional body argument is omitted, shuffle it out.
  if (isFunction(body)) {
    evalJson = onFailure;
    onFailure = onSuccess;
    onSuccess = body;
    body = 0;
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
        --getResponse._WAITING;
        var status = request.status;
        var isSuccess = (status == 200);
        var callback = isSuccess ?
          onSuccess || globalResponseSuccessHandler :
          onFailure || globalResponseFailureHandler;
        var response = request.responseText;
        if (evalJson) {
          var object;
          if (status) {
            try {
              // Trick Uglify into thinking there's no eval.
              var e = window.eval;
              e('eval.J=' + response);
              object = e.J;
            }
            catch (e) {
              //+env:dev
              error('Could not parse JSON: "' + response + '"');
              //-env:dev
              object = {_ERROR: '_BAD_JSON', _TEXT: response};
            }
          }
          else {
            object = {_ERROR: '_OFFLINE'};
          }
          object._STATUS = status;
          object.request = request;
          response = object;
        }
        callback(response, request);
      }
    };
    request.open(body ? 'POST' : 'GET', url, true);
    request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    if (body) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    }
    getResponse._WAITING = (getResponse._WAITING || 0) + 1;

    // Record the original request URL.
    request.url = url;

    // TODO: Populate request.query with URL query params.

    // If it's a post, record the post body.
    if (body) {
      request.body = body;
    }

    //
    request._TIME = new Date();
    request.send(body || null);
  }
  return true;
};

/**
 * Request a JSON resource with a given URL.
 * @return boolean: True if AJAX is supported.
 */
var getJson = function (
  url,       // string:    The URL to request a response from.
  body,      // object|:   Data to post. The method is automagically "POST" if body is truey, otherwise "GET".
  onSuccess, // function|: Callback to run on success. `onSuccess(response, request)`.
  onFailure  // function|: Callback to run on failure. `onFailure(response, request)`.
) {
  return getResponse(url, body, onSuccess, onFailure, true);
};
