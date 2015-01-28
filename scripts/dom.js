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
