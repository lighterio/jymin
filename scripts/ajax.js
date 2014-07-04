/**
 * Empty handler.
 */
var doNothing = function () {};

// TODO: Enable multiple handlers using "bind" or perhaps middlewares.
var responseSuccessHandler = doNothing;
var responseFailureHandler = doNothing;

/**
 * Get an XMLHttpRequest object.
 */
var getXhr = function () {
  var Xhr = window.XMLHttpRequest;
  var ActiveX = window.ActiveXObject;
  return Xhr ? new Xhr() : (ActiveX ? new ActiveX('Microsoft.XMLHTTP') : false);
};

/**
 * Get an XHR upload object.
 */
var getUpload = function () {
  var xhr = getXhr();
  return xhr ? xhr.upload : false;
};

/**
 * Make an AJAX request, and handle it with success or failure.
 * @return boolean: True if AJAX is supported.
 */
var getResponse = function (
  url,       // string:    The URL to request a response from.
  body,      // object|:   Data to post. The method is automagically "POST" if body is truey, otherwise "GET".
  onSuccess, // function|: Callback to run on success. `onSuccess(response, request)`.
  onFailure  // function|: Callback to run on failure. `onFailure(response, request)`.
) {
  // If the optional body argument is omitted, shuffle it out.
  if (isFunction(body)) {
    onFailure = onSuccess;
    onSuccess = body;
    body = 0;
  }
  var request = getXhr();
  if (request) {
    onFailure = onFailure || responseFailureHandler;
    onSuccess = onSuccess || responseSuccessHandler;
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        //+env:debug
        log('[Jymin] Received response from "' + url + '". (' + getResponse._WAITING + ' in progress).');
        //-env:debug
        --getResponse._WAITING;
        var status = request.status;
        var isSuccess = (status == 200);
        var callback = isSuccess ?
          onSuccess || responseSuccessHandler :
          onFailure || responseFailureHandler;
        var data = parse(request.responseText);
        data._STATUS = status;
        data._REQUEST = request;
        callback(data);
      }
    };
    request.open(body ? 'POST' : 'GET', url, true);
    request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    if (body) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    }

    // Record the original request URL.
    request._URL = url;

    // If it's a post, record the post body.
    if (body) {
      request._BODY = body;
    }

    // Record the time the request was made.
    request._TIME = getTime();

    // Allow applications to back off when too many requests are in progress.
    getResponse._WAITING = (getResponse._WAITING || 0) + 1;

    //+env:debug
    log('[Jymin] Sending request to "' + url + '". (' + getResponse._WAITING + ' in progress).');
    //-env:debug
    request.send(body || null);

  }
  return true;
};
