
// JavaScript reserved words.
var reservedWordPattern = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;

//+env:browser

/**
 * Create JSON that doesn't necessarily have to be strict.
 */
var stringify = function (data, strict, stack) {
  if (isString(data)) {
    data = '"' + data.replace(/\n\r"/g, function (c) {
      return c == '\n' ? '\\n' : c == '\r' ? '\\r' : '\\"';
    }) + '"';
  }
  else if (isFunction(data)) {
    data = data.toString();
    if (strict) {
      data = stringify(data);
    }
  }
  else if (isDate(data)) {
    data = 'new Date(' + getTime(data) + ')';
    if (strict) {
      data = stringify(data);
    }
  }
  else if (data && isObject(data)) {
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
        if (strict || reservedWordPattern.test(key) || /(^\d|[^\w$])/.test(key)) {
          key = '"' + key + '"';
        }
        push(parts, key + ':' + stringify(value, strict, stack));
      });
    }
    pop(stack);
    data = before + parts.join(',') + after;
  }
  else {
    data = '' + data;
  }
  return data;
};

/**
 * Parse JavaScript and return a value.
 */
var parse = function (value) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value);
    value = evil.J;
  }
  catch (e) {
    //+env:debug
    error('[Jymin] Could not parse JS: ' + value);
    //-env:debug
  }
  return value;
};

/**
 * Execute JavaScript.
 */
var execute = function (text) {
  parse('0;' + text);
};

/**
 * Parse a value and return a boolean no matter what.
 */
var parseBoolean = function (value, alternative) {
  value = parse(value);
  return isBoolean(value) ? value : (alternative || false);
};

/**
 * Parse a value and return a number no matter what.
 */
var parseNumber = function (value, alternative) {
  value = parse(value);
  return isNumber(value) ? value : (alternative || 0);
};

/**
 * Parse a value and return a string no matter what.
 */
var parseString = function (value, alternative) {
  value = parse(value);
  return isString(value) ? value : (alternative || '');
};

/**
 * Parse a value and return an object no matter what.
 */
var parseObject = function (value, alternative) {
  value = parse(value);
  return isObject(value) ? value : (alternative || {});
};

/**
 * Parse a value and return a number no matter what.
 */
var parseArray = function (value, alternative) {
  value = parse(value);
  return isObject(value) ? value : (alternative || []);
};

//-env:browser
