/**
 * Create JSON that doesn't necessarily have to be strict.
 */
var stringify = function (data, strict, stack) {
  var reserved = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;
  if (data === null) {
    data = 'null';
  }
  else if (isFunction(data)) {
    if (strict) {
      data = '-1';
    }
    else {
      data = ensureString(data).replace(/^function \(/, 'function(');
    }
  }
  else if (isDate(data)) {
    if (strict) {
      data = '"' + getIsoDate() + '"';
    }
    else {
      data = 'new Date(' + getTime(data) + ')';
    }
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
    var before, after;
    if (isArray(data)) {
      before = '[';
      after = ']';
      forEach(data, function (value) {
        push(parts, stringify(value, strict, stack));
      });
    }
    else {
      before = '{';
      after = '}';
      forIn(data, function (key, value) {
        if (strict || reserved.test(key)) {
          key = '"' + key + '"';
        }
        push(parts, key + ':' + stringify(value, strict, stack));
      });
    }
    pop(stack);
    data = before + parts.join(',') + after;
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
  if (text[0] == '{' || text[0] == '[') {
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
