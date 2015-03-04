/**
 * Get the local storage object.
 *
 * @return {Object}  The local storage object.
 */
Jymin.getStorage = function () {
  return window.localStorage;
};

/**
 * Fetch an item from local storage.
 *
 * @param  {String} key  A key to fetch an object by
 * @return {Any}         The object that was fetched and deserialized
 */
Jymin.fetch = function (key) {
  var storage = Jymin.getStorage();
  return storage ? Jymin.parse(storage.getItem(key)) : 0;
};

/**
 * Store an item in local storage.
 *
 * @param  {String} key    A key to store and fetch an object by
 * @param  {Any}    value  A value to be stringified and stored
 */
Jymin.store = function (key, value) {
  var storage = Jymin.getStorage();
  if (storage) {
    storage.setItem(key, Jymin.stringify(value));
  }
};
