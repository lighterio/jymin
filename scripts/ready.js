/**
 * Execute a function when the page loads or new content is added.
 *
 * @param  {Function}  fn  A function which will receive a ready element.
 */
Jymin.onReady = function (fn) {

  // If the document is ready, run the function now.
  if (document._isReady) {
    fn(document);
  }

  // Otherwise, bind the ready handler.
  else {
    Jymin.bindReady(document, function () {
      Jymin.trigger(document, 'ready');
    });
  }

  // Bind to the document's Jymin-triggered ready event.
  Jymin.bind(document, 'ready', fn);
};

/**
 * Bind to the appropriate ready event for an element.
 * This works for the document as well as for scripts.
 *
 * @param  {HTMLElement} element  An element to bind to.
 * @param  {Function}    fn       A function to run when the element is ready.
 */
Jymin.bindReady = function (element, fn) {

  // Create a listener that replaces itself so it will only run once.
  var onLoad = function () {
    if (Jymin.isReady(element)) {
      onLoad = Jymin.doNothing;
      window.onload = element.onload = element.onreadystatechange = null;
      fn(element);
    }
  };

  // Bind to the document in MSIE8, or scripts in other browsers.
  Jymin.bind(element, 'readystatechange', onLoad);
  if (element == document) {
    // Bind to the document in newer browsers.
    Jymin.bind(element, 'DOMContentLoaded', onLoad);
  }
  // Fall back.
  Jymin.bind(element == document ? window : element, 'load', onLoad);
};

/**
 * Declare an object to be ready, and run events that have been bound to it.
 *
 * @param  {Any} thing  An HTMLElement or other object.
 */
Jymin.ready = function (thing) {
  thing._isReady = 1;
  Jymin.trigger(thing, 'ready');
};

/**
 * Check if a document, iframe, script or AJAX response is ready.
 * @param  {Object}  object [description]
 * @return {Boolean}        [description]
 */
Jymin.isReady = function (object) {
  // AJAX requests have readyState 4 when loaded.
  // All documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  // In non-IE browsers, we can bind to script.onload instead of checking script.readyState.
  return /(4|complete|scriptloaded)$/.test('' + object.tagName + object.readyState);
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
  var head = Jymin.all('head')[0];
  var script = Jymin.addElement(head, 'script');
  if (fn) {
    Jymin.bindReady(script, fn);
  }
  script.src = src;
};
