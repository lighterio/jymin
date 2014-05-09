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

