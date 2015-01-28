/**
 * Get the type of a form element.
 */
Jymin.getType = function (input) {
  return Jymin.ensureString(input.type)[0];
};

/**
 * Get the value of a form element.
 */
Jymin.getValue = function (
  input
) {
  input = Jymin.getElement(input);
  if (input) {
    var type = Jymin.getType(input);
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (type == 'c' || type == 'r') {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      Jymin.forEach(options, function (option) {
        if (option.selected) {
          Jymin.push(value, option.value);
        }
      });
    }
    else if (options) {
      value = Jymin.getValue(options[input.selectedIndex]);
    }
    return value;
  }
};

/**
 * Set the value of a form element.
 */
Jymin.setValue = function (
  input,
  value
) {
  input = Jymin.getElement(input);
  if (input) {
    var type = Jymin.getType(input);
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        if (!Jymin.isArray(value)) {
          value = Jymin.splitByCommas(value);
        }
        Jymin.forEach(value, function (val) {
          selected[val] = true;
        });
      }
      else {
        selected[value] = true;
      }
      value = Jymin.isArray(value) ? value : [value];
      Jymin.forEach(options, function (option) {
        option.selected = !!selected[option.value];
      });
    }
    else {
      input.value = value;
    }
  }
};
