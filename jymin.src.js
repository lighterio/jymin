/**      _                 _                ___  _  _    _
 *      | |_   _ _ __ ___ (_)_ __   __   __/ _ \| || |  / |
 *   _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | | || |_ | |
 *  | |_| | |_| | | | | | | | | | |  \ V /| |_| |__   _|| |
 *   \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_) |_|(_)_|
 *         |___/
 *
 * http://lighter.io/jymin
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/lighterio/jymin/blob/master/scripts/ajax.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/arrays.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/cookies.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dates.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dom.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/emitter.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/events.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/forms.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/history.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/json.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/logging.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/numbers.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/objects.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/storage.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/strings.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/types.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/url.js
 */


var Jymin = window.Jymin = {version: '0.4.1'};

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
/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (value, index, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @param  {Function}             fn     A function to call on each item.
 * @return {Number}                      The number of items iterated over without breaking.
 */
Jymin.forEach = function (array, fn) {
  if (array) {
    for (var index = 0, length = Jymin.getLength(array); index < length; index++) {
      var result = fn(array[index], index, array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (index, value, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}     array  A collection, expected to have indexed items and a length.
 * @param  {Function}  fn                   A function to call on each item.
 * @return {Number}                         The number of items iterated over without breaking.
 */
Jymin.each = function (array, fn) {
  if (array) {
    for (var index = 0, length = Jymin.getLength(array); index < length; index++) {
      var result = fn(index, array[index], array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Get the length of an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have a length.
 * @return {Number}                     The length of the collection.
 */
Jymin.getLength = function (array) {
  return (array || 0).length || 0;
};

/**
 * Get the first item in an Array/Object/string/etc.
 * @param {Array|Object|string}  array  A collection, expected to have index items.
 * @return {Object}                     The first item in the collection.
 */
Jymin.getFirst = function (array) {
  return (array || 0)[0];
};

/**
 * Get the last item in an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @return {Object}                     The last item in the collection.
 */
Jymin.getLast = function (array) {
  return (array || 0)[Jymin.getLength(array) - 1];
};

/**
 * Check for the existence of more than one collection items.
 *
 * @param {Array|Object|string}   array  A collection, expected to have a length.
 * @return {boolean}                     True if the collection has more than one item.
 */
Jymin.hasMany = function (array) {
  return Jymin.getLength(array) > 1;
};

/**
 * Push an item into an array.
 *
 * @param  {Array}  array  An array to push an item into.
 * @param  {Object} item   An item to push.
 * @return {Object}        The item that was pushed.
 */
Jymin.push = function (array, item) {
  if (Jymin.isArray(array)) {
    array.push(item);
  }
  return item;
};

/**
 * Pop an item off an array.
 *
 * @param  {Array}  array  An array to pop an item from.
 * @return {Object}        The item that was popped.
 */
Jymin.pop = function (array) {
  if (Jymin.isArray(array)) {
    return array.pop();
  }
};

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @params {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
Jymin.merge = function (array) {
  Jymin.forEach(arguments, function (items, index) {
    if (index) {
      Jymin.forEach(items, function (item) {
        Jymin.push(array, item);
      });
    }
  });
  return array;
};

/**
 * Push padding values onto an array up to a specified length.
 *
 * @return number:
 * @param  {Array}  array        An array to pad.
 * @param  {Number} padToLength  A desired length for the array, after padding.
 * @param  {Object} paddingValue A value to use as padding.
 * @return {Number}              The number of padding values that were added.
 */
Jymin.padArray = function (array, padToLength, paddingValue) {
  var countAdded = 0;
  if (Jymin.isArray(array)) {
    var startingLength = Jymin.getLength(array);
    if (startingLength < length) {
      paddingValue = Jymin.isUndefined(paddingValue) ? '' : paddingValue;
      for (var index = startingLength; index < length; index++) {
        Jymin.push(array, paddingValue);
        countAdded++;
      }
    }
  }
  return countAdded;
};
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
/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {HTMLElement}        parentElement  Optional element to call getElementById on (default: document).
 * @param  {string|HTMLElement} idOrElement    ID of an element, or the element itself.
 * @return {HTMLElement}                       The matching element, or undefined.
 */
Jymin.getElement = function (parentElement, idOrElement) {
  if (!Jymin.hasMany(arguments)) {
    idOrElement = parentElement;
    parentElement = document;
  }
  return Jymin.isString(idOrElement) ? parentElement.getElementById(idOrElement) : idOrElement;
};

/**
 * Get elements that have a specified tag name.
 *
 * @param  {HTMLElement}    parentElement  Optional element to call getElementsByTagName on (default: document).
 * @param  {String}         tagName        Optional name of tag to search for (default: *).
 * @return {HTMLCollection}                Collection of matching elements.
 */
Jymin.getElementsByTagName = function (parentElement, tagName) {
  if (!Jymin.hasMany(arguments)) {
    tagName = parentElement;
    parentElement = document;
  }
  return parentElement.getElementsByTagName(tagName || '*');
};

/**
 * Get elements that have a specified tag and class.
 *
 * @param  {HTMLElement}    parentElement  Optional element to call getElementsByTagName on (default: document).
 * @param  {String}         tagAndClass    Optional tag and class to search for, separated by a period (default: *).
 * @return {HTMLCollection}                Collection of matching elements.
 */
Jymin.getElementsByTagAndClass = function (parentElement, tagAndClass) {
  if (!Jymin.hasMany(arguments)) {
    tagAndClass = parentElement;
    parentElement = document;
  }
  tagAndClass = tagAndClass.split('.');
  var tagName = (tagAndClass[0] || '*').toUpperCase();
  var className = tagAndClass[1];
  var anyTag = (tagName == '*');
  var elements;
  if (className) {
    elements = [];
    if (parentElement.getElementsByClassName) {
      Jymin.forEach(parentElement.getElementsByClassName(className), function(element) {
        if (anyTag || (element.tagName == tagName)) {
          elements.push(element);
        }
      });
    }
    else {
      Jymin.forEach(Jymin.getElementsByTagName(parentElement, tagName), function(element) {
        if (Jymin.hasClass(element, className)) {
          elements.push(element);
        }
      });
    }
  }
  else {
    elements = Jymin.getElementsByTagName(parentElement, tagName);
  }
  return elements;
};

/**
 * Get the parent of an element, or an ancestor with a specified tag name.
 *
 * @param  {HTMLElement} element  A element whose parent elements are being searched.
 * @param  {string}      tagName  An optional ancestor tag to search up the tree.
 * @return {HTMLElement}          The parent or matching ancestor.
 */
Jymin.getParent = function (element, tagName) {
  element = element.parentNode;
  // If a tag name is specified, keep walking up.
  if (tagName && element && element.tagName != tagName) {
    element = Jymin.getParent(element, tagName);
  }
  return element;
};

/**
 * Get the children of a parent element.
 *
 * @param  {HTMLElement}    element  A parent element who might have children.
 * @return {HTMLCollection}          The collection of children.
 */
Jymin.getChildren = function (element) {
  return element.childNodes;
};

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {HTMLElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
Jymin.getIndex = function (element) {
  var index = -1;
  while (element) {
    ++index;
    element = element.previousSibling;
  }
  return index;
};

/**
 * Get an element's first child.
 *
 * @param  {HTMLElement} element  An element.
 * @return {[type]}               The element's first child.
 */
Jymin.getFirstChild = function (element) {
  return element.firstChild;
};

/**
 * Get an element's previous sibling.
 *
 * @param  {HTMLElement} element  An element.
 * @return {HTMLElement}          The element's previous sibling.
 */
Jymin.getPreviousSibling = function (element) {
  return element.previousSibling;
};

/**
 * Get an element's next sibling.
 *
 * @param  {HTMLElement} element  An element.
 * @return {HTMLElement}          The element's next sibling.
 */
Jymin.getNextSibling = function (element) {
  return element.nextSibling;
};

/**
 * Create a cloneable element with a specified tag name.
 *
 * @param  {String}      tagName  An optional tag name (default: div).
 * @return {HTMLElement}          The newly-created DOM Element with the specified tag name.
 */
Jymin.createTag = function (tagName) {
  tagName = tagName || 'div';
  var isSvg = /^(svg|g|path|circle|line)$/.test(tagName);
  var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml');
  return document.createElementNS(uri, tagName);
};

/**
 * Create an element, given a specified tag identifier.
 *
 * Identifiers are of the form:
 *   tagName#id.class1.class2?attr1=value1&attr2=value2
 *
 * Each part of the identifier is optional.
 *
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The existing or created element.
 */
Jymin.createElement = function (elementOrString, innerHtml) {
  var element = elementOrString;
  if (Jymin.isString(elementOrString)) {
    elementOrString = elementOrString || '';
    var tagAndAttributes = elementOrString.split('?');
    var tagAndClass = tagAndAttributes[0].split('.');
    var className = tagAndClass.slice(1).join(' ');
    var tagAndId = tagAndClass[0].split('#');
    var tagName = tagAndId[0];
    var id = tagAndId[1];
    var attributes = tagAndAttributes[1];
    var cachedElement = Jymin.createTag[tagName] || (Jymin.createTag[tagName] = Jymin.createTag(tagName));
    var element = cachedElement.cloneNode(true);
    if (id) {
      element.id = id;
    }
    if (className) {
      element.className = className;
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&');
      Jymin.forEach(attributes, function (attribute) {
        var keyAndValue = attribute.split('=');
        var key = Jymin.unescape(keyAndValue[0]);
        var value = Jymin.unescape(keyAndValue[1]);
        element[key] = value;
        element.setAttribute(key, value);
      });
    }
    if (innerHtml) {
      setHtml(element, innerHtml);
    }
  }
  return element;
};

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @return {HTMLElement}                         The element that was added.
 */
Jymin.addElement = function (parentElement, elementOrString) {
  if (Jymin.isString(parentElement)) {
    elementOrString = parentElement;
    parentElement = document;
  }
  var element = Jymin.createElement(elementOrString);
  parentElement.appendChild(element);
  return element;
};

/**
 * Insert a child element under a parent element, optionally before another element.
 *
 * @param  {HTMLElement}         parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {HTMLElement}         beforeSibling    An optional child to insert the element before.
 * @return {HTMLElement}                          The element that was inserted.
 */
Jymin.insertElement = function (parentElement, elementOrString, beforeSibling) {
  if (Jymin.isString(parentElement)) {
    beforeSibling = elementOrString;
    elementOrString = parentElement;
    parentElement = document;
  }
  var element = Jymin.createElement(childElement);
  if (parentElement) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (Jymin.isNumber(beforeSibling)) {
      beforeSibling = Jymin.getChildren(parentElement)[beforeSibling];
    }
    // Insert the element, optionally before an existing sibling.
    parentElement.insertBefore(element, beforeSibling || Jymin.getFirstChild(parentElement) || null);
  }
  return element;
};

/**
 * Wrap an element with another element.
 *
 * @param  {HTMLElement}        innerElement  An element to wrap with another element.
 * @param  {HTMLElement|String} outerElement  An element or a string used to create an element (default: div).
 * @return {HTMLElement}                      The element that was created as a wrapper.
 */
Jymin.wrapElement = function (innerElement, outerElement) {
  var parentElement = Jymin.getParent(innerElement);
  outerElement = Jymin.insertElement(parentElement, outerElement, innerElement);
  Jymin.insertElement(outerElement, innerElement);
  return outerElement;
};

/**
 * Remove an element from its parent.
 *
 * @param  {HTMLElement} element  An element to remove.
 */
Jymin.removeElement = function (element) {
  if (element) {
    // Remove the element from its parent, provided that it has a parent.
    var parentElement = Jymin.getParent(element);
    if (parentElement) {
      parentElement.removeChild(element);
    }
  }
};

/**
 * Remove children from an element.
 *
 * @param  {HTMLElement} element  An element whose children should all be removed.
 */
Jymin.clearElement = function (element) {
  Jymin.setHtml(element, '');
};

/**
 * Get an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's HTML.
 */
Jymin.getHtml = function (element) {
  return element.innerHTML;
};

/**
 * Set an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      html     A string of HTML to set as the innerHTML.
 */
Jymin.setHtml = function (element, html) {
  element.innerHTML = html;
};

/**
 * Get an element's text.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's text content.
 */
Jymin.getText = function (element) {
  return element.textContent || element.innerText;
};

/**
 * Get an attribute from an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute's name.
 * @return {String}                     The value of the attribute.
 */
Jymin.getAttribute = function (element, attributeName) {
  return element.getAttribute(attributeName);
};

/**
 * Set an attribute on an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute name.
 * @param  {String}      value          A value to set the attribute to.
 */
Jymin.setAttribute = function (element, attributeName, value) {
  element.setAttribute(attributeName, value);
};

/**
 * Get a data attribute from an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute's key.
 * @return {String}               The value of the data attribute.
 */
Jymin.getData = function (element, dataKey) {
  return Jymin.getAttribute(element, 'data-' + dataKey);
};

/**
 * Set a data attribute on an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute key.
 * @param  {String}      value    A value to set the data attribute to.
 */
Jymin.setData = function (element, dataKey, value) {
  Jymin.setAttribute(element, 'data-' + dataKey, value);
};

/**
 * Get an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's class name.
 */
Jymin.getClass = function (element) {
  var className = element.className || '';
  return className.baseVal || className;
};

/**
 * Get an element's class name as an array of classes.
 *
 * @param  {HTMLElement} element  An element.
 * @return {Array}                The element's class name classes.
 */
Jymin.getClasses = function (element) {
  return Jymin.getClass(element).split(/\s+/);
};

/**
 * Set an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               One or more space-delimited classes to set.
 */
Jymin.setClass = function (element, className) {
  element.className = className;
};

/**
 * Find out whether an element has a specified class.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to search for.
 * @return {boolean}                True if the class was found.
 */
Jymin.hasClass = function (element, className) {
  var classes = Jymin.getClasses(element);
  return classes.indexOf(className) > -1;
};

/**
 * Add a class to a given element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}               A class to add if it's not already there.
 */
Jymin.addClass = function (element, className) {
  if (!Jymin.hasClass(element, className)) {
    element.className += ' ' + className;
  }
};

/**
 * Remove a class from a given element, assuming no duplication.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               A class to remove.
 */
Jymin.removeClass = function (element, className) {
  var classes = Jymin.getClasses(element);
  var index = classes.indexOf(className);
  if (index > -1) {
    classes.splice(index, 1);
  }
  classes.join(' ');
  Jymin.setClass(element, classes);
};

/**
 * Turn a class on or off on a given element.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to add or remove.
 * @param  {boolean}     flipOn     Whether to add, rather than removing.
 */
Jymin.flipClass = function (element, className, flipOn) {
  var method = flipOn ? Jymin.addClass : Jymin.removeClass;
  method(element, className);
};

/**
 * Turn a class on if it's off, or off if it's on.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to toggle.
 * @return {boolean}                True if the class was turned on.
 */
Jymin.toggleClass = function (element, className) {
  var flipOn = !Jymin.hasClass(element, className);
  Jymin.flipClass(element, className, flipOn);
  return flipOn;
};

/**
 * Insert an external JavaScript file.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {HTMLElement} element  An element.
 * @param  {String}      src      A source URL of a script to insert.
 * @param  {function}    fn       An optional function to run when the script loads.
 */
Jymin.insertScript = function (src, fn) {
  var head = Jymin.getElementsByTagName('head')[0];
  var script = Jymin.addElement(head, 'script');
  if (fn) {
    script.onload = fn;
    script.onreadystatechange = function() {
      if (Jymin.isLoaded(script)) {
        fn();
      }
    };
  }
  script.src = src;
};

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find elements.
 * @param  {String}      selector       A simple selector for finding elements.
 * @return {function}    fn             An optional function to run on matching elements.
 */
Jymin.all = function (parentElement, selector, fn) {
  if (!selector || Jymin.isFunction(selector)) {
    fn = selector;
    selector = parentElement;
    parentElement = document;
  }
  var elements;
  if (Jymin.contains(selector, ',')) {
    elements = [];
    var selectors = Jymin.splitByCommas(selector);
    Jymin.forEach(selectors, function (piece) {
      var more = Jymin.all(parentElement, piece);
      if (Jymin.getLength(more)) {
        Jymin.merge(elements, more);
      }
    });
  }
  else if (Jymin.contains(selector, ' ')) {
    var pos = selector.indexOf(' ');
    var preSelector = selector.substr(0, pos);
    var postSelector = selector.substr(pos + 1);
    elements = [];
    Jymin.all(parentElement, preSelector, function (element) {
      var children = Jymin.all(element, postSelector);
      Jymin.merge(elements, children);
    });
  }
  else if (selector[0] == '#') {
    var id = selector.substr(1);
    var child = Jymin.getElement(parentElement.ownerDocument || document, id);
    if (child) {
      var parent = Jymin.getParent(child);
      while (parent) {
        if (parent === parentElement) {
          elements = [child];
          break;
        }
        parent = Jymin.getParent(parent);
      }
    }
  }
  else {
    elements = Jymin.getElementsByTagAndClass(parentElement, selector);
  }
  if (fn) {
    Jymin.forEach(elements, fn);
  }
  return elements || [];
};

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @return {function}    fn             An optional function to run on a matching element.
 */
Jymin.one = function (parentElement, selector, fn) {
  return Jymin.all(parentElement, selector, fn)[0];
};
/**
 * An Emitter is an EventEmitter-style object.
 */
Jymin.Emitter = function () {
  // Lazily apply the prototype so that Emitter can minify out if not used.
  // TODO: Find out if this is still necessary with UglifyJS.
  Jymin.Emitter.prototype = Jymin.EmitterPrototype;
};

/**
 * Expose Emitter methods which can be applied lazily.
 */
Jymin.EmitterPrototype = {

  _on: function (event, fn) {
    var self = this;
    var events = self._events || (self._events = {});
    var listeners = events[event] || (events[event] = []);
    listeners.push(fn);
    return self;
  },

  _once: function (event, fn) {
    var self = this;
    function f() {
      fn.apply(self, arguments);
      self._removeListener(event, f);
    }
    self._on(event, f);
    return self;
  },

  _emit: function (event) {
    var self = this;
    var listeners = self._listeners(event);
    var args = Array.prototype.slice.call(arguments, 1);
    Jymin.forEach(listeners, function (listener) {
      listener.apply(self, args);
    });
    return self;
  },

  _listeners: function (event) {
    var self = this;
    var events = self._events || 0;
    var listeners = events[event] || [];
    return listeners;
  },

  _removeListener: function (event, fn) {
    var self = this;
    var listeners = self._listeners(event);
    var i = listeners.indexOf(fn);
    if (i > -1) {
      listeners.splice(i, 1);
    }
    return self;
  },

  _removeAllListeners: function (event, fn) {
    var self = this;
    var events = self._events || {};
    if (event) {
      delete events[event];
    }
    else {
      for (event in events) {
        delete events[event];
      }
    }
    return self;
  }

};
Jymin.CLICK = 'click';
Jymin.MOUSEDOWN = 'mousedown';
Jymin.MOUSEUP = 'mouseup';
Jymin.KEYDOWN = 'keydown';
Jymin.KEYUP = 'keyup';
Jymin.KEYPRESS = 'keypress';

/**
 * Bind a handler to listen for a particular event on an element.
 */
Jymin.bind = function (
  element,            // DOMElement|string: Element or ID of element to bind to.
  eventName,          // string|Array:      Name of event (e.g. "click", "mouseover", "keyup").
  eventHandler,       // function:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
  customData          // object|:           Custom data to pass through to the event handler when it's triggered.
) {
  // Allow multiple events to be bound at once using a space-delimited string.
  var isEventArray = Jymin.isArray(eventNames);
  if (isEventArray || Jymin.contains(eventName, ' ')) {
    var eventNames = isEventArray ? eventName : Jymin.splitBySpaces(eventName);
    Jymin.forEach(eventNames, function (singleEventName) {
      Jymin.bind(element, singleEventName, eventHandler, customData);
    });
    return;
  }

  // Ensure that we have an element, not just an ID.
  element = Jymin.getElement(element);
  if (element) {

    // Invoke the event handler with the event information and the target element.
    var callback = function(event) {
      // Fall back to window.event for IE.
      event = event || window.event;
      // Fall back to srcElement for IE.
      var target = event.target || event.srcElement;
      // Defeat Safari text node bug.
      if (target.nodeType == 3) {
        target = Jymin.getParent(target);
      }
      var relatedTarget = event.relatedTarget || event.toElement;
      if (eventName == 'mouseout') {
        while (relatedTarget = Jymin.getParent(relatedTarget)) { // jshint ignore:line
          if (relatedTarget == target) {
            return;
          }
        }
      }
      var result = eventHandler(element, event, target, customData);
      if (result === false) {
        Jymin.preventDefault(event);
      }
    };

    // Bind using whatever method we can use.
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, true);
    }
    else if (element.attachEvent) {
      element.attachEvent('Jymin.on' + eventName, callback);
    }
    else {
      element['Jymin.on' + eventName] = callback;
    }

    var handlers = (element._handlers = element._handlers || {});
    var queue = (handlers[eventName] = handlers[eventName] || []);
    Jymin.push(queue, eventHandler);
  }
};

/**
 * Bind an event handler on an element that delegates to specified child elements.
 */
Jymin.on = function (
  element,
  selector, // Supports "tag.class,tag.class" but does not support nesting.
  eventName,
  eventHandler,
  customData
) {
  if (Jymin.isFunction(selector)) {
    customData = eventName;
    eventHandler = selector;
    eventName = element;
    selector = '';
    element = document;
  }
  else if (Jymin.isFunction(eventName)) {
    customData = eventHandler;
    eventHandler = eventName;
    eventName = selector;
    selector = element;
    element = document;
  }
  var parts = selector.split(',');
  onHandler = function(element, event, target, customData) {
    Jymin.forEach(parts, function (part) {
      var found = false;
      if ('#' + target.id == part) {
        found = true;
      }
      else {
        var tagAndClass = part.split('.');
        var tagName = tagAndClass[0].toUpperCase();
        var className = tagAndClass[1];
        if (!tagName || (target.tagName == tagName)) {
          if (!className || Jymin.hasClass(target, className)) {
            found = true;
          }
        }
      }
      if (found) {
        var result = eventHandler(target, event, element, customData);
        if (result === false) {
          Jymin.preventDefault(event);
        }
      }
    });
    // Bubble up to find a selector match because we didn't find one this time.
    target = Jymin.getParent(target);
    if (target) {
      onHandler(element, event, target, customData);
    }
  };
  Jymin.bind(element, eventName, onHandler, customData);
};

/**
 * Trigger an element event.
 */
Jymin.trigger = function (
  element,   // object:        Element to trigger an event on.
  event,     // object|String: Event to trigger.
  target,    // object|:       Fake target.
  customData // object|:       Custom data to pass to handlers.
) {
  if (Jymin.isString(event)) {
    event = {type: event};
  }
  if (!target) {
    customData = target;
    target = element;
  }
  event._triggered = true;

  var handlers = element._handlers;
  if (handlers) {
    var queue = handlers[event.type];
    Jymin.forEach(queue, function (handler) {
      handler(element, event, target, customData);
    });
  }
  if (!event.cancelBubble) {
    element = Jymin.getParent(element);
    if (element) {
      Jymin.trigger(element, event, target, customData);
    }
  }
};

/**
 * Stop event bubbling.
 */
Jymin.stopPropagation = function (
  event // object: Event to be canceled.
) {
  if (event) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }
  //+env:debug
  else {
    Jymin.error('[Jymin] Called Jymin.stopPropagation on a non-event.', event);
  }
  //-env:debug
};

/**
 * Prevent the default action for this event.
 * @param  {Object} event  Event to prevent from doing its default action.
 */
Jymin.preventDefault = function (event) {
  if (event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
  //+env:debug
  else {
    Jymin.error('[Jymin] Called Jymin.preventDefault on a non-event.', event);
  }
  //-env:debug
};

/**
 * Bind an event handler for both the focus and blur events.
 */
Jymin.bindFocusChange = function (element, eventHandler, customData) {
  Jymin.bind(element, 'focus', eventHandler, true, customData);
  Jymin.bind(element, 'blur', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
Jymin.bindHover = function (element, eventHandler, customData) {
  var ieVersion = Jymin.getBrowserVersionOrZero('msie');
  var HOVER_OVER = 'mouse' + (ieVersion ? 'enter' : 'over');
  var HOVER_OUT = 'mouse' + (ieVersion ? 'leave' : 'out');
  Jymin.bind(element, HOVER_OVER, eventHandler, true, customData);
  Jymin.bind(element, HOVER_OUT, eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
Jymin.onHover = function (element, tagAndClass, eventHandler, customData) {
  Jymin.on(element, tagAndClass, 'mouseover', eventHandler, true, customData);
  Jymin.on(element, tagAndClass, 'mouseout', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
Jymin.bindClick = function (element, eventHandler, customData) {
  Jymin.bind(element, 'click', eventHandler, customData);
};

/**
 * Bind a callback to be run after window onload.
 */
Jymin.bindWindowLoad = function (callback, windowObject) {
  // Default to the run after the window we're in.
  windowObject = windowObject || window;
  // If the window is already loaded, run the callback now.
  if (Jymin.isLoaded(windowObject.document)) {
    callback();
  }
  // Otherwise, defer the callback.
  else {
    Jymin.bind(windowObject, 'load', callback);
  }
};

/**
 * Return true if the object is loaded (signaled by its readyState being "loaded" or "complete").
 * This can be useful for the documents, iframes and scripts.
 */
Jymin.isLoaded = function (object) {
  var state = object.readyState;
  // In all browsers, documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  // In non-IE browsers, we can bind to script.onload instead of checking script.readyState.
  return state == 'complete' || (object.tagName == 'script' && state == 'loaded');
};

/**
 * Focus on a specified element.
 */
Jymin.focusElement = function (element, delay) {
  var focus = function () {
    element = Jymin.getElement(element);
    if (element) {
      var focusMethod = element.focus;
      if (Jymin.isFunction(focusMethod)) {
        focusMethod.call(element);
      }
      else {
        //+env:debug
        Jymin.error('[Jymin] Element does not exist, or has no focus method', element);
        //-env:debug
      }
    }
  };
  if (Jymin.isUndefined(delay)) {
    focus();
  }
  else {
    setTimeout(focus, delay);
  }
};

/**
 * Stop events from triggering a handler more than once in rapid succession.
 */
Jymin.doOnce = function (method, args, delay) {
  clearTimeout(method.t);
  method.t = setTimeout(function () {
    clearTimeout(method.t);
    method.call(args);
  }, delay || 9);
};

/**
 * Set or reset a timeout, and save it for possible cancellation.
 */
Jymin.addTimeout = function (elementOrString, callback, delay) {
  var usingString = Jymin.isString(elementOrString);
  var object = usingString ? Jymin.addTimeout : elementOrString;
  var key = usingString ? elementOrString : '_timeout';
  clearTimeout(object[key]);
  if (callback) {
    if (Jymin.isUndefined(delay)) {
      delay = 9;
    }
    object[key] = setTimeout(callback, delay);
  }
};

/**
 * Remove a timeout from an element or from the Jymin.addTimeout method.
 */
Jymin.removeTimeout = function (elementOrString) {
  Jymin.addTimeout(elementOrString, false);
};
/**
 * Get the type of a form element.
 */
Jymin.getType = function (input) {
  return Jymin.ensureString(input.type)[0];
};

/**
 * Get the value of a form element.
 */
Jymin.getValue = function (
  input
) {
  input = Jymin.getElement(input);
  if (input) {
    var type = Jymin.getType(input);
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (type == 'c' || type == 'r') {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      Jymin.forEach(options, function (option) {
        if (option.selected) {
          Jymin.push(value, option.value);
        }
      });
    }
    else if (options) {
      value = Jymin.getValue(options[input.selectedIndex]);
    }
    return value;
  }
};

/**
 * Set the value of a form element.
 */
Jymin.setValue = function (
  input,
  value
) {
  input = Jymin.getElement(input);
  if (input) {
    var type = Jymin.getType(input);
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        if (!Jymin.isArray(value)) {
          value = Jymin.splitByCommas(value);
        }
        Jymin.forEach(value, function (val) {
          selected[val] = true;
        });
      }
      else {
        selected[value] = true;
      }
      value = Jymin.isArray(value) ? value : [value];
      Jymin.forEach(options, function (option) {
        option.selected = !!selected[option.value];
      });
    }
    else {
      input.value = value;
    }
  }
};
/**
 * Return a history object.
 */
Jymin.getHistory = function () {
  var history = window.history || {};
  Jymin.forEach(['Jymin.push', 'replace'], function (key) {
    var fn = history[key + 'State'];
    history[key] = function (href) {
      if (fn) {
        fn.apply(history, [null, null, href]);
      } else {
        // TODO: Create a backward compatible history push.
      }
    };
  });
  return history;
};

/**
 * Push an item into the history.
 */
Jymin.historyPush = function (href) {
  Jymin.getHistory().push(href);
};

/**
 * Replace the current item in the history.
 */
Jymin.historyReplace = function (href) {
  Jymin.getHistory().replace(href);
};

/**
 * Go back.
 */
Jymin.historyPop = function (href) {
  Jymin.getHistory().back();
};

/**
 * Listen for a history change.
 */
Jymin.onHistoryPop = function (callback) {
  Jymin.bind(window, 'Jymin.popstate', callback);
};
// JavaScript reserved words.
Jymin.reservedWordPattern = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;

/**
 * Create JSON that doesn't necessarily have to be strict.
 */
Jymin.stringify = function (data, strict, stack) {
  if (Jymin.isString(data)) {
    data = '"' + data.replace(/\n\r"/g, function (c) {
      return c == '\n' ? '\\n' : c == '\r' ? '\\r' : '\\"';
    }) + '"';
  }
  else if (Jymin.isFunction(data)) {
    data = data.toString();
    if (strict) {
      data = Jymin.stringify(data);
    }
  }
  else if (Jymin.isDate(data)) {
    data = 'new Date(' + Jymin.getTime(data) + ')';
    if (strict) {
      data = Jymin.stringify(data);
    }
  }
  else if (data && Jymin.isObject(data)) {
    stack = stack || [];
    var isCircular = false;
    Jymin.forEach(stack, function (item, index) {
      if (item == data) {
        isCircular = true;
      }
    });
    if (isCircular) {
      return null;
    }
    Jymin.push(stack, data);
    var parts = [];
    var before, after;
    if (Jymin.isArray(data)) {
      before = '[';
      after = ']';
      Jymin.forEach(data, function (value) {
        Jymin.push(parts, Jymin.stringify(value, strict, stack));
      });
    }
    else {
      before = '{';
      after = '}';
      Jymin.forIn(data, function (key, value) {
        if (strict || Jymin.reservedWordPattern.test(key) || /(^\d|[^\w$])/.test(key)) {
          key = '"' + key + '"';
        }
        Jymin.push(parts, key + ':' + Jymin.stringify(value, strict, stack));
      });
    }
    Jymin.pop(stack);
    data = before + parts.join(',') + after;
  }
  else {
    data = '' + data;
  }
  return data;
};

/**
 * Parse JavaScript and return a value.
 */
Jymin.parse = function (value) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value);
    return evil.J;
  }
  catch (e) {
    //+env:debug
    Jymin.error('[Jymin] Could not parse JS: ' + value);
    //-env:debug
  }
};

/**
 * Execute JavaScript.
 */
Jymin.execute = function (text) {
  Jymin.parse('0;' + text);
};

/**
 * Parse a value and return a boolean no matter what.
 */
Jymin.parseBoolean = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isBoolean(value) ? value : (alternative || false);
};

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseNumber = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isNumber(value) ? value : (alternative || 0);
};

/**
 * Parse a value and return a string no matter what.
 */
Jymin.parseString = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isString(value) ? value : (alternative || '');
};

/**
 * Parse a value and return an object no matter what.
 */
Jymin.parseObject = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isObject(value) ? value : (alternative || {});
};

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseArray = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isObject(value) ? value : (alternative || []);
};
/**
 * Log values to the console, if it's available.
 */
Jymin.error = function () {
  Jymin.ifConsole('Jymin.error', arguments);
};

/**
 * Log values to the console, if it's available.
 */
Jymin.warn = function () {
  Jymin.ifConsole('Jymin.warn', arguments);
};

/**
 * Log values to the console, if it's available.
 */
Jymin.info = function () {
  Jymin.ifConsole('Jymin.info', arguments);
};

/**
 * Log values to the console, if it's available.
 */
Jymin.log = function () {
  Jymin.ifConsole('Jymin.log', arguments);
};

/**
 * Log values to the console, if it's available.
 */
Jymin.trace = function () {
  Jymin.ifConsole('Jymin.trace', arguments);
};

/**
 * Log values to the console, if it's available.
 */
Jymin.ifConsole = function (method, args) {
  var console = window.console;
  if (console && console[method]) {
    console[method].apply(console, args);
  }
};
/**
 * If the argument is numeric, return a number, otherwise return zero.
 * @param Object n
 */
Jymin.ensureNumber = function (
  number,
  defaultNumber
) {
  defaultNumber = defaultNumber || 0;
  number *= 1;
  return isNaN(number) ? defaultNumber : number;
};

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 */
Jymin.zeroFill = function (
  number,
  length
) {
  number = Jymin.ensureString(number);
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0);
  return (new Array(length + 1)).join('0') + number;
};
/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
Jymin.forIn = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(key, object[key], object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an object's keys, and call a function on each (value, key) pair.
 */
Jymin.forOf = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(object[key], key, object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Decorate an object with properties from another object.
 */
Jymin.decorateObject = function (object, decorations) {
  if (object && decorations) {
    Jymin.forIn(decorations, function (key, value) {
      object[key] = value;
    });
  }
  return object;
};

/**
 * Ensure that a property exists by creating it if it doesn't.
 */
Jymin.ensureProperty = function (object, property, defaultValue) {
  var value = object[property];
  if (!value) {
    value = object[property] = defaultValue;
  }
  return value;
};
/**
 * Get the local storage object.
 *
 * @return {Object}  The local storage object.
 */
Jymin.getStorage = function () {
  return window.localStorage;
};

/**
 * Fetch an item from local storage.
 *
 * @param  {string} key  A key to fetch an object by
 * @return {Object}      The object that was fetched and deserialized
 */
Jymin.fetch = function (key) {
  var storage = Jymin.getStorage();
  return storage ? Jymin.parse(storage.getItem(key)) : 0;
};

/**
 * Store an item in local storage.
 *
 * @param  {string} key    A key to store and fetch an object by
 * @param  {Object} value  A value to be stringified and stored
 */
Jymin.store = function (key, value) {
  var storage = Jymin.getStorage();
  if (storage) {
    storage.setItem(key, Jymin.stringify(value));
  }
};
/**
 * Ensure a value is a string.
 */
Jymin.ensureString = function (
  value
) {
  return Jymin.isString(value) ? value : '' + value;
};

/**
 * Return true if the string contains the given substring.
 */
Jymin.contains = function (
  string,
  substring
) {
  return Jymin.ensureString(string).indexOf(substring) > -1;
};

/**
 * Return true if the string starts with the given substring.
 */
Jymin.startsWith = function (
  string,
  substring
) {
  return Jymin.ensureString(string).indexOf(substring) == 0; // jshint ignore:line
};

/**
 * Trim the whitespace from a string.
 */
Jymin.trim = function (
  string
) {
  return Jymin.ensureString(string).replace(/^\s+|\s+$/g, '');
};

/**
 * Split a string by commas.
 */
Jymin.splitByCommas = function (
  string
) {
  return Jymin.ensureString(string).split(',');
};

/**
 * Split a string by spaces.
 */
Jymin.splitBySpaces = function (
  string
) {
  return Jymin.ensureString(string).split(' ');
};

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
Jymin.decorateString = function (
  string,
  replacements
) {
  string = Jymin.ensureString(string);
  Jymin.forEach(replacements, function(replacement) {
    string = string.replace('*', replacement);
  });
  return string;
};

/**
 * Perform a RegExp Jymin.match, and call a callback on the result;
  */
Jymin.match = function (
  string,
  pattern,
  callback
) {
  var result = string.match(pattern);
  if (result) {
    callback.apply(string, result);
  }
};

/**
 * Reduce a string to its alphabetic characters.
 */
Jymin.extractLetters = function (
  string
) {
  return Jymin.ensureString(string).replace(/[^a-z]/ig, '');
};

/**
 * Reduce a string to its numeric characters.
 */
Jymin.extractNumbers = function (
  string
) {
  return Jymin.ensureString(string).replace(/[^0-9]/g, '');
};

/**
 * Returns a lowercase string.
 */
Jymin.lower = function (
  object
) {
  return Jymin.ensureString(object).toLowerCase();
};

/**
 * Returns an uppercase string.
 */
Jymin.upper = function (
  object
) {
  return Jymin.ensureString(object).toUpperCase();
};

/**
 * Return an escaped value for URLs.
 */
Jymin.escape = function (value) {
  return encodeURIComponent(value);
};

/**
 * Return an unescaped value from an escaped URL.
 */
Jymin.unescape = function (value) {
  return decodeURIComponent(value);
};

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
Jymin.buildQueryString = function (
  object
) {
  var queryParams = [];
  Jymin.forIn(object, function(key, value) {
    queryParams.push(Jymin.escape(key) + '=' + Jymin.escape(value));
  });
  return queryParams.join('&');
};

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
Jymin.getBrowserVersionOrZero = function (
  browserName
) {
  match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent);
  return match ? +Jymin.match[1] : 0;
};
/**
 * Return true if a variable is a given type.
 */
Jymin.isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
Jymin.isUndefined = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
Jymin.isBoolean = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
Jymin.isNumber = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
Jymin.isString = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
Jymin.isFunction = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
Jymin.isObject = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
Jymin.isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
Jymin.isArray = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isInstance(value, Array);
};

/**
 * Return true if a variable is a date.
 */
Jymin.isDate = function (
  value // mixed:  The variable to check.
) {
  return Jymin.isInstance(value, Date);
};
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
Jymin.getQueryParams = function (
  url
) {
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
Jymin.getHashParams = function (
  hash
) {
  hash = (hash || location.hash).replace(/^#/, '');
  return hash ? Jymin.getQueryParams(hash) : {};
};
