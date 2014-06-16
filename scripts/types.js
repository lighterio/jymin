/**
 * Return true if a variable is a given type.
 */
var isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
var isUndefined = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
var isBoolean = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
var isNumber = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
var isString = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
var isFunction = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
var isObject = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
var isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
var isArray = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Array);
};

/**
 * Return true if a variable is a date.
 */
var isDate = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Date);
};

/**
 * Create a not-strictly-JSON string.
 */
var stringify = function (data, stack) {
  var reserved = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;
  if (data === null) {
    data = 'null';
  }
  else if (isFunction(data)) {
    data = ensureString(data).replace(/^function \(/, 'function(');
  }
  else if (isDate(data)) {
    data = 'new Date(' + getTime(data) + ')';
  }
  else if (isObject(data)) {
    stack = stack || [];
    var isCircular = false;
    forEach(stack, function (item, index) {
      if (item == data) {
        isCircular = true;
      }
    });
    if (isCircular) {
      return null;
    }
    push(stack, data);
    var parts = [];
    if (isArray(data)) {
      forEach(data, function (value) {
        push(parts, stringify(value, stack));
      });
    }
    else {
      forIn(data, function (key, value) {
        if (reserved.test(key)) {
          key = '"' + key + '"';
        }
        push(parts, key + ':' + stringify(value, stack));
      });
    }
    pop(stack);
    data = '{' + parts.join(',') + '}';
  }
  else if (isString(data) && stack) {
    data = '"' + data.replace(/"/g, '\\"') + '"';
  }
  else {
    data = '' + data;
  }
  return data;
};

/**
 * Parse JavaScript.
 */
var parse = function (text) {
  if (text[0] == '{') {
    try {
      var evil = window.eval; // jshint ignore:line
      evil('eval.J=' + text);
      text = evil.J;
    }
    catch (e) {
      //+env:debug
      error('[Jymin] Could not parse JS: "' + text + '"');
      //-env:debug
    }
  }
  return text;
};

/**
 * Execute JavaScript.
 */
var execute = function (text) {
  parse('0;' + text);
};
