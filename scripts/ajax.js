/**
 * Empty handler.
 * @type {function}
 */
Jymin.doNothing = function () {};

/**
 * Default AJAX success handler function.
 * @type {function}
 */
Jymin.responseSuccessFn = Jymin.doNothing;

/**
 * Default AJAX failure handler function.
 * @type {function}
 */
Jymin.responseFailureFn = Jymin.doNothing;

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
Jymin.getXhr = function () {
  var Xhr = window.XMLHttpRequest;
  var ActiveX = window.ActiveXObject;
  return Xhr ? new Xhr() : (ActiveX ? new ActiveX('Microsoft.XMLHTTP') : false);
};

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}   The request upload object.
 */
Jymin.getUpload = function () {
  var xhr = Jymin.getXhr();
  return xhr ? xhr.upload : false;
};

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {string}   url        A URL from which to request a response.
 * @param  {string}   body       An optional query, which if provided, makes the request a POST.
 * @param  {function} onSuccess  An optional function to run upon success.
 * @param  {function} onFailure  An optional function to run upon failure.
 * @return {boolean}             True if AJAX is supported.
 */
Jymin.getResponse = function (url, body, onSuccess, onFailure) {
  // If the optional body argument is omitted, shuffle it out.
  if (Jymin.isFunction(body)) {
    onFailure = onSuccess;
    onSuccess = body;
    body = 0;
  }
  var request = Jymin.getXhr();
  if (request) {
    onFailure = onFailure || Jymin.responseFailureFn;
    onSuccess = onSuccess || Jymin.responseSuccessFn;
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        //+env:debug
        Jymin.log('[Jymin] Received response from "' + url + '". (' + Jymin.getResponse._waiting + ' in progress).');
        //-env:debug
        --Jymin.getResponse._waiting;
        var status = request.status;
        var isSuccess = (status == 200);
        var fn = isSuccess ?
          onSuccess || Jymin.responseSuccessFn :
          onFailure || Jymin.responseFailureFn;
        var data = Jymin.parse(request.responseText) || {};
        data._status = status;
        data._request = request;
        fn(data);
      }
    };
    request.open(body ? 'POST' : 'GET', url, true);
    request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    if (body) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    }

    // Record the original request URL.
    request._url = url;

    // If it's a post, record the post body.
    if (body) {
      request._body = body;
    }

    // Record the time the request was made.
    request._time = Jymin.getTime();

    // Allow applications to back off when too many requests are in progress.
    Jymin.getResponse._waiting = (Jymin.getResponse._waiting || 0) + 1;

    //+env:debug
    Jymin.log('[Jymin] Sending request to "' + url + '". (' + Jymin.getResponse._waiting + ' in progress).');
    //-env:debug
    request.send(body || null);

  }
  return true;
};
