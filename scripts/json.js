// JavaScript reserved words.
Jymin.reservedWordPattern = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;

/**
 * Create JSON that doesn't necessarily have to be strict.
 */
Jymin.stringify = function (data, strict, stack) {
  if (Jymin.isString(data)) {
    data = '"' + data.replace(/\n\r"/g, function (c) {
      return c == '\n' ? '\\n' : c == '\r' ? '\\r' : '\\"';
    }) + '"';
  }
  else if (Jymin.isFunction(data)) {
    data = data.toString();
    if (strict) {
      data = Jymin.stringify(data);
    }
  }
  else if (Jymin.isDate(data)) {
    data = 'new Date(' + Jymin.getTime(data) + ')';
    if (strict) {
      data = Jymin.stringify(data);
    }
  }
  else if (data && Jymin.isObject(data)) {
    stack = stack || [];
    var isCircular = false;
    Jymin.forEach(stack, function (item, index) {
      if (item == data) {
        isCircular = true;
      }
    });
    if (isCircular) {
      return null;
    }
    Jymin.push(stack, data);
    var parts = [];
    var before, after;
    if (Jymin.isArray(data)) {
      before = '[';
      after = ']';
      Jymin.forEach(data, function (value) {
        Jymin.push(parts, Jymin.stringify(value, strict, stack));
      });
    }
    else {
      before = '{';
      after = '}';
      Jymin.forIn(data, function (key, value) {
        if (strict || Jymin.reservedWordPattern.test(key) || /(^\d|[^\w$])/.test(key)) {
          key = '"' + key + '"';
        }
        Jymin.push(parts, key + ':' + Jymin.stringify(value, strict, stack));
      });
    }
    Jymin.pop(stack);
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
Jymin.parse = function (value) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value);
    return evil.J;
  }
  catch (e) {
    //+env:debug
    Jymin.error('[Jymin] Could not parse JS: ' + value);
    //-env:debug
  }
};

/**
 * Execute JavaScript.
 */
Jymin.execute = function (text) {
  Jymin.parse('0;' + text);
};

/**
 * Parse a value and return a boolean no matter what.
 */
Jymin.parseBoolean = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isBoolean(value) ? value : (alternative || false);
};

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseNumber = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isNumber(value) ? value : (alternative || 0);
};

/**
 * Parse a value and return a string no matter what.
 */
Jymin.parseString = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isString(value) ? value : (alternative || '');
};

/**
 * Parse a value and return an object no matter what.
 */
Jymin.parseObject = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isObject(value) ? value : (alternative || {});
};

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseArray = function (value, alternative) {
  value = Jymin.parse(value);
  return Jymin.isObject(value) ? value : (alternative || []);
};
