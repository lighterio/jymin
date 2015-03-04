/**
 * Calculate an MD5 hash for a string (useful for things like Gravatars).
 *
 * @param  {String} s  A string to hash.
 * @return {String}    The MD5 hash for the given string.
 */
Jymin.md5 = function (str) {

  // Encode as UTF-8.
  str = decodeURIComponent(encodeURIComponent(str));

  // Build an array of little-endian words.
  var arr = new Array(str.length >> 2);
  for (var idx = 0, len = arr.length; idx < len; idx += 1) {
    arr[idx] = 0;
  }
  for (idx = 0, len = str.length * 8; idx < len; idx += 8) {
    arr[idx >> 5] |= (str.charCodeAt(idx / 8) & 0xFF) << (idx % 32);
  }

  // Calculate the MD5 of an array of little-endian words.
  arr[len >> 5] |= 0x80 << (len % 32);
  arr[(((len + 64) >>> 9) << 4) + 14] = len;

  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  len = arr.length;
  idx = 0;
  while (idx < len) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    var e = arr[idx++];
    var f = arr[idx++];
    var g = arr[idx++];
    var h = arr[idx++];
    var i = arr[idx++];
    var j = arr[idx++];
    var k = arr[idx++];
    var l = arr[idx++];
    var m = arr[idx++];
    var n = arr[idx++];
    var o = arr[idx++];
    var p = arr[idx++];
    var q = arr[idx++];
    var r = arr[idx++];
    var s = arr[idx++];
    var t = arr[idx++];

    a = ff(a, b, c, d, e, 7, -680876936);
    d = ff(d, a, b, c, f, 12, -389564586);
    c = ff(c, d, a, b, g, 17, 606105819);
    b = ff(b, c, d, a, h, 22, -1044525330);
    a = ff(a, b, c, d, i, 7, -176418897);
    d = ff(d, a, b, c, j, 12, 1200080426);
    c = ff(c, d, a, b, k, 17, -1473231341);
    b = ff(b, c, d, a, l, 22, -45705983);
    a = ff(a, b, c, d, m, 7, 1770035416);
    d = ff(d, a, b, c, n, 12, -1958414417);
    c = ff(c, d, a, b, o, 17, -42063);
    b = ff(b, c, d, a, p, 22, -1990404162);
    a = ff(a, b, c, d, q, 7, 1804603682);
    d = ff(d, a, b, c, r, 12, -40341101);
    c = ff(c, d, a, b, s, 17, -1502002290);
    b = ff(b, c, d, a, t, 22, 1236535329);

    a = gg(a, b, c, d, f, 5, -165796510);
    d = gg(d, a, b, c, k, 9, -1069501632);
    c = gg(c, d, a, b, p, 14, 643717713);
    b = gg(b, c, d, a, e, 20, -373897302);
    a = gg(a, b, c, d, j, 5, -701558691);
    d = gg(d, a, b, c, o, 9, 38016083);
    c = gg(c, d, a, b, t, 14, -660478335);
    b = gg(b, c, d, a, i, 20, -405537848);
    a = gg(a, b, c, d, n, 5, 568446438);
    d = gg(d, a, b, c, s, 9, -1019803690);
    c = gg(c, d, a, b, h, 14, -187363961);
    b = gg(b, c, d, a, m, 20, 1163531501);
    a = gg(a, b, c, d, r, 5, -1444681467);
    d = gg(d, a, b, c, g, 9, -51403784);
    c = gg(c, d, a, b, l, 14, 1735328473);
    b = gg(b, c, d, a, q, 20, -1926607734);

    a = hh(a, b, c, d, j, 4, -378558);
    d = hh(d, a, b, c, m, 11, -2022574463);
    c = hh(c, d, a, b, p, 16, 1839030562);
    b = hh(b, c, d, a, s, 23, -35309556);
    a = hh(a, b, c, d, f, 4, -1530992060);
    d = hh(d, a, b, c, i, 11, 1272893353);
    c = hh(c, d, a, b, l, 16, -155497632);
    b = hh(b, c, d, a, o, 23, -1094730640);
    a = hh(a, b, c, d, r, 4, 681279174);
    d = hh(d, a, b, c, e, 11, -358537222);
    c = hh(c, d, a, b, h, 16, -722521979);
    b = hh(b, c, d, a, k, 23, 76029189);
    a = hh(a, b, c, d, n, 4, -640364487);
    d = hh(d, a, b, c, q, 11, -421815835);
    c = hh(c, d, a, b, t, 16, 530742520);
    b = hh(b, c, d, a, g, 23, -995338651);

    a = ii(a, b, c, d, e, 6, -198630844);
    d = ii(d, a, b, c, l, 10, 1126891415);
    c = ii(c, d, a, b, s, 15, -1416354905);
    b = ii(b, c, d, a, j, 21, -57434055);
    a = ii(a, b, c, d, q, 6, 1700485571);
    d = ii(d, a, b, c, h, 10, -1894986606);
    c = ii(c, d, a, b, o, 15, -1051523);
    b = ii(b, c, d, a, f, 21, -2054922799);
    a = ii(a, b, c, d, m, 6, 1873313359);
    d = ii(d, a, b, c, t, 10, -30611744);
    c = ii(c, d, a, b, k, 15, -1560198380);
    b = ii(b, c, d, a, r, 21, 1309151649);
    a = ii(a, b, c, d, i, 6, -145523070);
    d = ii(d, a, b, c, p, 10, -1120210379);
    c = ii(c, d, a, b, g, 15, 718787259);
    b = ii(b, c, d, a, n, 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  arr = [a, b, c, d];

  // Build a string.
  var hex = '0123456789abcdef';
  str = '';
  for (idx = 0, len = arr.length * 32; idx < len; idx += 8) {
    var code = (arr[idx >> 5] >>> (idx % 32)) & 0xFF;
    str += hex.charAt((code >>> 4) & 0x0F) + hex.charAt(code & 0x0F);
  }

  return str;

  /**
   * Add 32-bit integers, using 16-bit operations to mitigate JS interpreter bugs.
   */
  function add(a, b) {
    var lsw = (a & 0xFFFF) + (b & 0xFFFF);
    var msw = (a >> 16) + (b >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function cmn(q, a, b, x, s, t) {
    a = add(add(a, q), add(x, t));
    return add((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

};