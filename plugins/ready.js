/**
 * Execute a callback when the page loads.
 */
var onReady = window._ON_READY = function (
  callbackOrElement
) {
  // If there's no queue, create it as a property of this function.
  var queue = ensureProperty(onReady, '_QUEUE', []);

  // If there's a callback, push it into the queue.
  if (typeof callbackOrElement == 'function') {

    // The 1st callback makes schedules onReady, if not waiting for scripts.
    if (!getLength(queue)) {

      // In production, there should be a single script, therefore no wait.
      var waitingForScripts = false;

      // In development, individual scripts might still be loading.
      //+env:dev,debug
      waitingForScripts = window._WAITING_FOR_SCRIPTS;
      //-env:dev,debug

      if (!waitingForScripts) {
        // At the next tick, we've excuted this whole script.
        addTimeout(onReady, onReady, 1);
      }
    }

    // Put an item in the queue and wait.
    push(queue, callbackOrElement);
  }

  // If there's no callback, onReady has been triggered, so run callbacks.
  else {
    forEach(queue, function (callback) {
      callback(callbackOrElement || document);
    });
  }
};
