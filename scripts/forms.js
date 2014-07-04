/**
 * Get the value of a form element.
 */
var getValue = function (
  input
) {
  input = getElement(input);
  if (input) {
    var type = ensureString(input.type)[0];
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (type == 'c' || type == 'r') {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      forEach(options, function (option) {
        if (option.selected) {
          push(value, option.value);
        }
      });
    }
    else if (options) {
      value = getValue(options[input.selectedIndex]);
    }
    return value;
  }
};

/**
 * Set the value of a form element.
 */
var setValue = function (
  input,
  value
) {
  input = getElement(input);
  if (input) {
    var type = input.type[0];
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        if (!isArray(value)) {
          value = splitByCommas(value);
        }
        forEach(value, function (val) {
          selected[val] = true;
        });
      }
      else {
        selected[value] = true;
      }
      value = isArray(value) ? value : [value];
      forEach(options, function (option) {
        option.selected = !!selected[option.value];
      });
    }
    else {
      input.value = value;
    }
  }
};
