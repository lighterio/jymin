/**
 * Create an event emitter object, lazily loading its prototype.
 */
Jymin.Emitter = function () {
  this._events = {};
  if (!this._on) {
    Jymin.decorateObject(Jymin.Emitter.prototype, Jymin.EmitterPrototype);
  }
};

/**
 * Expose Emitter methods which can be applied lazily.
 */
Jymin.EmitterPrototype = {

  _on: function (event, fn) {
    var self = this;
    var events = self._events;
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
    var listeners = self._events[event] || [];
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

  _removeAllListeners: function (event) {
    var self = this;
    var events = self._events;
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
