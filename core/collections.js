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


