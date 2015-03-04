Jymin.FOCUS = 'focus';
Jymin.BLUR = 'blur';
Jymin.CLICK = 'click';
Jymin.MOUSEDOWN = 'mousedown';
Jymin.MOUSEUP = 'mouseup';
Jymin.MOUSEOVER = 'mouseover';
Jymin.MOUSEOUT = 'mouseout';
Jymin.KEYDOWN = 'keydown';
Jymin.KEYUP = 'keyup';
Jymin.KEYPRESS = 'keypress';

Jymin.CANCEL_BUBBLE = 'cancelBubble';
Jymin.PREVENT_DEFAULT = 'preventDefault';
Jymin.STOP_PROPAGATION = 'stopPropagation';
Jymin.ADD_EVENT_LISTENER = 'addEventListener';
Jymin.ATTACH_EVENT = 'attachEvent';
Jymin.ON = 'on';

/**
 * Bind an event listener for one or more events on an element.
 *
 * @param  {HTMLElement}  element  An element to bind an event listener to.
 * @param  {string|Array} events   An array or comma-delimited string of event names.
 * @param  {function}     listener  A function to run when the event occurs or is triggered: `listener(element, event, target)`.
 */
Jymin.bind = function (element, events, listener) {
  Jymin.forEach(events, function (event) {

    // Invoke the event listener with the event information and the target element.
    var fn = function (event) {
      // Fall back to window.event for IE.
      event = event || window.event;
      // Fall back to srcElement for IE.
      var target = event.target || event.srcElement;
      // Make sure this isn't a text node in Safari.
      if (target.nodeType == 3) {
        target = Jymin.getParent(target);
      }
      listener(element, event, target);
    };

    // Bind for emitting.
    var events = (element._events = element._events || {});
    var listeners = (events[event] = events[event] || []);
    Jymin.push(listeners, listener);

    // Bind using whatever method we can use.
    var method = Jymin.ADD_EVENT_LISTENER;
    var key;
    if (element[method]) {
      element[method](event, fn, true);
    }
    else {
      method = Jymin.ATTACH_EVENT;
      key = Jymin.ON + event;
      if (element[method]) {
        element[method](key, fn);
      }
    }
  });
};

/**
 * Bind a listener to an element to receive bubbled events from descendents matching a selector.
 *
 * @param  {HTMLElement}  element   The element to bind a listener to.
 * @param  {String}       selector  The selector for descendents.
 * @param  {String|Array} events    A list of events to listen for.
 * @param  {function} listener      A function to call on an element, event and descendent.
 */
Jymin.on = function (element, selector, events, listener) {
  if (Jymin.isFunction(events)) {
    listener = events;
    events = selector;
    selector = element;
    element = document;
  }
  Jymin.bind(element, events, function (element, event, target) {
    var trail = Jymin.getTrail(target, selector);
    Jymin.forEach(trail, function (element) {
      listener(element, event, target);
      return !event[Jymin.CANCEL_BUBBLE];
    });
  });
};

/**
 * Trigger an event on an element, and bubble it up to parent elements.
 *
 * @param  {HTMLElement}  element  Element to trigger an event on.
 * @param  {Event|string} event    Event or event type to trigger.
 * @param  {HTMLElement}  target   Fake target.
 */
Jymin.trigger = function (element, event, target) {
  if (element) {
    var type = event.type;
    event = type ? event : {type: (type = event)};
    event._triggered = true;
    target = target || element;

    var listeners = (element._events || 0)[type];
    Jymin.forEach(listeners, function (fn) {
      fn(element, event, target);
    });
    if (!event[Jymin.CANCEL_BUBBLE]) {
      Jymin.trigger(element.parentNode, event, target);
    }
  }
};

/**
 * Stop an event from bubbling up the DOM.
 *
 * @param  {Event} event  Event to stop.
 */
Jymin.stopPropagation = function (event) {
  (event || 0)[Jymin.CANCEL_BUBBLE] = true;
  Jymin.apply(event, Jymin.STOP_PROPAGATION);
};

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Jymin.preventDefault = function (event) {
  Jymin.apply(event, Jymin.PREVENT_DEFAULT);
};

/**
 * Focus on a specified element.
 *
 * @param  {HTMLElement} element  The element to focus on.
 */
Jymin.focusElement = function (element) {
  Jymin.apply(element, Jymin.FOCUS);
};
