/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
Jymin.forIn = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(key, object[key], object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an object's keys, and call a function on each (value, key) pair.
 */
Jymin.forOf = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(object[key], key, object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Decorate an object with properties from another object.
 */
Jymin.decorateObject = function (object, decorations) {
  if (object && decorations) {
    Jymin.forIn(decorations, function (key, value) {
      object[key] = value;
    });
  }
  return object;
};

/**
 * Ensure that a property exists by creating it if it doesn't.
 */
Jymin.ensureProperty = function (object, property, defaultValue) {
  var value = object[property];
  if (!value) {
    value = object[property] = defaultValue;
  }
  return value;
};
