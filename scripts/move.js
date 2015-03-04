/**
 * Scroll the top of the page to a specified Y position.
 *
 * @param  {Integer} top  A specified Y position, in pixels.
 */
Jymin.scrollTop = function (top) {
  document.body.scrollTop = (document.documentElement || 0).scrollTop = top;
};

/**
 * Scroll the top of the page to a specified named anchor.
 *
 * @param  {String} name  The name of an HTML anchor.
 * @return {String}
 */
Jymin.scrollToAnchor = function (name) {
  var offset = 0;
  var element;
  //+browser:old
  Jymin.all('a', function (anchor) {
    if (anchor.name == name) {
      element = anchor;
    }
  });
  //-browser:old
  //+browser:ok
  element = Jymin.all('a[name=' + name + ']')[0];
  //-browser:ok
  while (element) {
    offset += element.offsetTop || 0;
    element = element.offsetParent || 0;
  }
  Jymin.scrollTop(offset - (Jymin.body._.offsetTop || 0));
};
