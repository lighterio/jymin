/**
 * Get the contents of a specified type of tag within a string of HTML.
 *
 * @param  {String}   html    [description]
 * @param  {String}   tagName [description]
 * @param  {Function} fn      [description]
 * @return {Array}           [description]
 */
Jymin.getTagContents = function (html, tagName, fn) {
  var pattern = new RegExp('<' + tagName + '.*?>([\\s\\S]*?)<\\/' + tagName + '>', 'gi');
  var contents = [];
  html.replace(pattern, function (match, content) {
    contents.push(content);
    if (fn) {
      fn(content);
    }
  });
  return contents;
};
