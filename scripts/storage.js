var storage = window.localStorage;

/**
 * Fetch an item from local storage.
 */
var fetch = function (key) {
  return storage ? parse(storage.getItem(key)) : 0;
};

/**
 * Store an item in local storage.
 */
var store = function (key, value) {
  if (storage) {
    storage.setItem(key, stringify(value));
  }
};
