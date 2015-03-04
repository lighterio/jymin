var lastChangedElement;
Jymin.setTimer(function () {

  Jymin.onReady(function (readyElement) {
    Jymin.all(readyElement, 'input,select,textarea', function (input) {
      input._originalValue = Jymin.getValue(input);
    });
  });

  Jymin.on('input,select,textarea', 'mouseup keyup change', function (input) {
    var isChanged = (Jymin.getValue(input) != input._originalValue);
    input._changed = isChanged;
    if (isChanged) {
      lastChangedElement = input;
    }
  });

});
