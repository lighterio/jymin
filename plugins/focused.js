var focusedElement;

Jymin.on('a,button,input,select,textarea', 'focus', function (element) {
  var focusMethod = element.focus;
  if (focusMethod) {
    focusedElement = element;
    Jymin.removeTimeout(focusMethod);
  }
});

Jymin.on('a,button,input,select,textarea', 'blur', function (element) {
  var focusMethod = element.focus;
  if (focusMethod) {
    Jymin.setTimer(focusMethod, function () {
      if (focusedElement == element) {
        focusedElement = null;
      }
    });
  }
});
