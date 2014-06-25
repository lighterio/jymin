/**
 * Return a history object.
 */
var getHistory = function () {
  var history = window.history || {};
  forEach(['push', 'replace'], function (key) {
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
var historyPush = function (
  href
) {
  getHistory().push(href);
};

/**
 * Replace the current item in the history.
 */
var historyReplace = function (
  href
) {
  getHistory().replace(href);
};

/**
 * Go back.
 */
var historyPop = function (
  href
) {
  getHistory().back();
};

/**
 * Listen for a history change.
 */
var onHistoryPop = function (
  callback
) {
  bind(window, 'popstate', callback);
};
