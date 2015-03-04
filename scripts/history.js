/**
 * Return a history object.
 */
Jymin.getHistory = function () {
  var history = window.history || {};
  Jymin.forEach(['push', 'replace'], function (key) {
    var fn = history[key + 'State'];
    history[key] = function (href) {
      if (fn) {
        fn.apply(history, [null, null, href]);
      } else {
        // TODO: Create a backward compatible history push.
      }
    };
  });
  return history;
};

/**
 * Push an item into the history.
 */
Jymin.historyPush = function (href) {
  Jymin.getHistory().push(href);
};

/**
 * Replace the current item in the history.
 */
Jymin.historyReplace = function (href) {
  Jymin.getHistory().replace(href);
};

/**
 * Go back.
 */
Jymin.historyPop = function () {
  Jymin.getHistory().back();
};

/**
 * Listen for a history change.
 */
Jymin.onHistoryPop = function (callback) {
  Jymin.bind(window, 'popstate', callback);
};
