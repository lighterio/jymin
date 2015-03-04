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
 * Get the parent of an element, or an ancestor with a specified tag name.
 *
 * @param  {HTMLElement} element   A element whose parent elements are being searched.
 * @param  {String}      selector  An optional selector to search up the tree.
 * @return {HTMLElement}           The parent or matching ancestor.
 */
Jymin.getParent = function (element, selector) {
  return Jymin.getTrail(element, selector)[1];
};

/**
 * Get the trail that leads back to the root, optionally filtered by a selector.
 *
 * @param  {HTMLElement} element   An element to start the trail.
 * @param  {String}      selector  An optional selector to filter the trail.
 * @return {Array}                 The array of elements in the trail.
 */
Jymin.getTrail = function (element, selector) {
  var trail = [element];
  while (element = element.parentNode) { // jshint ignore:line
    Jymin.push(trail, element);
  }
  if (selector) {
    var set = trail;
    trail = [];
    Jymin.all(selector, function (element) {
      if (set.indexOf(element) > -1) {
        Jymin.push(trail, element);
      }
    });
  }
  return trail;
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
    var tagAndAttributes = elementOrString.split('?');
    var tagAndClass = tagAndAttributes[0].split('.');
    var className = tagAndClass.slice(1).join(' ');
    var tagAndId = tagAndClass[0].split('#');
    var tagName = tagAndId[0];
    var id = tagAndId[1];
    var attributes = tagAndAttributes[1];
    var cachedElement = Jymin.createTag[tagName] || (Jymin.createTag[tagName] = Jymin.createTag(tagName));
    element = cachedElement.cloneNode(true);
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
      Jymin.setHtml(element, innerHtml);
    }
  }
  return element;
};

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The element that was added.
 */
Jymin.addElement = function (parentElement, elementOrString, innerHtml) {
  if (Jymin.isString(parentElement)) {
    elementOrString = parentElement;
    parentElement = document;
  }
  var element = Jymin.createElement(elementOrString, innerHtml);
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
  var element = Jymin.createElement(elementOrString);
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
 * Get an element's lowercase tag name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's tag name.
 */
Jymin.getTag = function (element) {
  return Jymin.lower(element.tagName);
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
 * Set the text of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to set.
 */
Jymin.setText = function (element, text) {
  Jymin.clearElement(element);
  Jymin.addText(element, text);
};

/**
 * Add text to an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to add.
 */
Jymin.addText = function (element, text) {
  Jymin.addElement(element, document.createTextNode(text));
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
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement}    parentElement  An optional element under which to find elements.
 * @param  {String}         selector       A simple selector for finding elements.
 * @param  {Function}       fn             An optional function to run on matching elements.
 * @return {HTMLCollection}                The matching elements (if any).
 */
Jymin.all = function (parentElement, selector, fn) {
  if (!selector || Jymin.isFunction(selector)) {
    fn = selector;
    selector = parentElement;
    parentElement = document;
  }
  var elements;
  //+browser:old
  elements = [];
  if (Jymin.contains(selector, ',')) {
    Jymin.forEach(selector, function (selector) {
      Jymin.all(parentElement, selector, function (element) {
        Jymin.push(elements, element);
      });
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
    selector = selector.split('.');
    var tagName = selector[0];
    var className = selector[1];
    var tagElements = parentElement.getElementsByTagName(tagName);
    Jymin.forEach(tagElements, function (element) {
      if (!className || Jymin.hasClass(element, className)) {
        Jymin.push(elements, element);
      }
    });
  }
  //-browser:old
  //+browser:ok
  elements = parentElement.querySelectorAll(selector);
  //-browser:ok
  if (fn) {
    Jymin.forEach(elements, fn);
  }
  return elements;
};

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @param  {Function}    fn             An optional function to run on a matching element.
 * @return {HTMLElement}                The matching element (if any).
 */
Jymin.one = function (parentElement, selector, fn) {
  if (!selector || Jymin.isFunction(selector)) {
    fn = selector;
    selector = parentElement;
    parentElement = document;
  }
  var element;
  //+browser:old
  element = Jymin.all(parentElement, selector)[0];
  //-browser:old
  //+browser:ok
  element = parentElement.querySelector(selector);
  //-browser:ok
  if (element && fn) {
    fn(element);
  }
  return element;
};


/**
 * Push new HTML into one or more selected elements.
 *
 * @param  {String} html     A string of HTML.
 * @param  {String} selector An optional selector (default: "body").
 */
Jymin.pushHtml = function (html, selector) {

  // Grab the new page title if there is one.
  var title = Jymin.getTagContents(html, 'title')[0];

  // If there's no target, we're replacing the body contents.
  if (!selector) {
    selector = 'body';
    html = Jymin.getTagContents(html, selector)[0];
  }

  // TODO: Implement a DOM diff.
  Jymin.all(selector || 'body', function (element) {

    // Set the HTML of an element.
    Jymin.setHtml(element, html);

    // If there's a title, set it.
    if (title) {
      document.title = title;
      Jymin.scrollTop(0);
    }
    Jymin.ready(element);
  });

  // Execute any scripts that are found.
  // TODO: Skip over JSX, etc.
  Jymin.getTagContents(html, 'script', Jymin.execute);
};
