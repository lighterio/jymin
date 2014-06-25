var ENTER_KEY = 13;
var SHIFT_KEY = 16;
var CTRL_KEY = 17;
var ALT_KEY = 18;
var COMMAND_KEY = 19;
var ESC_KEY = 27;
var SPACE_KEY = 32;
var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var LEFT_BUTTON = 1;
var MIDDLE_BUTTON = 2;
var RIGHT_BUTTON = 3;

var isDown = {};

bind(window, 'keydown keyup', function (element, event) {
  isDown[event.keyCode] = (event != 'keyup');
});

bind(window, 'mousedown mouseup', function (element, event) {
  isDown[event.which] = (event != 'mouseup');
});
