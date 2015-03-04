/**
 * Apply arguments to an object method.
 *
 * @param  {Object}          object      An object with methods.
 * @param  {string}          methodName  A method name, which may exist on the object.
 * @param  {Arguments|Array} args        An arguments object or array to apply to the method.
 * @return {Object}                      The result returned by the object method.
 */
Jymin.apply = function (object, methodName, args) {
  return ((object || 0)[methodName] || Jymin.doNothing).apply(object, args);
};
