/**
 * Execute a fn when the page loads.
 * @param  {function|Object} fnOrElement
 * @return {[type]}                   [description]
 */
Jymin.onReady = window._onReady = function (fnOrElement) {
  // If there's no queue, create it as a property of this function.
  var queue = Jymin.ensureProperty(Jymin.onReady, '_queue', []);

  // If there's a function, push it into the queue.
  if (typeof fnOrElement == 'function') {

    // The 1st function makes schedules onReady, if not waiting for scripts.
    if (!Jymin.getLength(queue)) {

      // In production, there should be a single script, therefore no wait.
      var waitingForScripts = false;

      // In development, individual scripts might still be loading.
      //+env:dev,debug
      waitingForScripts = window._waitingForScripts;
      //-env:dev,debug

      if (!waitingForScripts) {
        // At the next tick, we've excuted this whole script.
        Jymin.addTimeout(Jymin.onReady, Jymin.onReady, 1);
      }
    }

    // Put an item in the queue and wait.
    Jymin.push(queue, fnOrElement);
  }

  // If there's no function, Jymin.onReady has been triggered, so run functions.
  else {
    Jymin.forEach(queue, function (fn) {
      fn(fnOrElement || document);
    });
  }
};
