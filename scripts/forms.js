/**
 * Get the value of a form element.
 *
 * @param  {HTMLElement}  input  A form element.
 * @return {String|Array}        The value of the form element (or array of elements).
 */
Jymin.getValue = function (input) {
  input = Jymin.getElement(input);
  if (input) {
    var type = input.type[0];
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
 *
 * @param  {HTMLElement}  input  A form element.
 * @return {String|Array}        A value or values to set on the form element.
 */
Jymin.setValue = function (input, value) {
  input = Jymin.getElement(input);
  if (input) {
    var type = input.type[0];
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        Jymin.forEach(value, function (optionValue) {
          selected[optionValue] = true;
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
