/**
 * A Type is an extendable object whose instances are constructed with _INIT.
 */

// The default constructor does nothing.
var Type = function () {};

/**
 * Extend a Type, to create a new Type with properties decorated onto it.
 */
Type._EXTEND = function (properties) {

  // Create the constructor, using a new or inherited `_INIT` method.
  var type = properties_INIT || function () {
    if (this_INIT) {
      this_INIT.apply(this, arguments);
    }
  };

  // Copy the parent and its prototype.
  var parent = type.parent = this;
  Type._DECORATE(type, parent);
  Type._DECORATE(getPrototype(type), getPrototype(parent));

  // Copy the properties that extend the parent.
  Type._DECORATE(getPrototype(type), properties);

  return type;
};

/**
 * Decorate an object with specified properties or prototype properties.
 */
Type._DECORATE = function (object, properties) {
  properties = properties || getPrototype(this);
  for (var key in properties) {
    object[key] = properties[key];
  }
  return object;
};

/**
 * Return an object's prototype.
 */
var getPrototype = function (type) {
  return type.prototype;
};
