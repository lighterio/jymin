/**
 * Bind a handler to listen for a particular event on an element.
 */
var bind = function (
  element,            // DOMElement|string: Element or ID of element to bind to.
  eventName,          // string:            Name of event (e.g. "click", "mouseover", "keyup").
  eventHandler,       // function:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
  customData,         // object|:           Custom data to pass through to the event handler when it's triggered.
  multiBindCustomData
) {
  // Allow multiple events to be bound at once using a space-delimited string.
  if (contains(eventName, ' ')) {
    var eventNames = splitBySpaces(eventName);
    forEach(eventNames, function (singleEventName) {
      bind(element, singleEventName, eventHandler, customData, multiBindCustomData);
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

    var handlers = (element._HANDLERS = element._HANDLERS || {});
    var queue = (handlers[eventName] = handlers[eventName] || []);
    push(queue, eventHandler);
  }
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
    target = element;
  }
  var handlers = element._HANDLERS;
  if (handlers) {
    var queue = handlers[event.type];
    forEach(queue, function (callback) {
      callback(element, event, target, customData);
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
  event.cancelBubble = true;
  if (event.stopPropagation) {
    event.stopPropagation();
  }
};

/**
 * Prevent the default action for this event.
 */
var preventDefault = function (
  event // object: Event to prevent from doing its default action.
) {
  event.preventDefault();
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
    target = getParent(target);
    if (target) {
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
      var focusMethod = element.focus;
      if (focusMethod) {
        focusMethod.call(element);
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
