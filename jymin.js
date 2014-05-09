/**
 *      _                 _                ___   _   _____ 
 *     | |_   _ _ __ ___ (_)_ __   __   __/ _ \ / | |___ / 
 *  _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | || |   |_ \ 
 * | |_| | |_| | | | | | | | | | |  \ V /| |_| || |_ ___) |
 *  \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_)_(_)____/ 
 *        |___/                                            
 *
 * http://lighter.io/jymin
 * MIT License
 *
 * If you're seeing this, you haven't minified yet!
 */


/**
 * Empty handler.
 */
var doNothing = function doNothing() {};


/**
 * Make an AJAX request, and handle it with success or failure.
 * @return boolean: True if AJAX is supported.
 */
function getResponse(
	url,       // string*:  The URL to request data from.
	data,      // object:   Data to post. The method is automagically "POST" if data is truey, otherwise "GET".
	onSuccess, // function: Callback to run on success. `onSuccess(response, request)`.
	onFailure, // function: Callback to run on failure. `onFailure(response, request)`.
	evalJson   // boolean:  Whether to evaluate the response as JSON.
) {
	// If the optional data argument is omitted, shuffle it out.
	if (typeof data == 'function') {
		evalJson = onFailure;
		onFailure = onSuccess;
		onSuccess = data;
		data = 0;
	}
	var request;
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		request = new ActiveXObject('Microsoft.XMLHTTP');
	} else {
		return false;
	}
	if (request) {
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				var callback = request.status == 200 ? onSuccess || doNothing : onFailure || getResponse.onFailure;
				var response = request.responseText;
				if (evalJson) {
					try {
						eval('eval.J=' + response);
						response = eval.J;
					}
					catch (e) {
						log('ERROR: Could not parse JSON', response);
					}
				}
				callback(response, request);
			}
		};
		request.open(data ? 'POST' : 'GET', url, true);
		if (data) {
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		request.send(data || null);
	}
	return true;
}
getResponse.onFailure = doNothing;


/**
 * Request a JSON resource with a given URL.
 * @return boolean: True if AJAX is supported.
 */
function getJson(
	url,       // string*:  The URL to request data from.
	onSuccess, // function: Callback to run on success. `onSuccess(response, request)`.
	onFailure  // function: Callback to run on failure. `onFailure(response, request)`.
) {
	return getResponse(url, onSuccess, onFailure, true);
}


var DEFAULT_ANIMATION_FRAME_COUNT = 40;
var DEFAULT_ANIMATION_FRAME_DELAY = 20;

/**
 * Perform an animation.
 */
function animate(
	element,          // string|DOMElement*: Element or ID of element to animate.
	styleTransitions, // object*:            cssText values to animate through.
	onFinish,         // function:           Callback to execute when animation is complete.
	frameCount,       // integer:            Number of frames to animate through. (Default: 40)
	frameDelay,       // integer:            Number of milliseconds between frames. (Default: 20ms)
	frameIndex        // integer:            Index of the frame to start on. (Default: 0)
) {
    if (element = getElement(element)) {
        // Only allow one animation on an element at a time.
        stopAnimation(element);
        frameIndex = frameIndex || 0;
        frameCount = frameCount || DEFAULT_ANIMATION_FRAME_COUNT;
        frameDelay = frameDelay || DEFAULT_ANIMATION_FRAME_DELAY;
        var scale = Math.atan(1.5) * 2;
        var fraction = Math.atan(frameIndex / frameCount * 3 - 1.5) / scale + 0.5;
        var styles = {};
        forIn(styleTransitions, function(transition, key) {
            var start = transition[0];
            var end = transition[1];
            var value;
            if (isNaN(start)) {
                value = frameIndex ? end : start;
            }
            else {
                value = (1 - fraction) * start + fraction * end;
            }
            styles[key] = value;
        });
        extendStyle(element, styles);
        if (frameIndex < frameCount) {
            element.animation = setTimeout(function() {
                animate(element, styleTransitions, onFinish, frameCount, frameDelay, frameIndex + 1);
            });
        }
        else if (onFinish) {
            onFinish(element);
        }
    }
}


/**
 * Stop an animation on a given DOM element.
 */
function stopAnimation(
	element // string|DOMElement*: Element or ID of element to cancel the animation on.
) {
    if (element = getElement(element)) {
        clearTimeout(element.animation);
    }
}


/**
 * Iterate over an array, and call a function on each item.
 */
function forEach(
	array,   // Array*:    The array to iterate over.
	callback // function*: The function to call on each item. `callback(item, index, array)`
) {
    if (array) {
        for (var index = 0, length = array.length; index < length; index++) {
            var result = callback(array[index], index, array);
            if (result === false) {
                break;
            }
        }
    }
}


/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
function forIn(
	object,  // object*:   The object to iterate over.
	callback // function*: The function to call on each pair. `callback(value, key, object)`
) {
    if (object) {
        for (var key in object) {
            var result = callback(object[key], key, object);
            if (result === false) {
                break;
            }
        }
    }
}


/**
 * Decorate an object with properties from another object. If the properties
 */
function decorateObject(
	object,      // object*: The object to decorate.
	decorations  // object*: The object to iterate over.
) {
    if (object && decorations) {
		forIn(decorations, function (value, key) {
			object[key] = value;
		});
    }
    return object;
}


/**
 * Return all cookies.
 * @return object: Cookie names and values.
 */
function getAllCookies() {
	var str = document.cookie;
	var decode = decodeURIComponent;
	var obj = {};
	var pairs = str.split(/ *; */);
	var pair;
	if ('' == pairs[0]) return obj;
	for (var i = 0; i < pairs.length; ++i) {
		pair = pairs[i].split('=');
		obj[decode(pair[0])] = decode(pair[1]);
	}
	return obj;
}


/**
 * Get a cookie by name.
 * @return string: Cookie value.
 */
function getCookie(
	name // string*: Name of the cookie.
) {
	return getAllCookies()[name];
}


/**
 * Set a cookie.
 */
function setCookie(
	name,   // string*: Name of the cookie.
	value,  // string*: Value to set.
	options // object:  Name/value pairs for options including "maxage", "expires", "path", "domain" and "secure".
) {
	options = options || {};
	var encode = encodeURIComponent;
	var str = encode(name) + '=' + encode(value);
	if (null == value) {
		options.maxage = -1;
	}
	if (options.maxage) {
		options.expires = new Date(+new Date + options.maxage);
	}
	if (options.path) str += ';path=' + options.path;
	if (options.domain) str += ';domain=' + options.domain;
	if (options.expires) str += ';expires=' + options.expires.toUTCString();
	if (options.secure) str += ';secure';
	document.cookie = str;
}

/**
 * Delete a cookie.
 */
var deleteCookie = function deleteCookie(
	name   // string*: Name of the cookie.
) {
	setCookie(name, null);
}

/**
 * Get Unix epoch milliseconds from a date.
 * @return integer: Epoch milliseconds.
 */
function getTime(
	date // Date: Date object. (Default: now)
) {
	date = date || new Date();
	return date.getTime();
}

var $ = getElement;
var $$ = getElementsByTagAndClass;


/**
 * Get a DOM element by its ID (if the argument is an ID).
 * If you pass in a DOM element, it just returns it.
 * This can be used to ensure that you have a DOM element.
 */
function getElement(
	id,           // string|DOMElement*: DOM element or ID of a DOM element.
	parentElement // DOMElement:         Document or DOM element for getElementById. (Default: document)
) {
    // If the argument is not a string, just assume it's already an element reference, and return it.
    return typeof id == 'string' ? (fromDocument || document).getElementById(id) : id;
}


/**
 * Get DOM elements that have a specified tag name.
 */
function getElementsByTagName(
	tagName,      // string:     Name of the tag to look for. (Default: "*")
	parentElement // DOMElement: Document or DOM element for getElementsByTagName. (Default: document)
) {
    parentElement = getElement(parentElement || document);
    return parentElement ? parentElement.getElementsByTagName(tagName || '*') : [];
}


/**
 * Get DOM elements that have a specified tag and class.
 */
function getElementsByTagAndClass(tagAndClass, parentElement) {
    tagAndClass = tagAndClass.split('.');
    var tagName = (tagAndClass[0] || '*').toUpperCase();
    var className = tagAndClass[1];
    if (className) {
	    parentElement = getElement(parentElement || document);
	    var elements = [];
	    if (parentElement.getElementsByClassName) {
	        forEach(parentElement.getElementsByClassName(className), function(element) {
	            if (element.tagName == tagName) {
	                elements.push(element);
	            }
	        });
	    }
	    else {
	        forEach(getElementsByTagName(tagName), function(element) {
	            if (hasClass(element, className)) {
	                elements.push(element);
	            }
	        });
	    }
    }
    else {
    	elements = getElementsByTagName(tagName, parentElement);
    }
    return elements;
}


/**
 * Get the parent of a DOM element.
 */
function getParent(element, tagName) {
    var parentElement = (getElement(element) || {}).parentNode;
    // If a tag name is specified, keep walking up.
    if (tagName && parentElement) {
        if (parentElement.tagName != tagName) {
            parentElement = getParent(parentElement, tagName);
        }
    }
    return parentElement;
}


/**
 * Create a DOM element, and append it to a parent element.
 */
function addElement(parentElement, tagIdentifier, beforeSibling) {
	var tagAndAttributes = tagIdentifier.split('?');
	var tagAndClass = tagAndAttributes[0].split('.');
    var className = tagAndClass.slice(1).join(' ');
    var tagAndId = tagAndClass[0].split('#');
    var tagName = tagAndId[0] || 'div';
    var id = tagAndId[1];
    var attributes = tagAndAttributes[1];
    var cachedElement = addElement[tagName] || (addElement[tagName] = document.createElement(tagName));
    var element = cachedElement.cloneNode(true);
	if (id) {
		element.id = id;
	}
	if (className) {
		element.className = className;
	}
    if (parentElement) {
        insertChild(parentElement, element, beforeSibling);
    }
	// TODO: Do something less janky than using query string syntax (like Ltl).
    if (attributes) {
    	attributes = attributes.split('&');
	    forEach(attributes, function (attribute) {
	    	var keyAndValue = attribute.split('=');
	    	element.setAttribute(keyAndValue[0], keyAndValue[1]);
	    });
    }
    return element;
}


/**
 * Create a DOM element, and prepend it to a parent element.
 */
function prependElement(parentElement, tagIdentifier) {
	var beforeSibling = getFirstChild(parentElement);
	return addElement(parentElement, tagIdentifier, beforeSibling);
}


/**
 * Wrap an existing DOM element within a newly created one.
 */
function wrapElement(element, tagIdentifier) {
    var parentElement = getParent(element);
    var wrapper = addElement(parentElement, tagIdentifier, element);
    insertChild(wrapper, element);
    return wrapper;
}


/**
 * Return the children of a parent DOM element.
 */
function getChildren(parentElement) {
    return getElement(parentElement).childNodes;
}


/**
 * Return a DOM element's index with respect to its parent.
 */
function getIndex(element) {
    if (element = getElement(element)) {
        var index = 0;
        while (element = element.previousSibling) {
            ++index;
        }
        return index;
    }
}


/**
 * Append a child DOM element to a parent DOM element.
 */
function insertChild(parentElement, childElement, beforeSibling) {
    // Ensure that we have elements, not just IDs.
    parentElement = getElement(parentElement);
    childElement = getElement(childElement);
    if (parentElement && childElement) {
        // If the beforeSibling value is a number, get the (future) sibling at that index.
        if (typeof beforeSibling == 'number') {
            beforeSibling = getChildren(parentElement)[beforeSibling];
        }
        // Insert the element, optionally before an existing sibling.
        parentElement.insertBefore(childElement, beforeSibling || null);
    }
}


/**
 * Remove a DOM element from its parent.
 */
function removeElement(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Remove the element from its parent, provided that its parent still exists.
        var parentElement = getParent(element);
        if (parentElement) {
            parentElement.removeChild(element);
        }
    }
}


/**
 * Remove children from a DOM element.
 */
function removeChildren(element) {
    setHtml(element, '');
}


/**
 * Get a DOM element's inner HTML if the element can be found.
 */
function getHtml(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerHTML;
    }
}


/**
 * Set a DOM element's inner HTML if the element can be found.
 */
function setHtml(element, html) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerHTML.
        element.innerHTML = html;
    }
	return html;
}


/**
 * Get a DOM element's inner text if the element can be found.
 */
function getText(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerText;
    }
}


/**
 * Set a DOM element's inner text if the element can be found.
 */
function setText(element, text) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerText.
        element.innerHTML = text;
    }
	return text;
}


/**
 * Get a DOM element's class name if the element can be found.
 */
function getClass(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.className;
    }
}


/**
 * Set a DOM element's class name if the element can be found.
 */
function setClass(element, text) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerText.
        element.className = text;
    }
	return text;
}


/**
 * Get a DOM element's firstChild if the element can be found.
 */
function getFirstChild(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.firstChild;
    }
}


/**
 * Get a DOM element's previousSibling if the element can be found.
 */
function getPreviousSibling(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.previousSibling;
    }
}


/**
 * Get a DOM element's nextSibling if the element can be found.
 */
function getNextSibling(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
		return element.nextSibling;
    }
}


/**
 * Case-sensitive class detection.
 */
function hasClass(element, className) {
	var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return pattern.test(getClass(element));
}


/**
 * Add a class to a given element.
 */
function addClass(element, className) {
    if (element = getElement(element)) {
    	element.className += ' ' + className;
    }
}


/**
 * Remove a class from a given element.
 */
function removeClass(element, className) {
	if (element = getElement(element)) {
    	var tokens = getClass(element).split(/\s/);
    	var ok = [];
    	forEach(tokens, function (token) {
    		if (token != className) {
    			ok.push(token);
    		}
    	});
	    element.className = ok.join(' ');
    }
}


/**
 * Turn a class on or off on a given element.
 */
function flipClass(element, className, flipOn) {
    var method = flipOn ? addClass : removeClass;
    method(element, className);
}


/**
 * Turn a class on or off on a given element.
 */
function toggleClass(element, className) {
    flipClass(element, className, !hasClass(element, className));
}


/**
 * Insert a call to an external JavaScript file.
 */
function insertScript(src, callback) {
    var head = getElementsByTagName('head')[0];
    var script = addElement(0, 'script');
    if (callback) {
        script.onload = callback;
        script.onreadystatechange = function() {
            if (isLoaded(script)) {
                callback();
            }
        };
    }
    script.src = src;
}


/**
 * Bind a handler to listen for a particular event on an element.
 */
function bind(
	element,            // DOMElement|string*: Element or ID of element to bind to.
	eventName,          // string*:            Name of event (e.g. "click", "mouseover", "keyup").
	eventHandler,       // function*:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
	customData,         // object:             Custom data to pass through to the event handler when it's triggered.
	multiBindCustomData
	) {

	// Allow multiple events to be bound at once using a space-delimited string.
	if (containsString(eventName, ' ')) {
		forEach(eventName.split(' '), function (singleEventName) {
			bind(element, singleEventName, eventHandler, customData, multiBindCustomData);
		});
		return;
	}

	// Ensure that we have an element, not just an ID.
	if (element = getElement(element)) {

		// Invoke the event handler with the event information and the target element.
		var callback = function(event) {
			// Fall back to window.event for IE.
			event = event || window.event;
			// Fall back to srcElement for IE.
			var target = event.target || event.srcElement;
			// Defeat Safari text node bug.
			if (target.nodeType == 3) {
				target = getParent(target);
			}
			var relatedTarget = event.relatedTarget || event.toElement;
			if (eventName == 'mouseout') {
				while (relatedTarget = getParent(relatedTarget)) {
					if (relatedTarget == target) {
						return;
					}
				}
			}
			return eventHandler(element, event, target, multiBindCustomData || customData);
		};

		// Bind using whatever method we can use.
		if (element.addEventListener) {
			element.addEventListener(eventName, callback, true);
		}
		else if (element.attachEvent) {
			element.attachEvent('on' + eventName, callback);
		}
		else {
			element['on' + eventName] = callback;
		}
	}
}


/**
 * Stop event bubbling.
 */
function stopEvent(
	event // object*: Event to be canceled.
	) {
	event.cancelBubble = true;
	if (event.stopPropagation) {
		event.stopPropagation();
	}
}


/**
 * Bind an event handler for both the focus and blur events.
 */
function bindFocusChange(
	element, // DOMElement|string*
	eventHandler,
	customData
	) {
	bind(element, 'focus', eventHandler, true, customData);
	bind(element, 'blur', eventHandler, false, customData);
}


/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
function bindHover(element, eventHandler, customData) {
	var ieVersion = getBrowserVersionOrZero('msie');
	var HOVER_OVER = 'mouse' + (ieVersion ? 'enter' : 'over');
	var HOVER_OUT = 'mouse' + (ieVersion ? 'leave' : 'out');
	bind(element, HOVER_OVER, eventHandler, true, customData);
	bind(element, HOVER_OUT, eventHandler, false, customData);
}


/**
 * Bind an event handler on an element that delegates to specified child elements.
 */
function on(
	element,
	tagAndClass,
	eventName,
	eventHandler,
	customData,
	multiBindCustomData
	) {
	tagAndClass = tagAndClass.split('.');
	var tagName = tagAndClass[0].toUpperCase();
	var className = tagAndClass[1];
	var onHandler = function(target, event, element, customData) {
		if (!tagName || (target.tagName == tagName)) {
			if (!className || hasClass(target, className)) {
				return eventHandler(target, event, element, multiBindCustomData || customData);
			}
		}
		// Bubble up to find a tagAndClass match because we didn't find one this time.
		if (target = getParent(target)) {
			onHandler(target, event, element, customData);
		}
	};
	bind(element, eventName, onHandler, customData);
}


/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
function onHover(element, tagAndClass, eventHandler, customData) {
	on(element, tagAndClass, 'mouseover', eventHandler, true, customData);
	on(element, tagAndClass, 'mouseout', eventHandler, false, customData);
}


/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
function bindClick(element, eventHandler, customData) {
	bind(element, 'click', eventHandler, customData);
}


/**
 * Bind a callback to be run after window onload.
 */
function bindWindowLoad(callback, windowObject) {
	// Default to the run after the window we're in.
	windowObject = windowObject || window;
	// If the window is already loaded, run the callback now.
	if (isLoaded(windowObject.document)) {
		callback();
	}
	// Otherwise, defer the callback.
	else {
		bind(windowObject, 'load', callback);
	}
}


/**
 * Return true if the object is loaded (signaled by its readyState being "loaded" or "complete").
 * This can be useful for the documents, iframes and scripts.
 */
function isLoaded(object) {
	var state = object.readyState;
	// In all browsers, documents will reach readyState=="complete".
	// In IE, scripts can reach readyState=="loaded" or readyState=="complete".
	// In non-IE browsers, we can bind to script.onload instead of checking script.readyState.
	return state == 'complete' || (object.tagName == 'script' && state == 'loaded');
}


/**
 * Focus on a specified element.
 */
function focusElement(element) {
	element = getElement(element);
	if (element) {
		element.focus();
	}
}


/**
 * Stop events from triggering a handler more than once in rapid succession.
 */
function doOnce(method, args, delay) {
	clearTimeout(method.t);
	method.t = setTimeout(function () {
		clearTimeout(method.t);
		method.call(args);
	}, delay || 9);
}


this.jymin = {version: '0.1.3'};/**
 * Get or set the value of a form element.
 */
var valueOf = function (input, value) {
	input = getElement(input);
	var type = input.type;
	var isCheckbox = type == 'checkbox';
	var isRadio = type == 'radio';
	var isSelect = /select/.test(type);
	// TODO: Make this work for select boxes and other stuff too.
	if (typeof value == 'undefined') {
		value = input.value;
		if (isCheckbox) {
			return input.checked ? value : null;
		}
		else if (isSelect) {
			return input.options[input.selectedIndex].value;
		} 
	}
	else {
		if (isCheckbox) {
			input.checked = value ? true : false;
		}
		else if (isSelect) {
			forEach(input.options, function (option, index) {
				if (option.value == value) {
					input.selectedIndex = index;
				}
			});
		}
		else {
			input.value = value;
		}
	}
	return input.value;
};

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
var pushHistory = function (href) {
	getHistory().push(href);
};

/**
 * Push an item into the history.
 */
var replaceHistory = function (href) {
	getHistory().replace(href);
};

/**
 * Go back.
 */
var popHistory = function (href) {
	getHistory().back();
};

/**
 * Log values to the console, if it's available.
 */
function log(message, object) {
    if (window.console && console.log) {
        // Prefix the first argument (hopefully a string) with the marker.
        if (typeof object == 'undefined') {
            console.log(message);
        }
        else {
            console.log(message, object);
        }
    }
}

/**
 * If the argument is numeric, return a number, otherwise return zero. 
 * @param {Object} n
 */
var forceNumber = function (number, defaultNumber) {
	defaultNumber = defaultNumber || 0;
	number *= 1;
	return isNaN(number) ? defaultNumber : number;
};

/**
 * Return true if it's a string.
 */
function isString(object) {
    return typeof object == 'string';
}

/**
 * Return true if the string contains the given substring.
 */
function containsString(string, substring) {
    return ('' + string).indexOf(substring) > -1;
}

/**
 * Trim the whitespace from a string.
 */
function trimString(string) {
	return ('' + string).replace(/^\s+|\s+$/g, '');
}

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
function decorateString(string, replacements) {
    string = '' + string;
    forEach(replacements, function(replacement) {
        string = string.replace('*', replacement);
    });
    return string;
}

/**
 * Reduce a string to its alphabetic characters.
 */
function extractLetters(string) {
    return ('' + string).replace(/[^a-z]/ig, '');
}

/**
 * Reduce a string to its numeric characters.
 */
function extractNumbers(string) {
    return ('' + string).replace(/[^0-9]/g, '');
}

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
function buildQueryString(object) {
	var queryParams = [];
	forIn(object, function(value, key) {
		queryParams.push(escape(key) + '=' + escape(value));
	});
	return queryParams.join('&');
}

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
function getBrowserVersionOrZero(browserName) {
    var match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent);
    return match ? +match[1] : 0;
}

/**
 * Get the current location host.
 */
var getHost = function () {
	return location.host;
};

/**
 * Get the base of the current URL.
 */
var getBaseUrl = function () {
	return location.protocol + '//' + getHost();
};

/**
 * Get the query parameters from a URL.
 */
var getQueryParams = function (url) {
	url = url || location.href;
	var query = url.substr(url.indexOf('?') + 1).split('#')[0];
	var pairs = query.split('&');
	query = {};
	forEach(pairs, function (pair) {
		var eqPos = pair.indexOf('=');
		var name = pair.substr(0, eqPos);
		var value = pair.substr(eqPos + 1);
		query[name] = value;
	});
	return query;
};

/**
 * Get the query parameters from the hash of a URL.
 */
var getHashParams = function (hash) {
	hash = (hash || location.hash).replace(/^#/, '');
	return hash ? getQueryParams(hash) : {};
};

