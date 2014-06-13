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
  // If the argument is not a string, just assume it's already an element reference, and return it.
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
    var element = getElement(parentElement, selector.substr(1));
    elements = element ? [element] : [];
  }
  else {
    elements = getElementsByTagAndClass(parentElement, selector);
  }
  if (callback) {
    forEach(elements, callback);
  }
  return elements;
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
