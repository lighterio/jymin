/**
 * A Type is an extendable object whose instances are constructed with _init.
 */

// The default constructor does nothing.
var Type = function () {};

/**
 * Extend a Type, to create a new Type with properties decorated onto it.
 */
Type._extend = function (properties) {

  // Create the constructor, using a new or inherited `_init` method.
  var type = properties_init || function () {
    if (this_init) {
      this_init.apply(this, arguments);
    }
  };

  // Copy the parent and its prototype.
  var parent = type.parent = this;
  Type._decorate(type, parent);
  Type._decorate(getPrototype(type), getPrototype(parent));

  // Copy the properties that extend the parent.
  Type._decorate(getPrototype(type), properties);

  return type;
};

/**
 * Decorate an object with specified properties or prototype properties.
 */
Type._decorate = function (object, properties) {
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
