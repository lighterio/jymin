/**
 * Execute a callback when the page loads.
 */
var onReady = window.onReady = function (
  callback
) {
  // If there's no queue, create it as a property of this function.
  var queue = ensureProperty(onReady, '_QUEUE', []);

  // If there's a callback, push it into the queue.
  if (callback) {

    // The first item in the queue causes onReady to be triggered.
    if (!getLength(queue)) {
      setTimeout(function () {
        onReady()
      }, 1);
    }

    // Put an item in the queue and wait.
    push(queue, callback);
  }

  // If there's no callback, onReady has been triggered, so run callbacks.
  else {
    forEach(queue, function (callback) {
      callback();
    });
  }
};
