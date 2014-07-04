/**
 *      _                 _                ___   _____  ___
 *     | |_   _ _ __ ___ (_)_ __   __   __/ _ \ |___ / / _ \
 *  _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | |  |_ \| | | |
 * | |_| | |_| | | | | | | | | | |  \ V /| |_| | ___) | |_| |
 *  \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_)____(_)___/
 *        |___/
 *
 * http://lighter.io/jymin
 * MIT License
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/zerious/jymin/blob/master/scripts/ajax.js
 *   https://github.com/zerious/jymin/blob/master/scripts/collections.js
 *   https://github.com/zerious/jymin/blob/master/scripts/cookies.js
 *   https://github.com/zerious/jymin/blob/master/scripts/dates.js
 *   https://github.com/zerious/jymin/blob/master/scripts/dom.js
 *   https://github.com/zerious/jymin/blob/master/scripts/events.js
 *   https://github.com/zerious/jymin/blob/master/scripts/forms.js
 *   https://github.com/zerious/jymin/blob/master/scripts/history.js
 *   https://github.com/zerious/jymin/blob/master/scripts/json.js
 *   https://github.com/zerious/jymin/blob/master/scripts/logging.js
 *   https://github.com/zerious/jymin/blob/master/scripts/numbers.js
 *   https://github.com/zerious/jymin/blob/master/scripts/ready.js
 *   https://github.com/zerious/jymin/blob/master/scripts/strings.js
 *   https://github.com/zerious/jymin/blob/master/scripts/types.js
 *   https://github.com/zerious/jymin/blob/master/scripts/url.js
 */


this.jymin = {version: '0.3.0'};

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
/**
 * Iterate over an array, and call a function on each item.
 */
var forEach = function (
  array,   // Array:    The array to iterate over.
  callback // Function: The function to call on each item. `callback(item, index, array)`
) {
  if (array) {
    for (var index = 0, length = getLength(array); index < length; index++) {
      var result = callback(array[index], index, array);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an array, and call a callback with (index, value), as in jQuery.each
 */
var each = function (
  array,   // Array:    The array to iterate over.
  callback // Function: The function to call on each item. `callback(item, index, array)`
) {
  if (array) {
    for (var index = 0, length = getLength(array); index < length; index++) {
      var result = callback(index, array[index], array);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
var forIn = function (
  object,  // Object*:   The object to iterate over.
  callback // Function*: The function to call on each pair. `callback(value, key, object)`
) {
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
var forOf = function (
  object,  // Object*:   The object to iterate over.
  callback // Function*: The function to call on each pair. `callback(value, key, object)`
) {
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
 * Decorate an object with properties from another object. If the properties
 */
var decorateObject = function (
  object,     // Object: The object to decorate.
  decorations // Object: The object to iterate over.
) {
    if (object && decorations) {
    forIn(decorations, function (key, value) {
      object[key] = value;
    });
    }
    return object;
};

/**
 * Ensure that a property exists by creating it if it doesn't.
 */
var ensureProperty = function (
  object,
  property,
  defaultValue
) {
  var value = object[property];
  if (!value) {
    value = object[property] = defaultValue;
  }
  return value;
};

/**
 * Get the length of an array.
 * @return number: Array length.
 */
var getLength = function (
  array // Array|DomNodeCollection|String: The object to check for length.
) {
  return isInstance(array) || isString(array) ? array.length : 0;
};

/**
 * Get the first item in an array.
 * @return mixed: First item.
 */
var getFirst = function (
  array // Array: The array to get the
) {
  return isArray(array) ? array[0] : undefined;
};

/**
 * Get the first item in an array.
 * @return mixed: First item.
 */
var getLast = function (
  array // Array: The array to get the
) {
  return isInstance(array) ? array[getLength(array) - 1] : undefined;
};

/**
 * Check for multiple array items.
 * @return boolean: true if the array has more than one item.
 */
var hasMany = function (
  array // Array: The array to check for item.
) {
  return getLength(array) > 1;
};

/**
 * Push an item into an array.
 * @return mixed: Pushed item.
 */
var push = function (
  array, // Array: The array to push the item into.
  item   // mixed: The item to push.
) {
  if (isArray(array)) {
    array.push(item);
  }
  return item;
};

/**
 * Pop an item off an array.
 * @return mixed: Popped item.
 */
var pop = function (
  array // Array: The array to push the item into.
) {
  if (isArray(array)) {
    return array.pop();
  }
};

var merge = function (
  array, // Array:  The array to merge into.
  items  // mixed+: The items to merge into the array.
) {
  // TODO: Use splice instead of pushes to get better performance?
  var addToFirstArray = function (item) {
    array.push(item);
  };
  for (var i = 1, l = arguments.length; i < l; i++) {
    forEach(arguments[i], addToFirstArray);
  }
};

/**
 * Push padding values onto an array up to a specified length.
 * @return number: The number of padding values that were added.
 */
var padArray = function (
  array,       // Array:  The array to check for items.
  padToLength, // number: The minimum number of items in the array.
  paddingValue // mixed|: The value to use as padding.
) {
  var countAdded = 0;
  if (isArray(array)) {
    var startingLength = getLength(array);
    if (startingLength < length) {
      paddingValue = isUndefined(paddingValue) ? '' : paddingValue;
      for (var index = startingLength; index < length; index++) {
        array.push(paddingValue);
        countAdded++;
      }
    }
  }
  return countAdded;
};
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
/**
 * Get Unix epoch milliseconds from a date.
 * @return integer: Epoch milliseconds.
 */
var getTime = function (
  date // Date: Date object. (Default: now)
) {
  date = date || new Date();
  return date.getTime();
};

/**
 * Get Unix epoch milliseconds from a date.
 * @return integer: Epoch milliseconds.
 */
var getIsoDate = function (
  date // Date: Date object. (Default: now)
) {
  if (!date) {
    date = new Date();
  }
  if (date.toISOString) {
    date = date.toISOString();
  }
  else {
    // Build an ISO date string manually in really old browsers.
    var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
    date = date.toUTCString().replace(utcPattern, function (a, d, m, y, t) {
      m = zeroFill(date.getMonth(), 2);
      t += '.' + zeroFill(date.getMilliseconds(), 3);
      return y + '-' + m + '-' + d + 'T' + t + 'Z';
    });
  }
  return date;
};
/**
 * Get a DOM element by its ID (if the argument is an ID).
 * If you pass in a DOM element, it just returns it.
 * This can be used to ensure that you have a DOM element.
 */
var getElement = function (
  parentElement, // DOMElement|:       Document or DOM element for getElementById. (Default: document)
  id             // string|DOMElement: DOM element or ID of a DOM element.
) {
  if (getLength(arguments) < 2) {
    id = parentElement;
    parentElement = document;
  }
  return isString(id) ? parentElement.getElementById(id) : id;
};

/**
 * Get DOM elements that have a specified tag name.
 */
var getElementsByTagName = function (
  parentElement, // DOMElement|: Document or DOM element for getElementsByTagName. (Default: document)
  tagName        // string|:     Name of the tag to look for. (Default: "*")
) {
  if (getLength(arguments) < 2) {
    tagName = parentElement;
    parentElement = document;
  }
  return parentElement.getElementsByTagName(tagName || '*');
};

/**
 * Get DOM elements that have a specified tag and class.
 */
var getElementsByTagAndClass = function (
  parentElement,
  tagAndClass
) {
  if (getLength(arguments) < 2) {
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
      forEach(parentElement.getElementsByClassName(className), function(element) {
        if (anyTag || (element.tagName == tagName)) {
          elements.push(element);
        }
      });
    }
    else {
      forEach(getElementsByTagName(parentElement, tagName), function(element) {
        if (hasClass(element, className)) {
          elements.push(element);
        }
      });
    }
  }
  else {
    elements = getElementsByTagName(parentElement, tagName);
  }
  return elements;
};

/**
 * Get the parent of a DOM element.
 */
var getParent = function (
  element,
  tagName
) {
  var parentElement = (getElement(element) || {}).parentNode;
  // If a tag name is specified, keep walking up.
  if (tagName && parentElement && parentElement.tagName != tagName) {
    parentElement = getParent(parentElement, tagName);
  }
  return parentElement;
};

/**
 * Create a DOM element.
 */
var createElement = function (
  tagIdentifier
) {
  if (!isString(tagIdentifier)) {
    return tagIdentifier;
  }
  tagIdentifier = tagIdentifier || '';
  var tagAndAttributes = tagIdentifier.split('?');
  var tagAndClass = tagAndAttributes[0].split('.');
  var className = tagAndClass.slice(1).join(' ');
  var tagAndId = tagAndClass[0].split('#');
  var tagName = tagAndId[0] || 'div';
  var id = tagAndId[1];
  var attributes = tagAndAttributes[1];
  var cachedElement = createElement[tagName] || (createElement[tagName] = document.createElement(tagName));
  var element = cachedElement.cloneNode(true);
  if (id) {
    element.id = id;
  }
  if (className) {
    element.className = className;
  }
  // TODO: Do something less janky than using query string syntax (like Ltl).
  if (attributes) {
    attributes = attributes.split('&');
    forEach(attributes, function (attribute) {
      var keyAndValue = attribute.split('=');
      var key = unescape(keyAndValue[0]);
      var value = unescape(keyAndValue[1]);
      element[key] = value;
      element.setAttribute(key, value);
    });
  }
  return element;
};

/**
* Create a DOM element, and append it to a parent element.
*/
var addElement = function (
  parentElement,
  tagIdentifier,
  beforeSibling
) {
  var element = createElement(tagIdentifier);
  if (parentElement) {
    insertElement(parentElement, element, beforeSibling);
  }
  return element;
};

/**
 * Create a DOM element, and append it to a parent element.
 */
var appendElement = function (
  parentElement,
  tagIdentifier
) {
  return addElement(parentElement, tagIdentifier);
};

/**
 * Create a DOM element, and prepend it to a parent element.
 */
var prependElement = function (
  parentElement,
  tagIdentifier
) {
  var beforeSibling = getFirstChild(parentElement);
  return addElement(parentElement, tagIdentifier, beforeSibling);
};

/**
 * Wrap an existing DOM element within a newly created one.
 */
var wrapElement = function (
  element,
  tagIdentifier
) {
  var parentElement = getParent(element);
  var wrapper = addElement(parentElement, tagIdentifier, element);
  insertElement(wrapper, element);
  return wrapper;
};

/**
 * Return the children of a parent DOM element.
 */
var getChildren = function (
  parentElement
) {
  return getElement(parentElement).childNodes;
};

/**
 * Return a DOM element's index with respect to its parent.
 */
var getIndex = function (
  element
) {
  element = getElement(element);
  var index = -1;
  while (element) {
    ++index;
    element = element.previousSibling;
  }
  return index;
};

/**
 * Append a child DOM element to a parent DOM element.
 */
var insertElement = function (
  parentElement,
  childElement,
  beforeSibling
) {
  // Ensure that we have elements, not just IDs.
  parentElement = getElement(parentElement);
  childElement = getElement(childElement);
  if (parentElement && childElement) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (isNumber(beforeSibling)) {
      beforeSibling = getChildren(parentElement)[beforeSibling];
    }
    // Insert the element, optionally before an existing sibling.
    parentElement.insertBefore(childElement, beforeSibling || null);
  }
};

/**
 * Insert a DOM element after another.
 */
var insertBefore = function (
  element,
  childElement
) {
  element = getElement(element);
  var parentElement = getParent(element);
  addElement(parentElement, childElement, element);
};

/**
 * Insert a DOM element after another.
 */
var insertAfter = function (
  element,
  childElement
) {
  element = getElement(element);
  var parentElement = getParent(element);
  var beforeElement = getNextSibling(element);
  addElement(parentElement, childElement, beforeElement);
};

/**
 * Remove a DOM element from its parent.
 */
var removeElement = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    // Remove the element from its parent, provided that its parent still exists.
    var parentElement = getParent(element);
    if (parentElement) {
      parentElement.removeChild(element);
    }
  }
};

/**
 * Remove children from a DOM element.
 */
var clearElement = function (
  element
) {
  setHtml(element, '');
};

/**
 * Get a DOM element's inner HTML if the element can be found.
 */
var getHtml = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.innerHTML;
  }
};

/**
 * Set a DOM element's inner HTML if the element can be found.
 */
var setHtml = function (
  element,
  html
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    // Set the element's innerHTML.
    element.innerHTML = html;
  }
};

/**
 * Get a DOM element's inner text if the element can be found.
 */
var getText = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.innerText;
  }
};

/**
 * Set a DOM element's inner text if the element can be found.
 */
var setText = function (
  element,
  text
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    // Set the element's innerText.
    element.innerHTML = text;
  }
};

/**
 * Get an attribute from a DOM element, if it can be found.
 */
var getAttribute = function (
  element,
  attributeName
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.getAttribute(attributeName);
  }
};

/**
 * Set an attribute on a DOM element, if it can be found.
 */
var setAttribute = function (
  element,
  attributeName,
  value
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    // Set the element's innerText.
    element.setAttribute(attributeName, value);
  }
};

/**
 * Get a data attribute from a DOM element.
 */
var getData = function (
  element,
  dataKey
) {
  return getAttribute(element, 'data-' + dataKey);
};

/**
 * Set a data attribute on a DOM element.
 */
var setData = function (
  element,
  dataKey,
  value
) {
  setAttribute(element, 'data-' + dataKey, value);
};

/**
 * Get a DOM element's class name if the element can be found.
 */
var getClass = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.className;
  }
};

/**
 * Set a DOM element's class name if the element can be found.
 */
var setClass = function (
  element,
  className
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    // Set the element's innerText.
    element.className = className;
  }
};

/**
 * Get a DOM element's firstChild if the element can be found.
 */
var getFirstChild = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.firstChild;
  }
};

/**
 * Get a DOM element's previousSibling if the element can be found.
 */
var getPreviousSibling = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.previousSibling;
  }
};

/**
 * Get a DOM element's nextSibling if the element can be found.
 */
var getNextSibling = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {
    return element.nextSibling;
  }
};

/**
 * Case-sensitive class detection.
 */
var hasClass = function (
  element,
  className
) {
  var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return pattern.test(getClass(element));
};

/**
 * Add a class to a given element.
 */
var addClass = function (
  element,
  className
) {
  element = getElement(element);
  if (element) {
    element.className += ' ' + className;
  }
};

/**
 * Remove a class from a given element.
 */
var removeClass = function (
  element,
  className
) {
  element = getElement(element);
  if (element) {
    var tokens = getClass(element).split(/\s/);
    var ok = [];
    forEach(tokens, function (token) {
      if (token != className) {
        ok.push(token);
      }
    });
    element.className = ok.join(' ');
  }
};

/**
 * Turn a class on or off on a given element.
 */
var flipClass = function (
  element,
  className,
  flipOn
) {
  var method = flipOn ? addClass : removeClass;
  method(element, className);
};

/**
 * Turn a class on or off on a given element.
 */
var toggleClass = function (
  element,
  className
) {
  var turnOn = false;
  element = getElement(element);
  if (element) {
    turnOn = !hasClass(element, className);
    flipClass(element, className, turnOn);
  }
  return turnOn;
};

/**
 * Insert a call to an external JavaScript file.
 */
var insertScript = function (
  src,
  callback
) {
  var head = getElementsByTagName('head')[0];
  var script = addElement(head, 'script');
  if (callback) {
    script.onload = callback;
    script.onreadystatechange = function() {
      if (isLoaded(script)) {
        callback();
      }
    };
  }
  script.src = src;
};

/**
 * Finds elements matching a selector, and return or run a callback on them.
 */
var all = function (
  parentElement,
  selector,
  callback
) {
  // TODO: Better argument collapsing.
  if (!selector || isFunction(selector)) {
    callback = selector;
    selector = parentElement;
    parentElement = document;
  }
  var elements;
  if (contains(selector, ',')) {
    elements = [];
    var selectors = splitByCommas(selector);
    forEach(selectors, function (piece) {
      var more = all(parentElement, piece);
      if (getLength(more)) {
        merge(elements, more);
      }
    });
  }
  else if (contains(selector, ' ')) {
    var pos = selector.indexOf(' ');
    var preSelector = selector.substr(0, pos);
    var postSelector = selector.substr(pos + 1);
    elements = [];
    all(parentElement, preSelector, function (element) {
      var children = all(element, postSelector);
      merge(elements, children);
    });
  }
  else if (selector[0] == '#') {
    var id = selector.substr(1);
    var child = getElement(parentElement.ownerDocument || document, id);
    if (child) {
      var parent = getParent(child);
      while (parent) {
        if (parent === parentElement) {
          elements = [child];
          break;
        }
        parent = getParent(parent);
      }
    }
  }
  else {
    elements = getElementsByTagAndClass(parentElement, selector);
  }
  if (callback) {
    forEach(elements, callback);
  }
  return elements || [];
};

/**
 * Finds elements matching a selector, and return or run a callback on them.
 */
var one = function (
  parentElement,
  selector,
  callback
) {
  return all(parentElement, selector, callback)[0];
};
var CLICK = 'click';
var MOUSEDOWN = 'mousedown';
var MOUSEUP = 'mouseup';
var KEYDOWN = 'keydown';
var KEYUP = 'keyup';
var KEYPRESS = 'keypress';

/**
 * Bind a handler to listen for a particular event on an element.
 */
var bind = function (
  element,            // DOMElement|string: Element or ID of element to bind to.
  eventName,          // string|Array:      Name of event (e.g. "click", "mouseover", "keyup").
  eventHandler,       // function:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
  customData          // object|:           Custom data to pass through to the event handler when it's triggered.
) {
  // Allow multiple events to be bound at once using a space-delimited string.
  var isEventArray = isArray(eventNames);
  if (isEventArray || contains(eventName, ' ')) {
    var eventNames = isEventArray ? eventName : splitBySpaces(eventName);
    forEach(eventNames, function (singleEventName) {
      bind(element, singleEventName, eventHandler, customData);
    });
    return;
  }

  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {

    // Invoke the event handler with the event information and the target element.
    var callback = function(event) {
      // Fall back to window.event for IE.
      event = event || window.event;
      // Fall back to srcElement for IE.
      var target = event.target || event.srcElement;
      // Defeat Safari text node bug.
      if (target.nodeType == 3) {
        target = getParent(target);
      }
      var relatedTarget = event.relatedTarget || event.toElement;
      if (eventName == 'mouseout') {
        while (relatedTarget = getParent(relatedTarget)) { // jshint ignore:line
          if (relatedTarget == target) {
            return;
          }
        }
      }
      var result = eventHandler(element, event, target, customData);
      if (result === false) {
        preventDefault(event);
      }
    };

    // Bind using whatever method we can use.
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, true);
    }
    else if (element.attachEvent) {
      element.attachEvent('on' + eventName, callback);
    }
    else {
      element['on' + eventName] = callback;
    }

    var handlers = (element._HANDLERS = element._HANDLERS || {});
    var queue = (handlers[eventName] = handlers[eventName] || []);
    push(queue, eventHandler);
  }
};

/**
 * Bind an event handler on an element that delegates to specified child elements.
 */
var on = function (
  element,
  selector, // Supports "tag.class,tag.class" but does not support nesting.
  eventName,
  eventHandler,
  customData
) {
  if (isFunction(selector)) {
    customData = eventName;
    eventHandler = selector;
    eventName = element;
    selector = '';
    element = document;
  }
  else if (isFunction(eventName)) {
    customData = eventHandler;
    eventHandler = eventName;
    eventName = selector;
    selector = element;
    element = document;
  }
  var parts = selector.split(',');
  var onHandler = function(element, event, target, customData) {
    forEach(parts, function (part) {
      var found = false;
      if ('#' + target.id == part) {
        found = true;
      }
      else {
        var tagAndClass = part.split('.');
        var tagName = tagAndClass[0].toUpperCase();
        var className = tagAndClass[1];
        if (!tagName || (target.tagName == tagName)) {
          if (!className || hasClass(target, className)) {
            found = true;
          }
        }
      }
      if (found) {
        var result = eventHandler(target, event, element, customData);
        if (result === false) {
          preventDefault(event);
        }
      }
    });
    // Bubble up to find a selector match because we didn't find one this time.
    target = getParent(target);
    if (target) {
      onHandler(element, event, target, customData);
    }
  };
  bind(element, eventName, onHandler, customData);
};

/**
 * Trigger an element event.
 */
var trigger = function (
  element,   // object:        Element to trigger an event on.
  event,     // object|String: Event to trigger.
  target,    // object|:       Fake target.
  customData // object|:       Custom data to pass to handlers.
) {
  if (isString(event)) {
    event = {type: event};
  }
  if (!target) {
    customData = target;
    target = element;
  }
  event._TRIGGERED = true;

  var handlers = element._HANDLERS;
  if (handlers) {
    var queue = handlers[event.type];
    forEach(queue, function (handler) {
      handler(element, event, target, customData);
    });
  }
  if (!event.cancelBubble) {
    element = getParent(element);
    if (element) {
      trigger(element, event, target, customData);
    }
  }
};

/**
 * Stop event bubbling.
 */
var stopPropagation = function (
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
    error('[Jymin] Called stopPropagation on a non-event.', event);
  }
  //-env:debug
};

/**
 * Prevent the default action for this event.
 */
var preventDefault = function (
  event // object: Event to prevent from doing its default action.
) {
  if (event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
  //+env:debug
  else {
    error('[Jymin] Called preventDefault on a non-event.', event);
  }
  //-env:debug
};

/**
 * Bind an event handler for both the focus and blur events.
 */
var bindFocusChange = function (
  element, // DOMElement|string*
  eventHandler,
  customData
) {
  bind(element, 'focus', eventHandler, true, customData);
  bind(element, 'blur', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var bindHover = function (
  element,
  eventHandler,
  customData
) {
  var ieVersion = getBrowserVersionOrZero('msie');
  var HOVER_OVER = 'mouse' + (ieVersion ? 'enter' : 'over');
  var HOVER_OUT = 'mouse' + (ieVersion ? 'leave' : 'out');
  bind(element, HOVER_OVER, eventHandler, true, customData);
  bind(element, HOVER_OUT, eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var onHover = function (
  element,
  tagAndClass,
  eventHandler,
  customData
) {
  on(element, tagAndClass, 'mouseover', eventHandler, true, customData);
  on(element, tagAndClass, 'mouseout', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var bindClick = function (
  element,
  eventHandler,
  customData
) {
  bind(element, 'click', eventHandler, customData);
};

/**
 * Bind a callback to be run after window onload.
 */
var bindWindowLoad = function (
  callback,
  windowObject
) {
  // Default to the run after the window we're in.
  windowObject = windowObject || window;
  // If the window is already loaded, run the callback now.
  if (isLoaded(windowObject.document)) {
    callback();
  }
  // Otherwise, defer the callback.
  else {
    bind(windowObject, 'load', callback);
  }
};

/**
 * Return true if the object is loaded (signaled by its readyState being "loaded" or "complete").
 * This can be useful for the documents, iframes and scripts.
 */
var isLoaded = function (
  object
) {
  var state = object.readyState;
  // In all browsers, documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  // In non-IE browsers, we can bind to script.onload instead of checking script.readyState.
  return state == 'complete' || (object.tagName == 'script' && state == 'loaded');
};

/**
 * Focus on a specified element.
 */
var focusElement = function (
  element,
  delay
) {
  var focus = function () {
    element = getElement(element);
    if (element) {
      var focusMethod = element.focus;
      if (isFunction(focusMethod)) {
        focusMethod.call(element);
      }
      else {
        //+env:debug
        error('[Jymin] Element does not exist, or has no focus method', element);
        //-env:debug
      }
    }
  };
  if (isUndefined(delay)) {
    focus();
  }
  else {
    setTimeout(focus, delay);
  }
};

/**
 * Stop events from triggering a handler more than once in rapid succession.
 */
var doOnce = function (
  method,
  args,
  delay
) {
  clearTimeout(method.t);
  method.t = setTimeout(function () {
    clearTimeout(method.t);
    method.call(args);
  }, delay || 9);
};

/**
 * Set or reset a timeout, and save it for possible cancellation.
 */
var addTimeout = function (
  elementOrString,
  callback,
  delay
) {
  var usingString = isString(elementOrString);
  var object = usingString ? addTimeout : elementOrString;
  var key = usingString ? elementOrString : '_TIMEOUT';
  clearTimeout(object[key]);
  if (callback) {
    if (isUndefined(delay)) {
      delay = 9;
    }
    object[key] = setTimeout(callback, delay);
  }
};

/**
 * Remove a timeout from an element or from the addTimeout method.
 */
var removeTimeout = function (
  elementOrString
) {
  addTimeout(elementOrString, false);
};
/**
 * Get the value of a form element.
 */
var getValue = function (
  input
) {
  input = getElement(input);
  if (input) {
    var type = ensureString(input.type)[0];
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (type == 'c' || type == 'r') {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      forEach(options, function (option) {
        if (option.selected) {
          push(value, option.value);
        }
      });
    }
    else if (options) {
      value = getValue(options[input.selectedIndex]);
    }
    return value;
  }
};

/**
 * Set the value of a form element.
 */
var setValue = function (
  input,
  value
) {
  input = getElement(input);
  if (input) {
    var type = input.type[0];
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        if (!isArray(value)) {
          value = splitByCommas(value);
        }
        forEach(value, function (val) {
          selected[val] = true;
        });
      }
      else {
        selected[value] = true;
      }
      value = isArray(value) ? value : [value];
      forEach(options, function (option) {
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
var getHistory = function () {
  var history = window.history || {};
  forEach(['push', 'replace'], function (key) {
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
var historyPush = function (
  href
) {
  getHistory().push(href);
};

/**
 * Replace the current item in the history.
 */
var historyReplace = function (
  href
) {
  getHistory().replace(href);
};

/**
 * Go back.
 */
var historyPop = function (
  href
) {
  getHistory().back();
};

/**
 * Listen for a history change.
 */
var onHistoryPop = function (
  callback
) {
  bind(window, 'popstate', callback);
};
/**
 * Create JSON that doesn't necessarily have to be strict.
 */
var stringify = function (data, strict, stack) {
  var reserved = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;
  if (data === null) {
    data = 'null';
  }
  else if (isFunction(data)) {
    if (strict) {
      data = '-1';
    }
    else {
      data = ensureString(data).replace(/^function \(/, 'function(');
    }
  }
  else if (isDate(data)) {
    if (strict) {
      data = '"' + getIsoDate() + '"';
    }
    else {
      data = 'new Date(' + getTime(data) + ')';
    }
  }
  else if (isObject(data)) {
    stack = stack || [];
    var isCircular = false;
    forEach(stack, function (item, index) {
      if (item == data) {
        isCircular = true;
      }
    });
    if (isCircular) {
      return null;
    }
    push(stack, data);
    var parts = [];
    var before, after;
    if (isArray(data)) {
      before = '[';
      after = ']';
      forEach(data, function (value) {
        push(parts, stringify(value, strict, stack));
      });
    }
    else {
      before = '{';
      after = '}';
      forIn(data, function (key, value) {
        if (strict || reserved.test(key)) {
          key = '"' + key + '"';
        }
        push(parts, key + ':' + stringify(value, strict, stack));
      });
    }
    pop(stack);
    data = before + parts.join(',') + after;
  }
  else if (isString(data) && stack) {
    data = '"' + data.replace(/"/g, '\\"') + '"';
  }
  else {
    data = '' + data;
  }
  return data;
};

/**
 * Parse JavaScript.
 */
var parse = function (text) {
  if (text[0] == '{' || text[0] == '[') {
    try {
      var evil = window.eval; // jshint ignore:line
      evil('eval.J=' + text);
      text = evil.J;
    }
    catch (e) {
      //+env:debug
      error('[Jymin] Could not parse JS: "' + text + '"');
      //-env:debug
    }
  }
  return text;
};

/**
 * Execute JavaScript.
 */
var execute = function (text) {
  parse('0;' + text);
};
/**
 * Log values to the console, if it's available.
 */
var error = function () {
  ifConsole('error', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var warn = function () {
  ifConsole('warn', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var info = function () {
  ifConsole('info', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var log = function () {
  ifConsole('log', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var trace = function () {
  ifConsole('trace', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var ifConsole = function (method, args) {
  var console = window.console;
  if (console && console[method]) {
    console[method].apply(console, args);
  }
};
/**
 * If the argument is numeric, return a number, otherwise return zero.
 * @param Object n
 */
var ensureNumber = function (
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
var zeroFill = function (
  number,
  length
) {
  number = ensureString(number);
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0);
  return (new Array(length + 1)).join('0') + number;
};
/**
 * Execute a callback when the page loads.
 */
var onReady = window._ON_READY = function (
  callbackOrElement
) {
  // If there's no queue, create it as a property of this function.
  var queue = ensureProperty(onReady, '_QUEUE', []);

  // If there's a callback, push it into the queue.
  if (typeof callbackOrElement == 'function') {

    // The 1st callback makes schedules onReady, if not waiting for scripts.
    if (!getLength(queue)) {

      // In production, there should be a single script, therefore no wait.
      var waitingForScripts = false;

      // In development, individual scripts might still be loading.
      //+env:dev,debug
      waitingForScripts = window._WAITING_FOR_SCRIPTS;
      //-env:dev,debug

      if (!waitingForScripts) {
        // At the next tick, we've excuted this whole script.
        addTimeout(onReady, onReady, 1);
      }
    }

    // Put an item in the queue and wait.
    push(queue, callbackOrElement);
  }

  // If there's no callback, onReady has been triggered, so run callbacks.
  else {
    forEach(queue, function (callback) {
      callback(callbackOrElement || document);
    });
  }
};
/**
 * Ensure a value is a string.
 */
var ensureString = function (
  value
) {
  return isString(value) ? value : '' + value;
};

/**
 * Return true if the string contains the given substring.
 */
var contains = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) > -1;
};

/**
 * Return true if the string starts with the given substring.
 */
var startsWith = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) == 0; // jshint ignore:line
};

/**
 * Trim the whitespace from a string.
 */
var trim = function (
  string
) {
  return ensureString(string).replace(/^\s+|\s+$/g, '');
};

/**
 * Split a string by commas.
 */
var splitByCommas = function (
  string
) {
  return ensureString(string).split(',');
};

/**
 * Split a string by spaces.
 */
var splitBySpaces = function (
  string
) {
  return ensureString(string).split(' ');
};

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
var decorateString = function (
  string,
  replacements
) {
  string = ensureString(string);
  forEach(replacements, function(replacement) {
    string = string.replace('*', replacement);
  });
  return string;
};

/**
 * Perform a RegExp match, and call a callback on the result;
  */
var match = function (
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
var extractLetters = function (
  string
) {
  return ensureString(string).replace(/[^a-z]/ig, '');
};

/**
 * Reduce a string to its numeric characters.
 */
var extractNumbers = function (
  string
) {
  return ensureString(string).replace(/[^0-9]/g, '');
};

/**
 * Returns a lowercase string.
 */
var lower = function (
  object
) {
  return ensureString(object).toLowerCase();
};

/**
 * Returns an uppercase string.
 */
var upper = function (
  object
) {
  return ensureString(object).toUpperCase();
};

/**
 * Return an escaped value for URLs.
 */
var escape = function (value) {
  return encodeURIComponent(value);
};

/**
 * Return an unescaped value from an escaped URL.
 */
var unescape = function (value) {
  return decodeURIComponent(value);
};

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
var buildQueryString = function (
  object
) {
  var queryParams = [];
  forIn(object, function(key, value) {
    queryParams.push(escape(key) + '=' + escape(value));
  });
  return queryParams.join('&');
};

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
var getBrowserVersionOrZero = function (
  browserName
) {
  var match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent);
  return match ? +match[1] : 0;
};
/**
 * Return true if a variable is a given type.
 */
var isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
var isUndefined = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
var isBoolean = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
var isNumber = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
var isString = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
var isFunction = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
var isObject = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
var isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
var isArray = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Array);
};

/**
 * Return true if a variable is a date.
 */
var isDate = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Date);
};
/**
 * Get the current location host.
 */
var getHost = function () {
  return location.host;
};

/**
 * Get the base of the current URL.
 */
var getBaseUrl = function () {
  return location.protocol + '//' + getHost();
};

/**
 * Get the query parameters from a URL.
 */
var getQueryParams = function (
  url
) {
  url = url || location.href;
  var query = url.substr(url.indexOf('?') + 1).split('#')[0];
  var pairs = query.split('&');
  query = {};
  forEach(pairs, function (pair) {
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
var getHashParams = function (
  hash
) {
  hash = (hash || location.hash).replace(/^#/, '');
  return hash ? getQueryParams(hash) : {};
};
