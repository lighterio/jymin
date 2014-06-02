/**
 *      _                 _                ___   _   ___
 *     | |_   _ _ __ ___ (_)_ __   __   __/ _ \ / | ( _ )
 *  _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | || | / _ \
 * | |_| | |_| | | | | | | | | | |  \ V /| |_| || || (_) |
 *  \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_)_(_)___/
 *        |___/
 *
 * http://lighter.io/jymin
 * MIT License
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/zerious/jymin/blob/master/scripts/ajax.js
 *   https://github.com/zerious/jymin/blob/master/scripts/animation.js
 *   https://github.com/zerious/jymin/blob/master/scripts/collections.js
 *   https://github.com/zerious/jymin/blob/master/scripts/cookies.js
 *   https://github.com/zerious/jymin/blob/master/scripts/dates.js
 *   https://github.com/zerious/jymin/blob/master/scripts/dom.js
 *   https://github.com/zerious/jymin/blob/master/scripts/events.js
 *   https://github.com/zerious/jymin/blob/master/scripts/forms.js
 *   https://github.com/zerious/jymin/blob/master/scripts/history.js
 *   https://github.com/zerious/jymin/blob/master/scripts/logging.js
 *   https://github.com/zerious/jymin/blob/master/scripts/numbers.js
 *   https://github.com/zerious/jymin/blob/master/scripts/strings.js
 *   https://github.com/zerious/jymin/blob/master/scripts/types.js
 *   https://github.com/zerious/jymin/blob/master/scripts/url.js
 */


this.jymin = {version: '0.1.8'};

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
var DEFAULT_ANIMATION_FRAME_COUNT = 40;
var DEFAULT_ANIMATION_FRAME_DELAY = 20;

/**
 * Perform an animation.
 */
var animate = function (
  element,          // string|DOMElement: Element or ID of element to animate.
  styleTransitions, // object:            cssText values to animate through.
  onFinish,         // function|:         Callback to execute when animation is complete.
  frameCount,       // integer|:          Number of frames to animate through. (Default: 40)
  frameDelay,       // integer|:          Number of milliseconds between frames. (Default: 20ms)
  frameIndex        // integer|:          Index of the frame to start on. (Default: 0)
) {
  if (element = getElement(element)) {
    // Only allow one animation on an element at a time.
    stopAnimation(element);
    frameIndex = frameIndex || 0;
    frameCount = frameCount || DEFAULT_ANIMATION_FRAME_COUNT;
    frameDelay = frameDelay || DEFAULT_ANIMATION_FRAME_DELAY;
    var scale = Math.atan(1.5) * 2;
    var fraction = Math.atan(frameIndex / frameCount * 3 - 1.5) / scale + 0.5;
    var styles = {};
    forIn(styleTransitions, function(transition, key) {
      var start = transition[0];
      var end = transition[1];
      var value;
      if (isNaN(start)) {
        value = frameIndex ? end : start;
      }
      else {
        value = (1 - fraction) * start + fraction * end;
      }
      styles[key] = value;
    });
    extendStyle(element, styles);
    if (frameIndex < frameCount) {
      element.animation = setTimeout(function() {
        animate(element, styleTransitions, onFinish, frameCount, frameDelay, frameIndex + 1);
      });
    }
    else if (onFinish) {
      onFinish(element);
    }
  }
};

/**
 * Stop an animation on a given DOM element.
 */
var stopAnimation = function (
  element // string|DOMElement: Element or ID of element to cancel the animation on.
) {
  if (element = getElement(element)) {
    clearTimeout(element.animation);
  }
};
/**
 * Iterate over an array, and call a function on each item.
 */
var forEach = function (
  array,   // Array*:    The array to iterate over.
  callback // Function*: The function to call on each item. `callback(item, index, array)`
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
 * Iterate over an object's keys, and call a function on each key value pair.
 */
var forIn = function (
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
    forIn(decorations, function (value, key) {
      object[key] = value;
    });
    }
    return object;
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
  return isInstance(array) ? array[0] : undefined;
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
var pushItem = function (
  array, // Array: The array to push the item into.
  item   // mixed: The item to push.
) {
  if (isArray(array)) {
    array.push(item);
  }
  return item;
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
      paddingValue = isDefined(paddingValue) ? paddingValue : '';
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
 * Get a DOM element by its ID (if the argument is an ID).
 * If you pass in a DOM element, it just returns it.
 * This can be used to ensure that you have a DOM element.
 */
var getElement = function (
  id,           // string|DOMElement*: DOM element or ID of a DOM element.
  parentElement // DOMElement:         Document or DOM element for getElementById. (Default: document)
) {
  // If the argument is not a string, just assume it's already an element reference, and return it.
  return isString(id) ? (parentElement || document).getElementById(id) : id;
};

/**
 * Get DOM elements that have a specified tag name.
 */
var getElementsByTagName = function (
  tagName,      // string:     Name of the tag to look for. (Default: "*")
  parentElement // DOMElement: Document or DOM element for getElementsByTagName. (Default: document)
) {
  parentElement = getElement(parentElement || document);
  return parentElement ? parentElement.getElementsByTagName(tagName || '*') : [];
};

/**
 * Get DOM elements that have a specified tag and class.
 */
var getElementsByTagAndClass = function (
  tagAndClass,
  parentElement
) {
  tagAndClass = tagAndClass.split('.');
  var tagName = (tagAndClass[0] || '*').toUpperCase();
  var className = tagAndClass[1];
  if (className) {
    parentElement = getElement(parentElement || document);
    var elements = [];
    if (parentElement.getElementsByClassName) {
      forEach(parentElement.getElementsByClassName(className), function(element) {
        if (element.tagName == tagName) {
          elements.push(element);
        }
      });
    }
    else {
      forEach(getElementsByTagName(tagName), function(element) {
        if (hasClass(element, className)) {
          elements.push(element);
        }
      });
    }
  }
  else {
    elements = getElementsByTagName(tagName, parentElement);
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
  if (tagName && parentElement) {
    if (parentElement.tagName != tagName) {
      parentElement = getParent(parentElement, tagName);
    }
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
  var cachedElement = addElement[tagName] || (addElement[tagName] = document.createElement(tagName));
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
      var key = keyAndValue[0];
      var value = keyAndValue[1];
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
 * Create a DOM element, and prepend it to a parent element.
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
  if (element = getElement(element)) {
    var index = 0;
    while (element = element.previousSibling) {
      ++index;
    }
    return index;
  }
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
 * Remove a DOM element from its parent.
 */
var removeElement = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
    // Set the element's innerText.
    element.innerHTML = text;
  }
};

/**
 * Get a DOM element's class name if the element can be found.
 */
var getClass = function (
  element
) {
  // Ensure that we have an element, not just an ID.
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  if (element = getElement(element)) {
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
  flipClass(element, className, !hasClass(element, className));
};

/**
 * Insert a call to an external JavaScript file.
 */
var insertScript = function (
  src,
  callback
) {
  var head = getElementsByTagName('head')[0];
  var script = addElement(0, 'script');
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
 * Bind a handler to listen for a particular event on an element.
 */
var bind = function (
  element,            // DOMElement|string*: Element or ID of element to bind to.
  eventName,          // string*:            Name of event (e.g. "click", "mouseover", "keyup").
  eventHandler,       // function*:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
  customData,         // object:             Custom data to pass through to the event handler when it's triggered.
  multiBindCustomData
) {
  // Allow multiple events to be bound at once using a space-delimited string.
  if (containsString(eventName, ' ')) {
    var eventNames = splitBySpaces(eventName);
    forEach(eventNames, function (singleEventName) {
      bind(element, singleEventName, eventHandler, customData, multiBindCustomData);
    });
    return;
  }

  // Ensure that we have an element, not just an ID.
  if (element = getElement(element)) {

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
        while (relatedTarget = getParent(relatedTarget)) {
          if (relatedTarget == target) {
            return;
          }
        }
      }
      return eventHandler(element, event, target, multiBindCustomData || customData);
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
  }
};

/**
 * Stop event bubbling.
 */
var stopEvent = function (
  event // object*: Event to be canceled.
) {
  event.cancelBubble = true;
  if (event.stopPropagation) {
    event.stopPropagation();
  }
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
 * Bind an event handler on an element that delegates to specified child elements.
 */
var on = function (
  element,
  tagAndClass,
  eventName,
  eventHandler,
  customData,
  multiBindCustomData
) {
  tagAndClass = tagAndClass.split('.');
  var tagName = tagAndClass[0].toUpperCase();
  var className = tagAndClass[1];
  var onHandler = function(element, event, target, customData) {
    if (!tagName || (target.tagName == tagName)) {
      if (!className || hasClass(target, className)) {
        return eventHandler(target, event, element, multiBindCustomData || customData);
      }
    }
    // Bubble up to find a tagAndClass match because we didn't find one this time.
    if (target = getParent(target)) {
      onHandler(element, event, target, customData);
    }
  };
  bind(element, eventName, onHandler, customData);
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
      element.focus();
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
  var key = usingString ? elementOrString : 'T';
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
    var type = input.type[0];
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (isBoolean(checked)) {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      forEach(options, function (option) {
        if (option.selected) {
          pushItem(value, option.value);
        }
      });
    }
    else if (type == 's') {
      value = options[input.selectedIndex].value;
    }
  }
  return value;
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
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (type == 's') {
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
      forEach(input.options, function (option) {
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
var pushHistory = function (
  href
) {
  getHistory().push(href);
};

/**
 * Push an item into the history.
 */
var replaceHistory = function (
  href
) {
  getHistory().replace(href);
};

/**
 * Go back.
 */
var popHistory = function (
  href
) {
  getHistory().back();
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
var ifConsole = function (method, arguments) {
  var console = window.console;
  if (console && console[method]) {
    console[method].apply(console, arguments);
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
var containsString = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) > -1;
};

/**
 * Trim the whitespace from a string.
 */
var trimString = function (
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
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
var buildQueryString = function (
  object
) {
  var queryParams = [];
  forIn(object, function(value, key) {
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
// Make an undefined value available.
var undefined = window.undefined;

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
