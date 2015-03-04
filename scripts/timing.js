/**
 * Set or reset a timeout or interval, and save it for possible cancellation.
 * The timer can either be added to the setTimer method itself, or it can
 * be added to an object provided (such as an HTMLElement).
 *
 * @param {Object|String} objectOrString  An object to bind a timer to, or a name to call it.
 * @param {Function}      fn              A function to run if the timer is reached.
 * @param {Integer}       delay           An optional delay in milliseconds.
 */
Jymin.setTimer = function (objectOrString, fn, delay, isInterval) {
  var useString = Jymin.isString(objectOrString);
  var object = useString ? Jymin.setTimer : objectOrString;
  var key = useString ? objectOrString : '_timeout';
  clearTimeout(object[key]);
  if (fn) {
    if (Jymin.isUndefined(delay)) {
      delay = 9;
    }
    object[key] = (isInterval ? setInterval : setTimeout)(fn, delay);
  }
};

/**
 * Remove a timer from an element or from the Jymin.setTimer method.
 *
 * @param {Object|String} objectOrString  An object or a timer name.
 */
Jymin.clearTimer = function (objectOrString) {
  Jymin.setTimer(objectOrString);
};
