/**
 * An Emitter is an EventEmitter-style object.
 */
var Emitter = function () {
  // Lazily apply the prototype so that Emitter can minify out if not used.
  Emitter.prototype = EmitterPrototype;
};

/**
 * Expose Emitter methods which can be applied lazily.
 */
var EmitterPrototype = {

  _ON: function (event, fn) {
    var self = this;
    var events = self._EVENTS || (self._EVENTS = {});
    var listeners = events[event] || (events[event] = []);
    listeners.push(fn);
    return self;
  },

  _ONCE: function (event, fn) {
    var self = this;
    function f() {
      fn.apply(self, arguments);
      self._REMOVE_LISTENER(event, f);
    }
    self._ON(event, f);
    return self;
  },

  _EMIT: function (event) {
    var self = this;
    var listeners = self._LISTENERS(event);
    var args = Array.prototype.slice.call(arguments, 1);
    forEach(listeners, function (listener) {
      listener.apply(self, args);
    });
    return self;
  },

  _LISTENERS: function (event) {
    var self = this;
    var events = self._EVENTS || 0;
    var listeners = events[event] || [];
    return listeners;
  },

  _REMOVE_LISTENER: function (event, fn) {
    var self = this;
    var listeners = self._LISTENERS(event);
    var i = listeners.indexOf(fn);
    if (i > -1) {
      listeners.splice(i, 1);
    }
    return self;
  },

  _REMOVE_ALL_LISTENERS: function (event, fn) {
    var self = this;
    var events = self._EVENTS || {};
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
