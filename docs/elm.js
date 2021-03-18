(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bX.d9 === region.cr.d9)
	{
		return 'on line ' + region.bX.d9;
	}
	return 'on lines ' + region.bX.d9 + ' through ' + region.cr.d9;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.d$,
		impl.eD,
		impl.eu,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		N: func(record.N),
		bY: record.bY,
		bK: record.bK
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.N;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bY;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bK) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.d$,
		impl.eD,
		impl.eu,
		function(sendToApp, initialModel) {
			var view = impl.eH;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.d$,
		impl.eD,
		impl.eu,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bQ && impl.bQ(sendToApp)
			var view = impl.eH;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.dF);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.ex) && (_VirtualDom_doc.title = title = doc.ex);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.ei;
	var onUrlRequest = impl.ej;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bQ: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.c0 === next.c0
							&& curr.cz === next.cz
							&& curr.cW.a === next.cW.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		d$: function(flags)
		{
			return A3(impl.d$, flags, _Browser_getUrl(), key);
		},
		eH: impl.eH,
		eD: impl.eD,
		eu: impl.eu
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dW: 'hidden', dI: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dW: 'mozHidden', dI: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dW: 'msHidden', dI: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dW: 'webkitHidden', dI: 'webkitvisibilitychange' }
		: { dW: 'hidden', dI: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		c8: _Browser_getScene(),
		$7: {
			ds: _Browser_window.pageXOffset,
			dt: _Browser_window.pageYOffset,
			dr: _Browser_doc.documentElement.clientWidth,
			cy: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dr: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		cy: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			c8: {
				dr: node.scrollWidth,
				cy: node.scrollHeight
			},
			$7: {
				ds: node.scrollLeft,
				dt: node.scrollTop,
				dr: node.clientWidth,
				cy: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			c8: _Browser_getScene(),
			$7: {
				ds: x,
				dt: y,
				dr: _Browser_doc.documentElement.clientWidth,
				cy: _Browser_doc.documentElement.clientHeight
			},
			dR: {
				ds: x + rect.left,
				dt: y + rect.top,
				dr: rect.width,
				cy: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$Main$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.k) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.m),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.m);
		} else {
			var treeLen = builder.k * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.n) : builder.n;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.k);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.m) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.m);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{n: nodeList, k: (len / $elm$core$Array$branchFactor) | 0, m: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cw: fragment, cz: host, cU: path, cW: port_, c0: protocol, c1: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$PageAcceleration = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Page$Acceleration$checkRange = F3(
	function (min, max, _v0) {
		var value = _v0.a;
		var errors = _v0.b;
		var paramName = _v0.c;
		if (!value.$) {
			var val = value.a;
			return ((_Utils_cmp(val, min) > -1) && (_Utils_cmp(val, max) < 1)) ? _Utils_Tuple3(
				$elm$core$Maybe$Just(val),
				errors,
				paramName) : _Utils_Tuple3(
				$elm$core$Maybe$Nothing,
				A2(
					$elm$core$List$cons,
					paramName + (' must be between ' + ($elm$core$String$fromFloat(min) + (' ... ' + $elm$core$String$fromFloat(max)))),
					errors),
				paramName);
		} else {
			return _Utils_Tuple3($elm$core$Maybe$Nothing, errors, paramName);
		}
	});
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Page$Acceleration$parseFloat = function (_v0) {
	var paramName = _v0.a;
	var strInput = _v0.b;
	var floatValue = $elm$core$String$toFloat(strInput);
	if (!floatValue.$) {
		var val = floatValue.a;
		return _Utils_Tuple3(
			$elm$core$Maybe$Just(val),
			_List_Nil,
			paramName);
	} else {
		return _Utils_Tuple3(
			$elm$core$Maybe$Nothing,
			_List_fromArray(
				[paramName + ' must be a number']),
			paramName);
	}
};
var $author$project$Page$Acceleration$validateAcceleration = function (strInput) {
	var _v0 = A3(
		$author$project$Page$Acceleration$checkRange,
		10,
		500,
		$author$project$Page$Acceleration$parseFloat(
			_Utils_Tuple2('\u03C9\u2032', strInput)));
	var value = _v0.a;
	var errors = _v0.b;
	return {w: errors, F: strInput, y: value};
};
var $author$project$Page$Acceleration$validateMinInterval = function (strInput) {
	var _v0 = A3(
		$author$project$Page$Acceleration$checkRange,
		300,
		1000,
		$author$project$Page$Acceleration$parseFloat(
			_Utils_Tuple2('cMin', strInput)));
	var value = _v0.a;
	var errors = _v0.b;
	return {w: errors, F: strInput, y: value};
};
var $author$project$Page$Acceleration$validateStepAngle = function (strInput) {
	var _v0 = A3(
		$author$project$Page$Acceleration$checkRange,
		0.1,
		360,
		$author$project$Page$Acceleration$parseFloat(
			_Utils_Tuple2('\u03B1', strInput)));
	var value = _v0.a;
	var errors = _v0.b;
	return {w: errors, F: strInput, y: value};
};
var $author$project$Page$Acceleration$validateTimerFrequency = function (strInput) {
	var _v0 = A3(
		$author$project$Page$Acceleration$checkRange,
		0.1,
		10,
		$author$project$Page$Acceleration$parseFloat(
			_Utils_Tuple2('f', strInput)));
	var value = _v0.a;
	var errors = _v0.b;
	return {w: errors, F: strInput, y: value};
};
var $author$project$Page$Acceleration$init = function (_v0) {
	return _Utils_Tuple2(
		{
			U: $author$project$Page$Acceleration$validateAcceleration('35.0'),
			v: _List_Nil,
			aK: false,
			O: $author$project$Page$Acceleration$validateMinInterval('300.0'),
			aN: {cx: _List_Nil},
			ax: false,
			ac: $author$project$Page$Acceleration$validateStepAngle('1.8'),
			aC: $author$project$Page$Acceleration$validateTimerFrequency('1')
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$AccelerationMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$PagePrecision = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$PageResolution = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$PrecisionMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$ResolutionMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Precision$init = function (_v0) {
	return _Utils_Tuple2(0, $elm$core$Platform$Cmd$none);
};
var $author$project$Page$Resolution$init = function (_v0) {
	return _Utils_Tuple2(0, $elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$initCurrentPage = function (_v0) {
	var model = _v0.a;
	var existingCmds = _v0.b;
	var _v1 = function () {
		var _v2 = model.aa;
		switch (_v2) {
			case 0:
				var _v3 = $author$project$Page$Acceleration$init(0);
				var pageModel = _v3.a;
				var pageCmds = _v3.b;
				return _Utils_Tuple2(
					$author$project$Main$PageAcceleration(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$AccelerationMsg, pageCmds));
			case 1:
				var _v4 = $author$project$Page$Resolution$init(0);
				var pageModel = _v4.a;
				var pageCmds = _v4.b;
				return _Utils_Tuple2(
					$author$project$Main$PageResolution(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$ResolutionMsg, pageCmds));
			default:
				var _v5 = $author$project$Page$Precision$init(0);
				var pageModel = _v5.a;
				var pageCmds = _v5.b;
				return _Utils_Tuple2(
					$author$project$Main$PagePrecision(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$PrecisionMsg, pageCmds));
		}
	}();
	var currentPage = _v1.a;
	var mappedPageCmds = _v1.b;
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{Q: currentPage}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[existingCmds, mappedPageCmds])));
};
var $author$project$Main$RouteAcceleration = 0;
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {W: frag, Z: params, S: unvisited, G: value, ag: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.S;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.G);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.G);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.cU),
					$elm$url$Url$Parser$prepareQuery(url.c1),
					url.cw,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$RoutePrecision = 2;
var $author$project$Main$RouteResolution = 1;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.ag;
		var unvisited = _v0.S;
		var params = _v0.Z;
		var frag = _v0.W;
		var value = _v0.G;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.ag;
			var unvisited = _v1.S;
			var params = _v1.Z;
			var frag = _v1.W;
			var value = _v1.G;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.ag;
		var unvisited = _v0.S;
		var params = _v0.Z;
		var frag = _v0.W;
		var value = _v0.G;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $author$project$Main$routeParser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			1,
			$elm$url$Url$Parser$s('resolution')),
			A2(
			$elm$url$Url$Parser$map,
			2,
			$elm$url$Url$Parser$s('precision'))
		]));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$urlToRoute = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$url$Url$Parser$parse, $author$project$Main$routeParser, url));
};
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var _v1 = $author$project$Page$Acceleration$init(0);
		var pageModel = _v1.a;
		var pageCmds = _v1.b;
		var model = {
			bx: key,
			Q: $author$project$Main$PageAcceleration(pageModel),
			aa: $author$project$Main$urlToRoute(url),
			b$: url
		};
		return $author$project$Main$initCurrentPage(
			_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.c0;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.cw,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.c1,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.cW,
					_Utils_ap(http, url.cz)),
				url.cU)));
};
var $author$project$Page$Acceleration$RampReceived = function (a) {
	return {$: 5, a: a};
};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Calculations$AccelRamp$calculateDelayStep = F7(
	function (n, f_Hz, alpha_rad, omegaPrime_radSec2, cNm1, cMin, steps) {
		calculateDelayStep:
		while (true) {
			var cN = (!n) ? ((0.676 * f_Hz) * $elm$core$Basics$sqrt((2 * alpha_rad) / omegaPrime_radSec2)) : (cNm1 - ((2 * cNm1) / ((4 * n) + 1)));
			if (_Utils_cmp(cN, cMin) < 1) {
				return _Utils_ap(
					steps,
					_List_fromArray(
						[cMin]));
			} else {
				var $temp$n = n + 1,
					$temp$f_Hz = f_Hz,
					$temp$alpha_rad = alpha_rad,
					$temp$omegaPrime_radSec2 = omegaPrime_radSec2,
					$temp$cNm1 = cN,
					$temp$cMin = cMin,
					$temp$steps = _Utils_ap(
					steps,
					_List_fromArray(
						[cN]));
				n = $temp$n;
				f_Hz = $temp$f_Hz;
				alpha_rad = $temp$alpha_rad;
				omegaPrime_radSec2 = $temp$omegaPrime_radSec2;
				cNm1 = $temp$cNm1;
				cMin = $temp$cMin;
				steps = $temp$steps;
				continue calculateDelayStep;
			}
		}
	});
var $elm$core$Basics$pi = _Basics_pi;
var $author$project$Calculations$AccelRamp$calculateDelays = F4(
	function (omegaPrime_radSec2, cMin, stepAngle_deg, f_Hz) {
		var stepAngle_rad = stepAngle_deg * ($elm$core$Basics$pi / 180);
		return A7($author$project$Calculations$AccelRamp$calculateDelayStep, 0, f_Hz, stepAngle_rad, omegaPrime_radSec2, 0, cMin, _List_Nil);
	});
var $author$project$Calculations$AccelRamp$calcAngularSpeed = F3(
	function (stepAngle_rad, f_Hz, c) {
		return (stepAngle_rad * f_Hz) / c;
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Calculations$AccelRamp$calcDelaysFromStart = F3(
	function (delaySoFar, delays, delaysFromStart) {
		calcDelaysFromStart:
		while (true) {
			var restOfValues = $elm$core$List$tail(delays);
			var nextValue = $elm$core$List$head(delays);
			var currentValue = function () {
				if (!nextValue.$) {
					var a = nextValue.a;
					return delaySoFar + a;
				} else {
					return delaySoFar;
				}
			}();
			if (!restOfValues.$) {
				var a = restOfValues.a;
				var $temp$delaySoFar = currentValue,
					$temp$delays = a,
					$temp$delaysFromStart = _Utils_ap(
					delaysFromStart,
					_List_fromArray(
						[currentValue]));
				delaySoFar = $temp$delaySoFar;
				delays = $temp$delays;
				delaysFromStart = $temp$delaysFromStart;
				continue calcDelaysFromStart;
			} else {
				return _Utils_ap(
					delaysFromStart,
					_List_fromArray(
						[currentValue]));
			}
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm_community$list_extra$List$Extra$zip = $elm$core$List$map2($elm$core$Tuple$pair);
var $author$project$Calculations$AccelRamp$delaysToRamp = F3(
	function (stepAngle_rad, f_Hz, delays) {
		var delaysFromStart = A3($author$project$Calculations$AccelRamp$calcDelaysFromStart, 0, delays, _List_Nil);
		var angularSpeedsFromStart = A2(
			$elm$core$List$map,
			function (x) {
				return A3($author$project$Calculations$AccelRamp$calcAngularSpeed, stepAngle_rad, f_Hz, x);
			},
			delays);
		return {
			cx: A2(
				$elm$core$List$map,
				function (_v0) {
					var x = _v0.a;
					var y = _v0.b;
					return {b8: (y / 0.0174532925) / 360, co: x / 1000000};
				},
				A2($elm_community$list_extra$List$Extra$zip, delaysFromStart, angularSpeedsFromStart))
		};
	});
var $author$project$Page$Acceleration$calc = F4(
	function (accel, cMin, stepAngle, freq) {
		var mHzToHz = 1000000;
		var frequency_Hz = freq * mHzToHz;
		var delays = A4($author$project$Calculations$AccelRamp$calculateDelays, accel, cMin, stepAngle, frequency_Hz);
		var ramp = A3($author$project$Calculations$AccelRamp$delaysToRamp, stepAngle, frequency_Hz, delays);
		return _Utils_Tuple2(delays, ramp);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Page$Acceleration$update = F2(
	function (msg, model) {
		var mHzToHz = 1000000;
		switch (msg.$) {
			case 0:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							U: $author$project$Page$Acceleration$validateAcceleration(value)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							O: $author$project$Page$Acceleration$validateMinInterval(value)
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ac: $author$project$Page$Acceleration$validateStepAngle(value)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aC: $author$project$Page$Acceleration$validateTimerFrequency(value)
						}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var _v1 = _List_fromArray(
					[model.U.y, model.O.y, model.ac.y, model.aC.y]);
				if ((((((((_v1.b && (!_v1.a.$)) && _v1.b.b) && (!_v1.b.a.$)) && _v1.b.b.b) && (!_v1.b.b.a.$)) && _v1.b.b.b.b) && (!_v1.b.b.b.a.$)) && (!_v1.b.b.b.b.b)) {
					var acceleration = _v1.a.a;
					var _v2 = _v1.b;
					var minInterval = _v2.a.a;
					var _v3 = _v2.b;
					var stepAngle = _v3.a.a;
					var _v4 = _v3.b;
					var frequency = _v4.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								v: _List_Nil,
								aK: true,
								aN: {cx: _List_Nil}
							}),
						A2(
							$elm$core$Task$perform,
							function (_v5) {
								return $author$project$Page$Acceleration$RampReceived(
									A4($author$project$Page$Acceleration$calc, acceleration, minInterval, stepAngle, frequency));
							},
							$elm$core$Process$sleep(100)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var _v6 = msg.a;
				var delays = _v6.a;
				var ramp = _v6.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{v: delays, aK: false, aN: ramp}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ax: !model.ax}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Precision$update = F2(
	function (msg, model) {
		if (!msg) {
			return _Utils_Tuple2(model + 1, $elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model - 1, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Resolution$update = F2(
	function (msg, model) {
		if (!msg) {
			return _Utils_Tuple2(model + 1, $elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model - 1, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.Q);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					var urlRequest = _v0.a.a;
					if (!urlRequest.$) {
						var url = urlRequest.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.bx,
								$elm$url$Url$toString(url)));
					} else {
						var href = urlRequest.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(href));
					}
				case 1:
					var url = _v0.a.a;
					return $author$project$Main$initCurrentPage(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									aa: $author$project$Main$urlToRoute(url),
									b$: url
								}),
							$elm$core$Platform$Cmd$none));
				case 2:
					if (!_v0.b.$) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						var _v2 = A2($author$project$Page$Acceleration$update, subMsg, subModel);
						var updatedPageModel = _v2.a;
						var updatedCmd = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									Q: $author$project$Main$PageAcceleration(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$AccelerationMsg, updatedCmd));
					} else {
						break _v0$5;
					}
				case 3:
					if (_v0.b.$ === 1) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						var _v3 = A2($author$project$Page$Resolution$update, subMsg, subModel);
						var updatedPageModel = _v3.a;
						var updatedCmd = _v3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									Q: $author$project$Main$PageResolution(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$ResolutionMsg, updatedCmd));
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 2) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						var _v4 = A2($author$project$Page$Precision$update, subMsg, subModel);
						var updatedPageModel = _v4.a;
						var updatedCmd = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									Q: $author$project$Main$PagePrecision(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$PrecisionMsg, updatedCmd));
					} else {
						break _v0$5;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Page$Acceleration$CalculateRamp = {$: 4};
var $perzanko$elm_loading$Loading$Circle = 4;
var $cuducos$elm_format_number$FormatNumber$Locales$Exact = function (a) {
	return {$: 2, a: a};
};
var $terezka$line_charts$LineChart$Container$Margin = F4(
	function (top, right, bottom, left) {
		return {dG: bottom, cL: left, eq: right, dk: top};
	});
var $perzanko$elm_loading$Loading$On = 0;
var $author$project$Page$Acceleration$ToggleShowSteps = {$: 6};
var $author$project$Page$Acceleration$UpdateAcceleration = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Acceleration$UpdateMinInterval = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Acceleration$UpdateStepAngle = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Acceleration$UpdateTimerFrequency = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $terezka$line_charts$Internal$Axis$Title$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Title$custom = F4(
	function (position, x, y, title) {
		return {
			b: _Utils_Tuple2(x, y),
			aM: position,
			eH: title
		};
	});
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$tspan = $elm$svg$Svg$trustedNode('tspan');
var $terezka$line_charts$Internal$Svg$label = F2(
	function (color, string) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(color),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$tspan,
					_List_Nil,
					_List_fromArray(
						[
							$elm$svg$Svg$text(string)
						]))
				]));
	});
var $terezka$line_charts$Internal$Axis$Title$atPosition = F3(
	function (position, x, y) {
		return A2(
			$elm$core$Basics$composeL,
			A3($terezka$line_charts$Internal$Axis$Title$custom, position, x, y),
			$terezka$line_charts$Internal$Svg$label('inherit'));
	});
var $terezka$line_charts$Internal$Axis$Title$atAxisMax = function () {
	var position = F2(
		function (data, range) {
			return range.a$;
		});
	return $terezka$line_charts$Internal$Axis$Title$atPosition(position);
}();
var $terezka$line_charts$LineChart$Axis$Title$atAxisMax = $terezka$line_charts$Internal$Axis$Title$atAxisMax;
var $elm$html$Html$button = _VirtualDom_node('button');
var $terezka$line_charts$Internal$Axis$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$custom = $elm$core$Basics$identity;
var $terezka$line_charts$LineChart$Axis$custom = $terezka$line_charts$Internal$Axis$custom;
var $terezka$line_charts$Internal$Container$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Container$custom = $elm$core$Basics$identity;
var $terezka$line_charts$LineChart$Container$custom = $terezka$line_charts$Internal$Container$custom;
var $terezka$line_charts$Internal$Area$None = {$: 0};
var $terezka$line_charts$Internal$Area$none = $terezka$line_charts$Internal$Area$None;
var $terezka$line_charts$LineChart$Area$default = $terezka$line_charts$Internal$Area$none;
var $terezka$line_charts$Internal$Axis$Values$Around = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Axis$Values$around = $terezka$line_charts$Internal$Axis$Values$Around;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $terezka$line_charts$Internal$Axis$Title$atDataMax = function () {
	var position = F2(
		function (data, range) {
			return A2($elm$core$Basics$min, data.a$, range.a$);
		});
	return $terezka$line_charts$Internal$Axis$Title$atPosition(position);
}();
var $terezka$line_charts$Internal$Axis$Ticks$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Ticks$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Values$ceilingTo = F2(
	function (prec, number) {
		return prec * $elm$core$Basics$ceiling(number / prec);
	});
var $elm$core$Basics$round = _Basics_round;
var $terezka$line_charts$Internal$Axis$Values$getBeginning = F2(
	function (min, interval) {
		var multiple = min / interval;
		return _Utils_eq(
			multiple,
			$elm$core$Basics$round(multiple)) ? min : A2($terezka$line_charts$Internal$Axis$Values$ceilingTo, interval, min);
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (c !== '0') && (c !== '.');
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (head === '9') {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 1) {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				'0',
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3($elm$core$String$padRight, e + 1, '0', total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					'0',
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3($elm$core$String$padRight, s, '0', after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 1) {
				return false;
			} else {
				if ('5' === _v0.a.a) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $terezka$line_charts$Internal$Axis$Values$correctFloat = function (prec) {
	return A2(
		$elm$core$Basics$composeR,
		$myrho$elm_round$Round$round(prec),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$toFloat,
			$elm$core$Maybe$withDefault(0)));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $terezka$line_charts$Internal$Axis$Values$getMultiples = F3(
	function (magnitude, allowDecimals, hasTickAmount) {
		var defaults = hasTickAmount ? _List_fromArray(
			[1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) : _List_fromArray(
			[1, 2, 2.5, 5, 10]);
		return allowDecimals ? defaults : ((magnitude === 1) ? A2(
			$elm$core$List$filter,
			function (n) {
				return _Utils_eq(
					$elm$core$Basics$round(n),
					n);
			},
			defaults) : ((magnitude <= 0.1) ? _List_fromArray(
			[1 / magnitude]) : defaults));
	});
var $terezka$line_charts$Internal$Axis$Values$getPrecision = function (number) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(number));
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var before = _v0.a;
		var _v1 = _v0.b;
		var after = _v1.a;
		return $elm$core$Basics$abs(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(after)));
	} else {
		var _v2 = A2(
			$elm$core$String$split,
			'.',
			$elm$core$String$fromFloat(number));
		if ((_v2.b && _v2.b.b) && (!_v2.b.b.b)) {
			var before = _v2.a;
			var _v3 = _v2.b;
			var after = _v3.a;
			return $elm$core$String$length(after);
		} else {
			return 0;
		}
	}
};
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$pow = _Basics_pow;
var $terezka$line_charts$Internal$Utils$magnitude = function (num) {
	return A2(
		$elm$core$Basics$pow,
		10,
		$elm$core$Basics$floor(
			A2($elm$core$Basics$logBase, $elm$core$Basics$e, num) / A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10)));
};
var $terezka$line_charts$Internal$Axis$Values$getInterval = F3(
	function (intervalRaw, allowDecimals, hasTickAmount) {
		var magnitude = $terezka$line_charts$Internal$Utils$magnitude(intervalRaw);
		var multiples = A3($terezka$line_charts$Internal$Axis$Values$getMultiples, magnitude, allowDecimals, hasTickAmount);
		var normalized = intervalRaw / magnitude;
		var findMultipleExact = function (multiples_) {
			findMultipleExact:
			while (true) {
				if (multiples_.b) {
					var m1 = multiples_.a;
					var rest = multiples_.b;
					if (_Utils_cmp(m1 * magnitude, intervalRaw) > -1) {
						return m1;
					} else {
						var $temp$multiples_ = rest;
						multiples_ = $temp$multiples_;
						continue findMultipleExact;
					}
				} else {
					return 1;
				}
			}
		};
		var findMultiple = function (multiples_) {
			findMultiple:
			while (true) {
				if (multiples_.b) {
					if (multiples_.b.b) {
						var m1 = multiples_.a;
						var _v2 = multiples_.b;
						var m2 = _v2.a;
						var rest = _v2.b;
						if (_Utils_cmp(normalized, (m1 + m2) / 2) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = A2($elm$core$List$cons, m2, rest);
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					} else {
						var m1 = multiples_.a;
						var rest = multiples_.b;
						if (_Utils_cmp(normalized, m1) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = rest;
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					}
				} else {
					return 1;
				}
			}
		};
		var multiple = hasTickAmount ? findMultipleExact(multiples) : findMultiple(multiples);
		var precision = $terezka$line_charts$Internal$Axis$Values$getPrecision(magnitude) + $terezka$line_charts$Internal$Axis$Values$getPrecision(multiple);
		return A2($terezka$line_charts$Internal$Axis$Values$correctFloat, precision, multiple * magnitude);
	});
var $terezka$line_charts$Internal$Axis$Values$positions = F5(
	function (range, beginning, interval, m, acc) {
		positions:
		while (true) {
			var next = A2(
				$terezka$line_charts$Internal$Axis$Values$correctFloat,
				$terezka$line_charts$Internal$Axis$Values$getPrecision(interval),
				beginning + (m * interval));
			if (_Utils_cmp(next, range.a$) > 0) {
				return acc;
			} else {
				var $temp$range = range,
					$temp$beginning = beginning,
					$temp$interval = interval,
					$temp$m = m + 1,
					$temp$acc = _Utils_ap(
					acc,
					_List_fromArray(
						[next]));
				range = $temp$range;
				beginning = $temp$beginning;
				interval = $temp$interval;
				m = $temp$m;
				acc = $temp$acc;
				continue positions;
			}
		}
	});
var $terezka$line_charts$Internal$Axis$Values$values = F4(
	function (allowDecimals, exact, amountRough, range) {
		var intervalRough = (range.a$ - range.a0) / amountRough;
		var interval = A3($terezka$line_charts$Internal$Axis$Values$getInterval, intervalRough, allowDecimals, exact);
		var intervalSafe = (!interval) ? 1 : interval;
		var beginning = A2($terezka$line_charts$Internal$Axis$Values$getBeginning, range.a0, intervalSafe);
		var amountRoughSafe = (!amountRough) ? 1 : amountRough;
		return A5($terezka$line_charts$Internal$Axis$Values$positions, range, beginning, intervalSafe, 0, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$Values$float = function (amount) {
	if (!amount.$) {
		var amount_ = amount.a;
		return A3($terezka$line_charts$Internal$Axis$Values$values, true, true, amount_);
	} else {
		var amount_ = amount.a;
		return A3($terezka$line_charts$Internal$Axis$Values$values, true, false, amount_);
	}
};
var $terezka$line_charts$Internal$Axis$Tick$Negative = 0;
var $terezka$line_charts$Internal$Axis$Tick$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Tick$custom = $elm$core$Basics$identity;
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $terezka$line_charts$LineChart$Colors$gray = A3($avh4$elm_color$Color$rgb255, 163, 163, 163);
var $terezka$line_charts$Internal$Axis$Tick$float = function (n) {
	return $terezka$line_charts$Internal$Axis$Tick$custom(
		{
			dJ: $terezka$line_charts$LineChart$Colors$gray,
			bk: 0,
			dU: true,
			cK: $elm$core$Maybe$Just(
				A2(
					$terezka$line_charts$Internal$Svg$label,
					'inherit',
					$elm$core$String$fromFloat(n))),
			aL: 5,
			aM: n,
			dr: 1
		});
};
var $terezka$line_charts$LineChart$Axis$Tick$float = $terezka$line_charts$Internal$Axis$Tick$float;
var $terezka$line_charts$Internal$Axis$Range$Padded = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $terezka$line_charts$Internal$Axis$Range$padded = $terezka$line_charts$Internal$Axis$Range$Padded;
var $terezka$line_charts$Internal$Axis$Line$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Line$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Coordinate$smallestRange = F2(
	function (data, range_) {
		return {
			a$: A2($elm$core$Basics$min, data.a$, range_.a$),
			a0: A2($elm$core$Basics$max, data.a0, range_.a0)
		};
	});
var $terezka$line_charts$Internal$Axis$Line$rangeFrame = function (color) {
	return $terezka$line_charts$Internal$Axis$Line$custom(
		F2(
			function (data, range) {
				var smallest = A2($terezka$line_charts$Internal$Coordinate$smallestRange, data, range);
				return {dJ: color, cr: smallest.a$, dS: _List_Nil, bX: smallest.a0, dr: 1};
			}));
};
var $terezka$line_charts$Internal$Axis$default = F3(
	function (pixels_, title_, variable_) {
		return $terezka$line_charts$Internal$Axis$custom(
			{
				dE: $terezka$line_charts$Internal$Axis$Line$rangeFrame($terezka$line_charts$LineChart$Colors$gray),
				el: pixels_,
				eo: A2($terezka$line_charts$Internal$Axis$Range$padded, 20, 20),
				ev: $terezka$line_charts$Internal$Axis$Ticks$custom(
					F2(
						function (data, range_) {
							var smallest = A2($terezka$line_charts$Internal$Coordinate$smallestRange, data, range_);
							var rangeSmall = smallest.a$ - smallest.a0;
							var rangeLong = range_.a$ - range_.a0;
							var diff = 1 - ((rangeLong - rangeSmall) / rangeLong);
							var amount = $elm$core$Basics$round((diff * pixels_) / 90);
							return A2(
								$elm$core$List$map,
								$terezka$line_charts$LineChart$Axis$Tick$float,
								A2(
									$terezka$line_charts$Internal$Axis$Values$float,
									$terezka$line_charts$Internal$Axis$Values$around(amount),
									smallest));
						})),
				ex: A3($terezka$line_charts$Internal$Axis$Title$atDataMax, 0, 0, title_),
				eG: A2($elm$core$Basics$composeL, $elm$core$Maybe$Just, variable_)
			});
	});
var $terezka$line_charts$LineChart$Axis$default = $terezka$line_charts$Internal$Axis$default;
var $terezka$line_charts$Internal$Axis$Intersection$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Data$Point = F2(
	function (x, y) {
		return {ds: x, dt: y};
	});
var $terezka$line_charts$Internal$Axis$Intersection$custom = F2(
	function (toX, toY) {
		return function (_v0) {
			var x = _v0.ds;
			var y = _v0.dt;
			return A2(
				$terezka$line_charts$Internal$Data$Point,
				toX(x),
				toY(y));
		};
	});
var $terezka$line_charts$Internal$Axis$Intersection$default = A2(
	$terezka$line_charts$Internal$Axis$Intersection$custom,
	function ($) {
		return $.a0;
	},
	function ($) {
		return $.a0;
	});
var $terezka$line_charts$LineChart$Axis$Intersection$default = $terezka$line_charts$Internal$Axis$Intersection$default;
var $terezka$line_charts$Internal$Axis$Ticks$floatCustom = F2(
	function (amount, tick) {
		return $terezka$line_charts$Internal$Axis$Ticks$custom(
			F2(
				function (data, range) {
					return A2(
						$elm$core$List$map,
						tick,
						A2(
							$terezka$line_charts$Internal$Axis$Values$float,
							$terezka$line_charts$Internal$Axis$Values$around(amount),
							A2($terezka$line_charts$Internal$Coordinate$smallestRange, data, range)));
				}));
	});
var $terezka$line_charts$Internal$Axis$Ticks$float = function (amount) {
	return A2($terezka$line_charts$Internal$Axis$Ticks$floatCustom, amount, $terezka$line_charts$LineChart$Axis$Tick$float);
};
var $terezka$line_charts$LineChart$Axis$Ticks$default = $terezka$line_charts$Internal$Axis$Ticks$float(5);
var $terezka$line_charts$Internal$Dots$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Dots$Disconnected = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Dots$Style = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Dots$style = F2(
	function (radius, variety) {
		return {bL: radius, b0: variety};
	});
var $terezka$line_charts$Internal$Dots$disconnected = F2(
	function (radius, border) {
		return A2(
			$terezka$line_charts$Internal$Dots$style,
			radius,
			$terezka$line_charts$Internal$Dots$Disconnected(border));
	});
var $terezka$line_charts$Internal$Dots$default = {
	bw: function (_v0) {
		return A2($terezka$line_charts$Internal$Dots$disconnected, 10, 2);
	},
	bz: function (_v1) {
		return A2($terezka$line_charts$Internal$Dots$disconnected, 10, 2);
	}
};
var $terezka$line_charts$LineChart$Dots$default = $terezka$line_charts$Internal$Dots$default;
var $terezka$line_charts$Internal$Events$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Events$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Events$default = $terezka$line_charts$Internal$Events$custom(_List_Nil);
var $terezka$line_charts$LineChart$Events$default = $terezka$line_charts$Internal$Events$default;
var $terezka$line_charts$LineChart$Colors$grayLightest = A3($avh4$elm_color$Color$rgb255, 243, 243, 243);
var $terezka$line_charts$Internal$Grid$Lines = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $terezka$line_charts$Internal$Grid$lines = $terezka$line_charts$Internal$Grid$Lines;
var $terezka$line_charts$Internal$Grid$default = A2($terezka$line_charts$Internal$Grid$lines, 1, $terezka$line_charts$LineChart$Colors$grayLightest);
var $terezka$line_charts$LineChart$Grid$default = $terezka$line_charts$Internal$Grid$default;
var $terezka$line_charts$Internal$Interpolation$Linear = 0;
var $terezka$line_charts$LineChart$Interpolation$linear = 0;
var $terezka$line_charts$LineChart$Interpolation$default = $terezka$line_charts$LineChart$Interpolation$linear;
var $terezka$line_charts$Internal$Junk$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Junk$Layers = F3(
	function (below, above, html) {
		return {bd: above, aI: below, bp: html};
	});
var $terezka$line_charts$Internal$Junk$none = F4(
	function (_v0, _v1, _v2, _v3) {
		return A3($terezka$line_charts$Internal$Junk$Layers, _List_Nil, _List_Nil, _List_Nil);
	});
var $terezka$line_charts$LineChart$Junk$default = $terezka$line_charts$Internal$Junk$none;
var $perzanko$elm_loading$Loading$defaultConfig = {cj: '', dJ: '#74b4c9', dc: 30, df: 1};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$Page$Acceleration$errorItem = function (error) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('danger')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('bi-exclamation-triangle-fill right-offset-small')
					]),
				_List_Nil),
				$elm$html$Html$text('Check your input: ' + error)
			]));
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $cuducos$elm_format_number$FormatNumber$Parser$FormattedNumber = F5(
	function (original, integers, decimals, prefix, suffix) {
		return {bj: decimals, cH: integers, cT: original, a6: prefix, ba: suffix};
	});
var $cuducos$elm_format_number$FormatNumber$Parser$Negative = 2;
var $cuducos$elm_format_number$FormatNumber$Parser$Positive = 0;
var $cuducos$elm_format_number$FormatNumber$Parser$Zero = 1;
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $cuducos$elm_format_number$FormatNumber$Parser$classify = function (formatted) {
	var onlyZeros = A2(
		$elm$core$String$all,
		function (_char) {
			return _char === '0';
		},
		$elm$core$String$concat(
			A2(
				$elm$core$List$append,
				formatted.cH,
				$elm$core$List$singleton(formatted.bj))));
	return onlyZeros ? 1 : ((formatted.cT < 0) ? 2 : 0);
};
var $elm$core$String$filter = _String_filter;
var $cuducos$elm_format_number$FormatNumber$Parser$addZerosToFit = F2(
	function (desiredLength, value) {
		var length = $elm$core$String$length(value);
		var missing = (_Utils_cmp(length, desiredLength) < 0) ? $elm$core$Basics$abs(desiredLength - length) : 0;
		return _Utils_ap(
			value,
			A2($elm$core$String$repeat, missing, '0'));
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $cuducos$elm_format_number$FormatNumber$Parser$removeZeros = function (decimals) {
	return (A2($elm$core$String$right, 1, decimals) !== '0') ? decimals : $cuducos$elm_format_number$FormatNumber$Parser$removeZeros(
		A2($elm$core$String$dropRight, 1, decimals));
};
var $cuducos$elm_format_number$FormatNumber$Parser$getDecimals = F2(
	function (locale, digits) {
		var _v0 = locale.bj;
		switch (_v0.$) {
			case 1:
				return $cuducos$elm_format_number$FormatNumber$Parser$removeZeros(digits);
			case 2:
				return digits;
			default:
				var min = _v0.a;
				return A2($cuducos$elm_format_number$FormatNumber$Parser$addZerosToFit, min, digits);
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $cuducos$elm_format_number$FormatNumber$Parser$splitInParts = F2(
	function (locale, value) {
		var toString = function () {
			var _v1 = locale.bj;
			switch (_v1.$) {
				case 1:
					var max = _v1.a;
					return $myrho$elm_round$Round$round(max);
				case 0:
					return $elm$core$String$fromFloat;
				default:
					var exact = _v1.a;
					return $myrho$elm_round$Round$round(exact);
			}
		}();
		var asList = A2(
			$elm$core$String$split,
			'.',
			toString(value));
		var decimals = function () {
			var _v0 = $elm$core$List$tail(asList);
			if (!_v0.$) {
				var values = _v0.a;
				return A2(
					$elm$core$Maybe$withDefault,
					'',
					$elm$core$List$head(values));
			} else {
				return '';
			}
		}();
		var integers = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(asList));
		return _Utils_Tuple2(integers, decimals);
	});
var $cuducos$elm_format_number$FormatNumber$Parser$splitThousands = function (integers) {
	var reversedSplitThousands = function (value) {
		return ($elm$core$String$length(value) > 3) ? A2(
			$elm$core$List$cons,
			A2($elm$core$String$right, 3, value),
			reversedSplitThousands(
				A2($elm$core$String$dropRight, 3, value))) : _List_fromArray(
			[value]);
	};
	return $elm$core$List$reverse(
		reversedSplitThousands(integers));
};
var $cuducos$elm_format_number$FormatNumber$Parser$parse = F2(
	function (locale, original) {
		var parts = A2($cuducos$elm_format_number$FormatNumber$Parser$splitInParts, locale, original);
		var integers = $cuducos$elm_format_number$FormatNumber$Parser$splitThousands(
			A2($elm$core$String$filter, $elm$core$Char$isDigit, parts.a));
		var decimals = A2($cuducos$elm_format_number$FormatNumber$Parser$getDecimals, locale, parts.b);
		var partial = A5($cuducos$elm_format_number$FormatNumber$Parser$FormattedNumber, original, integers, decimals, '', '');
		var _v0 = $cuducos$elm_format_number$FormatNumber$Parser$classify(partial);
		switch (_v0) {
			case 2:
				return _Utils_update(
					partial,
					{a6: locale.a2, ba: locale.bF});
			case 0:
				return _Utils_update(
					partial,
					{a6: locale.cX, ba: locale.cY});
			default:
				return _Utils_update(
					partial,
					{a6: locale.dw, ba: locale.dx});
		}
	});
var $cuducos$elm_format_number$FormatNumber$Stringfy$formatDecimals = F2(
	function (locale, decimals) {
		return (decimals === '') ? '' : _Utils_ap(locale.bi, decimals);
	});
var $cuducos$elm_format_number$FormatNumber$Stringfy$stringfy = F2(
	function (locale, formatted) {
		var stringfyDecimals = $cuducos$elm_format_number$FormatNumber$Stringfy$formatDecimals(locale);
		var integers = A2($elm$core$String$join, locale.af, formatted.cH);
		var decimals = stringfyDecimals(formatted.bj);
		return $elm$core$String$concat(
			_List_fromArray(
				[formatted.a6, integers, decimals, formatted.ba]));
	});
var $cuducos$elm_format_number$FormatNumber$format = F2(
	function (locale, number_) {
		return A2(
			$cuducos$elm_format_number$FormatNumber$Stringfy$stringfy,
			locale,
			A2($cuducos$elm_format_number$FormatNumber$Parser$parse, locale, number_));
	});
var $cuducos$elm_format_number$FormatNumber$Locales$Min = function (a) {
	return {$: 0, a: a};
};
var $cuducos$elm_format_number$FormatNumber$Locales$base = {
	bi: '.',
	bj: $cuducos$elm_format_number$FormatNumber$Locales$Min(0),
	a2: '−',
	bF: '',
	cX: '',
	cY: '',
	af: '',
	dw: '',
	dx: ''
};
var $cuducos$elm_format_number$FormatNumber$Locales$frenchLocale = _Utils_update(
	$cuducos$elm_format_number$FormatNumber$Locales$base,
	{
		bi: ',',
		bj: $cuducos$elm_format_number$FormatNumber$Locales$Exact(3),
		af: '\u202F'
	});
var $author$project$Page$Acceleration$formatDelay = function (x) {
	return A2(
		$cuducos$elm_format_number$FormatNumber$format,
		_Utils_update(
			$cuducos$elm_format_number$FormatNumber$Locales$frenchLocale,
			{
				bi: '.',
				bj: $cuducos$elm_format_number$FormatNumber$Locales$Exact(1)
			}),
		x);
};
var $terezka$line_charts$Internal$Axis$Line$full = function (color) {
	return $terezka$line_charts$Internal$Axis$Line$custom(
		F2(
			function (data, range) {
				return {dJ: color, cr: range.a$, dS: _List_Nil, bX: range.a0, dr: 1};
			}));
};
var $terezka$line_charts$LineChart$Axis$Line$full = $terezka$line_charts$Internal$Axis$Line$full;
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $terezka$line_charts$Internal$Line$Series = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$SeriesConfig = F5(
	function (color, shape, dashing, label, data) {
		return {dJ: color, cl: dashing, bg: data, cK: label, db: shape};
	});
var $terezka$line_charts$Internal$Line$line = F4(
	function (color_, shape_, label_, data_) {
		return A5($terezka$line_charts$Internal$Line$SeriesConfig, color_, shape_, _List_Nil, label_, data_);
	});
var $terezka$line_charts$LineChart$line = $terezka$line_charts$Internal$Line$line;
var $terezka$line_charts$Internal$Dots$None = 0;
var $terezka$line_charts$LineChart$Dots$none = 0;
var $terezka$line_charts$Internal$Legends$None = {$: 0};
var $terezka$line_charts$Internal$Legends$none = $terezka$line_charts$Internal$Legends$None;
var $terezka$line_charts$LineChart$Legends$none = $terezka$line_charts$Internal$Legends$none;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $terezka$line_charts$LineChart$Axis$Range$padded = $terezka$line_charts$Internal$Axis$Range$padded;
var $terezka$line_charts$Internal$Container$Relative = 1;
var $terezka$line_charts$Internal$Container$relative = 1;
var $terezka$line_charts$LineChart$Container$relative = $terezka$line_charts$Internal$Container$relative;
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 0:
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 1:
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 2:
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.dN) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.eg, record.dN, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 8:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 6, a: a};
};
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{dN: decl, eg: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.ci;
	var imports = _v0.cC;
	var namespaces = _v0.cR;
	var declarations = _v0.dO;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {ci: charset, dO: finalDeclarations, cC: imports, cR: namespaces};
};
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.cu + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.G)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 0:
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 1:
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 0:
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 1:
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.eg;
			var declaration = decl.a.dN;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.ci;
	var imports = _v0.cC;
	var namespaces = _v0.cR;
	var declarations = _v0.dO;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 8, a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
};
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (!declarations.a.$) {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 1)) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 2:
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 3:
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 4:
							var _v9 = declarations.a;
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {al: charsProcessed, ar: hash, ab: seed, aw: shift};
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1 = 3432918353;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize = function (data) {
	var acc = (!(!data.ar)) ? (data.ab ^ A2(
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
		A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
			15,
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, data.ar)))) : data.ab;
	var h0 = acc ^ data.al;
	var h1 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
			5,
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
					A2(
						$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
						15,
						A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, k1))))) + 3864292196;
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.ar | ((255 & $elm$core$Char$toCode(c)) << data.aw);
		var _v0 = data.aw;
		if (_v0 === 24) {
			return {
				al: data.al + 1,
				ar: 0,
				ab: A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$mix, data.ab, res),
				aw: 0
			};
		} else {
			return {al: data.al + 1, ar: res, ab: data.ab, aw: data.aw + 8};
		}
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString = F2(
	function (seed, str) {
		return $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold,
				A4($rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 1) {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 9, a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (!declaration.$) {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((!_v14.a.$) && (!_v14.b.$)) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 1:
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 2:
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 0:
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 7:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 3:
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 5:
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{dN: str, eg: name})
							]));
				case 4:
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 0:
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 7:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.ci;
	var imports = _v0.cC;
	var namespaces = _v0.cR;
	var snippets = _v0.dd;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {ci: charset, dO: declarations, cC: imports, cR: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {ci: $elm$core$Maybe$Nothing, cC: _List_Nil, cR: _List_Nil, dd: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 2:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 0:
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = 0;
var $rtfeldman$elm_css$Css$Structure$Compatible = 0;
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			b4: 0,
			cf: 0,
			ao: 0,
			p: 0,
			aL: 0,
			as: 0,
			M: 0,
			at: 0,
			au: 0,
			X: 0,
			Y: 0,
			D: 0,
			P: numericValue,
			aA: 0,
			aE: unitLabel,
			aS: units,
			G: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '', 0);
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$Preprocess$WithKeyframes = function (a) {
	return {$: 5, a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.G);
	});
var $rtfeldman$elm_css$Css$animationName = function (arg) {
	return ((arg.G === 'none') || ((arg.G === 'inherit') || ((arg.G === 'unset') || (arg.G === 'initial')))) ? A2($rtfeldman$elm_css$Css$prop1, 'animation-name', arg) : $rtfeldman$elm_css$Css$Preprocess$WithKeyframes(arg.G);
};
var $rtfeldman$elm_css$Css$auto = {dy: 0, c: 0, ao: 0, aZ: 0, d7: 0, as: 0, M: 0, D: 0, av: 0, B: 0, bb: 0, aB: 0, u: 0, G: 'auto'};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.G);
};
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $rtfeldman$elm_css$Css$flexEnd = $rtfeldman$elm_css$Css$prop1('flex-end');
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2($elm$core$String$cons, '#', str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		ai: 1,
		bf: 0,
		dJ: 0,
		bn: 0,
		bM: 0,
		G: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$toLower = _String_toLower;
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((!results.a.a.$) && (!results.a.b.$)) && (!results.b.a.$)) && (!results.b.b.$)) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				ai: alpha / 255,
				bf: blue,
				dJ: 0,
				bn: green,
				bM: red,
				G: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2('f', 'f'));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2('f', 'f'));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$Internal$printKeyframeSelector = function (_v0) {
	var percentage = _v0.a;
	var properties = _v0.b;
	var propertiesStr = A2(
		$elm$core$String$join,
		'',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var prop = _v1;
				return prop + ';';
			},
			properties));
	var percentageStr = $elm$core$String$fromInt(percentage) + '%';
	return percentageStr + (' {' + (propertiesStr + '}'));
};
var $rtfeldman$elm_css$Css$Internal$compileKeyframes = function (tuples) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Internal$printKeyframeSelector, tuples));
};
var $rtfeldman$elm_css$Css$Animations$keyframes = function (tuples) {
	return $elm$core$List$isEmpty(tuples) ? {by: 0, bG: 0, G: 'none'} : {
		by: 0,
		bG: 0,
		G: $rtfeldman$elm_css$Css$Internal$compileKeyframes(tuples)
	};
};
var $rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.G, argB.G])));
	});
var $rtfeldman$elm_css$Css$margin2 = $rtfeldman$elm_css$Css$prop2('margin');
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $rtfeldman$elm_css$Css$Internal$Property = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Animations$property = F2(
	function (key, value) {
		return key + (':' + value);
	});
var $rtfeldman$elm_css$Css$PxUnits = 0;
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'px');
var $rtfeldman$elm_css$Css$relative = {aM: 0, G: 'relative'};
var $rtfeldman$elm_css$Css$spaceBetween = $rtfeldman$elm_css$Css$prop1('space-between');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $perzanko$elm_loading$Loading$Bars$view = function (config) {
	var withSpeed = function (x) {
		return $elm$core$String$fromFloat(x / config.df);
	};
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto),
			A2($rtfeldman$elm_css$Css$property, 'display', 'flex'),
			$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
			$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$flexEnd)
		]);
	var childStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc / 3.5)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc / 3.5)),
			$rtfeldman$elm_css$Css$borderRadius(
			$rtfeldman$elm_css$Css$px(5)),
			$rtfeldman$elm_css$Css$backgroundColor(
			$rtfeldman$elm_css$Css$hex(config.dJ)),
			A2(
			$rtfeldman$elm_css$Css$property,
			'animation-duration',
			withSpeed(1.5) + 's'),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
			A2($rtfeldman$elm_css$Css$property, 'animation-timing-function', 'ease-in-out'),
			$rtfeldman$elm_css$Css$animationName(
			$rtfeldman$elm_css$Css$Animations$keyframes(
				_List_fromArray(
					[
						_Utils_Tuple2(
						0,
						_List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Animations$property,
								'height',
								$elm$core$String$fromFloat(config.dc / 3.5) + 'px'),
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0)')
							])),
						_Utils_Tuple2(
						50,
						_List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Animations$property,
								'height',
								$elm$core$String$fromFloat(config.dc) + 'px'),
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0)')
							])),
						_Utils_Tuple2(
						100,
						_List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Animations$property,
								'height',
								$elm$core$String$fromFloat(config.dc / 3.5) + 'px'),
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0)')
							]))
					])))
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(1) + 's')
								])))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(0.5) + 's')
								])))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(0.0000001) + 's')
								])))
					]),
				_List_Nil)
			]));
};
var $rtfeldman$elm_css$Css$block = {j: 0, G: 'block'};
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
var $rtfeldman$elm_css$Css$PercentageUnits = 0;
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '%');
var $perzanko$elm_loading$Loading$BouncingBalls$view = function (config) {
	var withSpeed = function (x) {
		return $elm$core$String$fromFloat(x / config.df);
	};
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto),
			A2($rtfeldman$elm_css$Css$property, 'display', 'flex'),
			$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
			$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center)
		]);
	var childStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc / 3.5)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc / 3.5)),
			$rtfeldman$elm_css$Css$borderRadius(
			$rtfeldman$elm_css$Css$pct(100)),
			$rtfeldman$elm_css$Css$backgroundColor(
			$rtfeldman$elm_css$Css$hex(config.dJ)),
			A2(
			$rtfeldman$elm_css$Css$property,
			'animation-duration',
			withSpeed(0.6) + 's'),
			A2(
			$rtfeldman$elm_css$Css$property,
			'animation-delay',
			withSpeed(0.1) + 's'),
			A2($rtfeldman$elm_css$Css$property, 'animation-timing-function', 'linear'),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
			$rtfeldman$elm_css$Css$animationName(
			$rtfeldman$elm_css$Css$Animations$keyframes(
				_List_fromArray(
					[
						_Utils_Tuple2(
						0,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0) translateZ(0) translate(0,0)')
							])),
						_Utils_Tuple2(
						50,
						_List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Animations$property,
								'transform',
								'translate3d(0,0,0) translateZ(0) translate(0,' + ($elm$core$String$fromFloat(config.dc / 3.5) + 'px)'))
							])),
						_Utils_Tuple2(
						100,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0) translateZ(0) translate(0,0)')
							]))
					])))
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(0.1) + 's')
								])))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(0.2) + 's')
								])))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_Utils_ap(
							childStyle,
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$property,
									'animation-delay',
									withSpeed(0.3) + 's')
								])))
					]),
				_List_Nil)
			]));
};
var $rtfeldman$elm_css$Css$absolute = {aM: 0, G: 'absolute'};
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $rtfeldman$elm_css$Css$UnitlessFloat = 0;
var $rtfeldman$elm_css$Css$num = function (val) {
	return {
		Y: 0,
		D: 0,
		eh: 0,
		a3: 0,
		P: val,
		aE: '',
		aS: 0,
		G: $elm$core$String$fromFloat(val)
	};
};
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
var $perzanko$elm_loading$Loading$Circle$view = function (config) {
	var withSpeed = function (x) {
		return $elm$core$String$fromFloat(x / config.df);
	};
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc * 0.95)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto)
		]);
	var childStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc - (2 * (config.dc * 0.17)))),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc - (2 * (config.dc * 0.17)))),
			$rtfeldman$elm_css$Css$borderRadius(
			$rtfeldman$elm_css$Css$pct(50)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
			$rtfeldman$elm_css$Css$top(
			$rtfeldman$elm_css$Css$px(0)),
			$rtfeldman$elm_css$Css$left(
			$rtfeldman$elm_css$Css$px(0)),
			A2(
			$rtfeldman$elm_css$Css$property,
			'animation-duration',
			withSpeed(1.33) + 's'),
			A2($rtfeldman$elm_css$Css$property, 'animation-timing-function', 'cubic-bezier(.51,.92,.24,1.15)'),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
			$rtfeldman$elm_css$Css$animationName(
			$rtfeldman$elm_css$Css$Animations$keyframes(
				_List_fromArray(
					[
						_Utils_Tuple2(
						0,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0) rotate(0deg)')
							])),
						_Utils_Tuple2(
						100,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'translate3d(0,0,0) rotate(720deg)')
							]))
					])))
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						$elm$core$List$concat(
							_List_fromArray(
								[
									childStyle,
									_List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Css$property,
										'border',
										$elm$core$String$fromFloat(config.dc * 0.17) + ('px ' + (config.dJ + ' solid'))),
										$rtfeldman$elm_css$Css$opacity(
										$rtfeldman$elm_css$Css$num(0.25))
									])
								])))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						$elm$core$List$concat(
							_List_fromArray(
								[
									childStyle,
									_List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Css$property,
										'border',
										$elm$core$String$fromFloat(config.dc * 0.17) + 'px transparent solid'),
										A2(
										$rtfeldman$elm_css$Css$property,
										'border-top',
										$elm$core$String$fromFloat(config.dc * 0.17) + ('px ' + (config.dJ + ' solid'))),
										$rtfeldman$elm_css$Css$opacity(
										$rtfeldman$elm_css$Css$num(0.8))
									])
								])))
					]),
				_List_Nil)
			]));
};
var $perzanko$elm_loading$Loading$DoubleBounce$view = function (config) {
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto)
		]);
	var innerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$pct(100)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$pct(100)),
			$rtfeldman$elm_css$Css$borderRadius(
			$rtfeldman$elm_css$Css$pct(50)),
			$rtfeldman$elm_css$Css$backgroundColor(
			$rtfeldman$elm_css$Css$hex(config.dJ)),
			$rtfeldman$elm_css$Css$opacity(
			$rtfeldman$elm_css$Css$num(0.6)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
			$rtfeldman$elm_css$Css$top(
			$rtfeldman$elm_css$Css$px(0)),
			$rtfeldman$elm_css$Css$left(
			$rtfeldman$elm_css$Css$px(0)),
			$rtfeldman$elm_css$Css$animationName(
			$rtfeldman$elm_css$Css$Animations$keyframes(
				_List_fromArray(
					[
						_Utils_Tuple2(
						0,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.0)')
							])),
						_Utils_Tuple2(
						50,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(1.0)')
							])),
						_Utils_Tuple2(
						100,
						_List_fromArray(
							[
								A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.0)')
							]))
					]))),
			A2(
			$rtfeldman$elm_css$Css$property,
			'animation-duration',
			$elm$core$String$fromFloat(2 / config.df) + 's'),
			A2($rtfeldman$elm_css$Css$property, 'animation-timing-function', 'ease-in-out'),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite')
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(innerStyle)
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						$elm$core$List$concat(
							_List_fromArray(
								[
									innerStyle,
									_List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Css$property,
										'animation-delay',
										'-' + ($elm$core$String$fromFloat(1 / config.df) + 's'))
									])
								])))
					]),
				_List_Nil)
			]));
};
var $rtfeldman$elm_css$Css$Structure$PseudoElement = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$pseudoElement = function (element) {
	return $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement(element);
};
var $rtfeldman$elm_css$Css$after = $rtfeldman$elm_css$Css$pseudoElement('after');
var $rtfeldman$elm_css$Css$before = $rtfeldman$elm_css$Css$pseudoElement('before');
var $rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.G, argB.G, argC.G])));
	});
var $rtfeldman$elm_css$Css$border3 = $rtfeldman$elm_css$Css$prop3('border');
var $rtfeldman$elm_css$Css$Animations$opacity = function (_v0) {
	var value = _v0.G;
	return 'opacity:' + value;
};
var $rtfeldman$elm_css$Css$solid = {r: 0, ad: 0, G: 'solid'};
var $perzanko$elm_loading$Loading$Sonar$view = function (config) {
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto),
			$rtfeldman$elm_css$Css$before(
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$property, 'content', '\' \''),
					$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
					$rtfeldman$elm_css$Css$borderRadius(
					$rtfeldman$elm_css$Css$pct(50)),
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$px(config.dc / 3)),
					$rtfeldman$elm_css$Css$height(
					$rtfeldman$elm_css$Css$px(config.dc / 3)),
					A2(
					$rtfeldman$elm_css$Css$property,
					'top',
					'calc(50% - ' + ($elm$core$String$fromFloat(config.dc / 6) + 'px)')),
					A2(
					$rtfeldman$elm_css$Css$property,
					'left',
					'calc(50% - ' + ($elm$core$String$fromFloat(config.dc / 6) + 'px)')),
					$rtfeldman$elm_css$Css$backgroundColor(
					$rtfeldman$elm_css$Css$hex(config.dJ)),
					A2(
					$rtfeldman$elm_css$Css$property,
					'animation-duration',
					$elm$core$String$fromFloat(3 / config.df) + 's'),
					A2($rtfeldman$elm_css$Css$property, 'animation-timing-funtion', 'linear'),
					A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
					$rtfeldman$elm_css$Css$animationName(
					$rtfeldman$elm_css$Css$Animations$keyframes(
						_List_fromArray(
							[
								_Utils_Tuple2(
								0,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(1))
									])),
								_Utils_Tuple2(
								15,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(1)),
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.5)')
									])),
								_Utils_Tuple2(
								60,
								_List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(4)'),
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0))
									])),
								_Utils_Tuple2(
								90,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0)),
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(3)')
									])),
								_Utils_Tuple2(
								95,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(1))
									])),
								_Utils_Tuple2(
								100,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(1)),
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(1)')
									]))
							])))
				])),
			$rtfeldman$elm_css$Css$after(
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$property, 'content', '\' \''),
					$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
					$rtfeldman$elm_css$Css$borderRadius(
					$rtfeldman$elm_css$Css$pct(50)),
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$px(config.dc / 3)),
					$rtfeldman$elm_css$Css$height(
					$rtfeldman$elm_css$Css$px(config.dc / 3)),
					A2(
					$rtfeldman$elm_css$Css$property,
					'top',
					'calc(50% - ' + ($elm$core$String$fromFloat(config.dc / 6) + 'px)')),
					A2(
					$rtfeldman$elm_css$Css$property,
					'left',
					'calc(50% - ' + ($elm$core$String$fromFloat(config.dc / 6) + 'px)')),
					A3(
					$rtfeldman$elm_css$Css$border3,
					$rtfeldman$elm_css$Css$px(1),
					$rtfeldman$elm_css$Css$solid,
					$rtfeldman$elm_css$Css$hex(config.dJ)),
					$rtfeldman$elm_css$Css$opacity(
					$rtfeldman$elm_css$Css$num(0)),
					A2(
					$rtfeldman$elm_css$Css$property,
					'animation-duration',
					$elm$core$String$fromFloat(3 / config.df) + 's'),
					A2($rtfeldman$elm_css$Css$property, 'animation-timing-funtion', 'linear'),
					A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
					$rtfeldman$elm_css$Css$animationName(
					$rtfeldman$elm_css$Css$Animations$keyframes(
						_List_fromArray(
							[
								_Utils_Tuple2(
								0,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0)),
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(1)')
									])),
								_Utils_Tuple2(
								30,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0)),
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(1)')
									])),
								_Utils_Tuple2(
								60,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0.3))
									])),
								_Utils_Tuple2(
								90,
								_List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(3)')
									])),
								_Utils_Tuple2(
								100,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$Animations$opacity(
										$rtfeldman$elm_css$Css$num(0))
									]))
							])))
				]))
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_Nil);
};
var $perzanko$elm_loading$Loading$Spinner$view = function (config) {
	var outerStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$px(config.dc)),
			$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
			A2(
			$rtfeldman$elm_css$Css$margin2,
			$rtfeldman$elm_css$Css$px(0),
			$rtfeldman$elm_css$Css$auto)
		]);
	var childs = A2($elm$core$List$range, 1, 12);
	var childStyle = _List_fromArray(
		[
			$rtfeldman$elm_css$Css$width(
			$rtfeldman$elm_css$Css$pct(100)),
			$rtfeldman$elm_css$Css$height(
			$rtfeldman$elm_css$Css$pct(100))
		]);
	var calcAnimationDelay = function (x) {
		return (x === 1) ? '0s' : ($elm$core$String$fromFloat(-((1.1 - (x / 10)) / config.df)) + 's');
	};
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(outerStyle),
				$rtfeldman$elm_css$Html$Styled$Attributes$class(config.cj)
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil)
					]),
				A2(
					$elm$core$List$map,
					function (x) {
						return A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$width(
											$rtfeldman$elm_css$Css$pct(100)),
											$rtfeldman$elm_css$Css$height(
											$rtfeldman$elm_css$Css$pct(100)),
											$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
											$rtfeldman$elm_css$Css$left(
											$rtfeldman$elm_css$Css$px(0)),
											$rtfeldman$elm_css$Css$top(
											$rtfeldman$elm_css$Css$px(0)),
											A2(
											$rtfeldman$elm_css$Css$property,
											'transform',
											'rotate(' + ($elm$core$String$fromInt((30 * x) - 30) + 'deg)')),
											$rtfeldman$elm_css$Css$before(
											_List_fromArray(
												[
													A2(
													$rtfeldman$elm_css$Css$property,
													'animation-delay',
													calcAnimationDelay(x)),
													A2($rtfeldman$elm_css$Css$property, 'content', '\' \''),
													$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
													A2(
													$rtfeldman$elm_css$Css$margin2,
													$rtfeldman$elm_css$Css$px(0),
													$rtfeldman$elm_css$Css$auto),
													$rtfeldman$elm_css$Css$width(
													$rtfeldman$elm_css$Css$pct(15)),
													$rtfeldman$elm_css$Css$height(
													$rtfeldman$elm_css$Css$pct(15)),
													$rtfeldman$elm_css$Css$backgroundColor(
													$rtfeldman$elm_css$Css$hex(config.dJ)),
													$rtfeldman$elm_css$Css$borderRadius(
													$rtfeldman$elm_css$Css$pct(100)),
													A2(
													$rtfeldman$elm_css$Css$property,
													'animation-duration',
													$elm$core$String$fromFloat(1.2 / config.df) + 's'),
													A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite'),
													A2($rtfeldman$elm_css$Css$property, 'animation-fill-mode', 'both'),
													$rtfeldman$elm_css$Css$animationName(
													$rtfeldman$elm_css$Css$Animations$keyframes(
														_List_fromArray(
															[
																_Utils_Tuple2(
																0,
																_List_fromArray(
																	[
																		A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.0)')
																	])),
																_Utils_Tuple2(
																40,
																_List_fromArray(
																	[
																		A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(1.0)')
																	])),
																_Utils_Tuple2(
																80,
																_List_fromArray(
																	[
																		A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.0)')
																	])),
																_Utils_Tuple2(
																100,
																_List_fromArray(
																	[
																		A2($rtfeldman$elm_css$Css$Animations$property, 'transform', 'scale(0.0)')
																	]))
															])))
												]))
										]))
								]),
							_List_Nil);
					},
					childs))
			]));
};
var $perzanko$elm_loading$Loading$render = F3(
	function (loaderType, config, loadingState) {
		var loader = function () {
			switch (loaderType) {
				case 0:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$DoubleBounce$view(config));
				case 1:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$Spinner$view(config));
				case 2:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$BouncingBalls$view(config));
				case 3:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$Bars$view(config));
				case 4:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$Circle$view(config));
				default:
					return $rtfeldman$elm_css$Html$Styled$toUnstyled(
						$perzanko$elm_loading$Loading$Sonar$view(config));
			}
		}();
		if (!loadingState) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('loading')
					]),
				_List_fromArray(
					[loader]));
		} else {
			return $elm$html$Html$text(' ');
		}
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$sub = _VirtualDom_node('sub');
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$html$Html$sup = _VirtualDom_node('sup');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $terezka$line_charts$Internal$Junk$addBelow = F2(
	function (below, layers) {
		return _Utils_update(
			layers,
			{
				aI: _Utils_ap(below, layers.aI)
			});
	});
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $terezka$line_charts$Internal$Coordinate$lengthX = function (system) {
	return A2($elm$core$Basics$max, 1, (system.aY.dc.dr - system.aY.eb.cL) - system.aY.eb.eq);
};
var $terezka$line_charts$Internal$Coordinate$lengthY = function (system) {
	return A2($elm$core$Basics$max, 1, (system.aY.dc.cy - system.aY.eb.dG) - system.aY.eb.dk);
};
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $terezka$line_charts$LineChart$chartAreaAttributes = function (system) {
	return _List_fromArray(
		[
			$elm$svg$Svg$Attributes$x(
			$elm$core$String$fromFloat(system.aY.eb.cL)),
			$elm$svg$Svg$Attributes$y(
			$elm$core$String$fromFloat(system.aY.eb.dk)),
			$elm$svg$Svg$Attributes$width(
			$elm$core$String$fromFloat(
				$terezka$line_charts$Internal$Coordinate$lengthX(system))),
			$elm$svg$Svg$Attributes$height(
			$elm$core$String$fromFloat(
				$terezka$line_charts$Internal$Coordinate$lengthY(system)))
		]);
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $terezka$line_charts$Internal$Events$toChartAttributes = F3(
	function (data, system, _v0) {
		var events = _v0;
		var order = function (_v1) {
			var outside = _v1.a;
			var event = _v1.b;
			return outside ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(event, data, system));
		};
		return A2($elm$core$List$filterMap, order, events);
	});
var $terezka$line_charts$LineChart$chartAreaPlatform = F3(
	function (config, data, system) {
		var attributes = $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('transparent')
					]),
					$terezka$line_charts$LineChart$chartAreaAttributes(system),
					A3($terezka$line_charts$Internal$Events$toChartAttributes, data, system, config.dS)
				]));
		return A2($elm$svg$Svg$rect, attributes, _List_Nil);
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$clipPath = $elm$svg$Svg$trustedNode('clipPath');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $terezka$line_charts$Internal$Utils$toChartAreaId = function (id) {
	return 'chart__chart-area--' + id;
};
var $terezka$line_charts$LineChart$clipPath = function (system) {
	return A2(
		$elm$svg$Svg$clipPath,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id(
				$terezka$line_charts$Internal$Utils$toChartAreaId(system.dY))
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				$terezka$line_charts$LineChart$chartAreaAttributes(system),
				_List_Nil)
			]));
};
var $terezka$line_charts$Internal$Line$color = F3(
	function (_v0, _v1, data_) {
		var config = _v0;
		var line_ = _v1;
		var _v2 = config(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.eF;
				},
				data_));
		var style_ = _v2;
		return style_.dJ(line_.dJ);
	});
var $terezka$line_charts$Internal$Container$properties = F2(
	function (f, _v0) {
		var properties_ = _v0;
		return f(properties_);
	});
var $terezka$line_charts$Internal$Container$sizeStyles = F3(
	function (_v0, width, height) {
		var properties_ = _v0;
		var _v1 = properties_.dc;
		if (!_v1) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'height',
					$elm$core$String$fromFloat(height) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'width',
					$elm$core$String$fromFloat(width) + 'px')
				]);
		} else {
			return _List_Nil;
		}
	});
var $terezka$line_charts$LineChart$container = F4(
	function (config, _v0, junkHtml, plot) {
		var frame = _v0.aY;
		var userAttributes = A2(
			$terezka$line_charts$Internal$Container$properties,
			function ($) {
				return $.dC;
			},
			config.dL);
		var sizeStyles = A3($terezka$line_charts$Internal$Container$sizeStyles, config.dL, frame.dc.dr, frame.dc.cy);
		var styles = A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'position', 'relative'),
			sizeStyles);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(styles, userAttributes),
			A2($elm$core$List$cons, plot, junkHtml));
	});
var $terezka$line_charts$Internal$Line$data = function (_v0) {
	var config = _v0;
	return config.bg;
};
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $terezka$line_charts$Internal$Junk$getLayers = F5(
	function (series, toX, toY, system, _v0) {
		var toLayers = _v0;
		return A4(toLayers, series, toX, toY, system);
	});
var $terezka$line_charts$Internal$Line$label = function (_v0) {
	var config = _v0;
	return config.cK;
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $terezka$line_charts$Internal$Events$toContainerAttributes = F3(
	function (data, system, _v0) {
		var events = _v0;
		var order = function (_v1) {
			var outside = _v1.a;
			var event = _v1.b;
			return outside ? $elm$core$Maybe$Just(
				A2(event, data, system)) : $elm$core$Maybe$Nothing;
		};
		return A2($elm$core$List$filterMap, order, events);
	});
var $terezka$line_charts$Internal$Data$Data = F3(
	function (user, point, isReal) {
		return {d5: isReal, em: point, eF: user};
	});
var $terezka$line_charts$LineChart$setY = F2(
	function (datum, y) {
		return A3(
			$terezka$line_charts$Internal$Data$Data,
			datum.eF,
			A2($terezka$line_charts$Internal$Data$Point, datum.em.ds, y),
			datum.d5);
	});
var $terezka$line_charts$LineChart$normalize = function (datasets) {
	if (datasets.b) {
		var highest = datasets.a;
		var belows = datasets.b;
		var toPercentage = F2(
			function (highest_, datum) {
				return A2($terezka$line_charts$LineChart$setY, datum, (100 * datum.em.dt) / highest_.em.dt);
			});
		return A2(
			$elm$core$List$map,
			A2($elm$core$List$map2, toPercentage, highest),
			A2($elm$core$List$cons, highest, belows));
	} else {
		return datasets;
	}
};
var $terezka$line_charts$Internal$Utils$withFirst = F2(
	function (stuff, process) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return $elm$core$Maybe$Just(
				A2(process, first, rest));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $terezka$line_charts$LineChart$addBelows = F2(
	function (alldata, dataBelowAll) {
		var add = F2(
			function (below, datum) {
				return A2($terezka$line_charts$LineChart$setY, below, below.em.dt + datum.em.dt);
			});
		var iterate = F4(
			function (datum0, dataTop, dataBelowTop, result) {
				iterate:
				while (true) {
					var _v0 = _Utils_Tuple2(dataTop, dataBelowTop);
					if (_v0.a.b) {
						if (_v0.b.b) {
							var _v1 = _v0.a;
							var datum1 = _v1.a;
							var data = _v1.b;
							var _v2 = _v0.b;
							var datumBelow = _v2.a;
							var dataBelow = _v2.b;
							if (_Utils_cmp(datum1.em.ds, datumBelow.em.ds) > 0) {
								if (datumBelow.d5) {
									var $temp$datum0 = datum0,
										$temp$dataTop = A2($elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										$elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								} else {
									var breakdata = _Utils_update(
										datum0,
										{d5: false});
									var $temp$datum0 = datum0,
										$temp$dataTop = A2($elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										$elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								}
							} else {
								var $temp$datum0 = datum1,
									$temp$dataTop = data,
									$temp$dataBelowTop = A2($elm$core$List$cons, datumBelow, dataBelow),
									$temp$result = result;
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							var _v4 = _v0.a;
							var datum1 = _v4.a;
							var data = _v4.b;
							return result;
						}
					} else {
						if (_v0.b.b) {
							var _v3 = _v0.b;
							var datumBelow = _v3.a;
							var dataBelow = _v3.b;
							if (_Utils_cmp(datum0.em.ds, datumBelow.em.ds) < 1) {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2(
									$elm$core$List$cons,
									A2(add, datumBelow, datum0),
									result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							} else {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2($elm$core$List$cons, datumBelow, result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							return result;
						}
					}
				}
			});
		return $elm$core$List$reverse(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$terezka$line_charts$Internal$Utils$withFirst,
					alldata,
					F2(
						function (first, rest) {
							return A4(iterate, first, rest, dataBelowAll, _List_Nil);
						}))));
	});
var $terezka$line_charts$LineChart$stack = function (dataset) {
	var stackBelows = F2(
		function (dataset_, result) {
			if (dataset_.b) {
				var data = dataset_.a;
				var belows = dataset_.b;
				return A2(
					stackBelows,
					belows,
					A2(
						$elm$core$List$cons,
						A3($elm$core$List$foldl, $terezka$line_charts$LineChart$addBelows, data, belows),
						result));
			} else {
				return result;
			}
		});
	return $elm$core$List$reverse(
		A2(stackBelows, dataset, _List_Nil));
};
var $terezka$line_charts$Internal$Axis$variable = function (_v0) {
	var config = _v0;
	return config.eG;
};
var $terezka$line_charts$LineChart$toDataPoints = F2(
	function (config, lines) {
		var y = $terezka$line_charts$Internal$Axis$variable(config.dt);
		var x = $terezka$line_charts$Internal$Axis$variable(config.ds);
		var addPoint = function (datum) {
			var _v1 = _Utils_Tuple2(
				x(datum),
				y(datum));
			if (!_v1.a.$) {
				if (!_v1.b.$) {
					var x_ = _v1.a.a;
					var y_ = _v1.b.a;
					return $elm$core$Maybe$Just(
						A3(
							$terezka$line_charts$Internal$Data$Data,
							datum,
							A2($terezka$line_charts$Internal$Data$Point, x_, y_),
							true));
				} else {
					var x_ = _v1.a.a;
					var _v2 = _v1.b;
					return $elm$core$Maybe$Just(
						A3(
							$terezka$line_charts$Internal$Data$Data,
							datum,
							A2($terezka$line_charts$Internal$Data$Point, x_, 0),
							false));
				}
			} else {
				if (!_v1.b.$) {
					var _v3 = _v1.a;
					var y_ = _v1.b.a;
					return $elm$core$Maybe$Nothing;
				} else {
					var _v4 = _v1.a;
					var _v5 = _v1.b;
					return $elm$core$Maybe$Nothing;
				}
			}
		};
		var data = A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$terezka$line_charts$Internal$Line$data,
				$elm$core$List$filterMap(addPoint)),
			lines);
		var _v0 = config.dA;
		switch (_v0.$) {
			case 0:
				return data;
			case 1:
				return data;
			case 2:
				return $terezka$line_charts$LineChart$stack(data);
			default:
				return $terezka$line_charts$LineChart$normalize(
					$terezka$line_charts$LineChart$stack(data));
		}
	});
var $terezka$line_charts$Internal$Coordinate$Frame = F2(
	function (margin, size) {
		return {eb: margin, dc: size};
	});
var $terezka$line_charts$Internal$Coordinate$Size = F2(
	function (width, height) {
		return {cy: height, dr: width};
	});
var $terezka$line_charts$LineChart$Coordinate$Range = F2(
	function (min, max) {
		return {a$: max, a0: min};
	});
var $terezka$line_charts$Internal$Coordinate$reachX = function (system) {
	var diff = system.ds.a$ - system.ds.a0;
	return (diff > 0) ? diff : 1;
};
var $terezka$line_charts$LineChart$Coordinate$scaleDataX = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$reachX(system)) / $terezka$line_charts$Internal$Coordinate$lengthX(system);
	});
var $terezka$line_charts$Internal$Axis$Range$applyX = F2(
	function (range, system) {
		switch (range.$) {
			case 0:
				var padMin = range.a;
				var padMax = range.b;
				var _v1 = system;
				var frame = _v1.aY;
				var _v2 = frame;
				var size = _v2.dc;
				var system_ = _Utils_update(
					system,
					{
						aY: _Utils_update(
							frame,
							{
								dc: _Utils_update(
									size,
									{
										dr: A2($elm$core$Basics$max, 1, (size.dr - padMin) - padMax)
									})
							})
					});
				var scale = $terezka$line_charts$LineChart$Coordinate$scaleDataX(system_);
				return A2(
					$terezka$line_charts$LineChart$Coordinate$Range,
					system.ds.a0 - scale(padMin),
					system.ds.a$ + scale(padMax));
			case 1:
				var min = range.a;
				var max = range.b;
				return A2($terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.ds);
		}
	});
var $terezka$line_charts$Internal$Coordinate$reachY = function (system) {
	var diff = system.dt.a$ - system.dt.a0;
	return (diff > 0) ? diff : 1;
};
var $terezka$line_charts$LineChart$Coordinate$scaleDataY = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$reachY(system)) / $terezka$line_charts$Internal$Coordinate$lengthY(system);
	});
var $terezka$line_charts$Internal$Axis$Range$applyY = F2(
	function (range, system) {
		switch (range.$) {
			case 0:
				var padMin = range.a;
				var padMax = range.b;
				var _v1 = system;
				var frame = _v1.aY;
				var _v2 = frame;
				var size = _v2.dc;
				var system_ = _Utils_update(
					system,
					{
						aY: _Utils_update(
							frame,
							{
								dc: _Utils_update(
									size,
									{
										cy: A2($elm$core$Basics$max, 1, (size.cy - padMin) - padMax)
									})
							})
					});
				var scale = $terezka$line_charts$LineChart$Coordinate$scaleDataY(system_);
				return A2(
					$terezka$line_charts$LineChart$Coordinate$Range,
					system.dt.a0 - scale(padMin),
					system.dt.a$ + scale(padMax));
			case 1:
				var min = range.a;
				var max = range.b;
				return A2($terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.dt);
		}
	});
var $terezka$line_charts$Internal$Coordinate$ground = function (range_) {
	return _Utils_update(
		range_,
		{
			a0: A2($elm$core$Basics$min, range_.a0, 0)
		});
};
var $terezka$line_charts$Internal$Area$hasArea = function (config) {
	switch (config.$) {
		case 0:
			return false;
		case 1:
			return true;
		case 2:
			return true;
		default:
			return true;
	}
};
var $terezka$line_charts$Internal$Axis$pixels = function (_v0) {
	var config = _v0;
	return config.el;
};
var $terezka$line_charts$Internal$Axis$range = function (_v0) {
	var config = _v0;
	return config.eo;
};
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $terezka$line_charts$Internal$Coordinate$maximum = function (toValue) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(toValue),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$maximum,
			$elm$core$Maybe$withDefault(1)));
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $terezka$line_charts$Internal$Coordinate$minimum = function (toValue) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(toValue),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$minimum,
			$elm$core$Maybe$withDefault(0)));
};
var $terezka$line_charts$Internal$Coordinate$range = F2(
	function (toValue, data) {
		var range_ = {
			a$: A2($terezka$line_charts$Internal$Coordinate$maximum, toValue, data),
			a0: A2($terezka$line_charts$Internal$Coordinate$minimum, toValue, data)
		};
		return _Utils_eq(range_.a0, range_.a$) ? _Utils_update(
			range_,
			{a$: range_.a$ + 1}) : range_;
	});
var $terezka$line_charts$LineChart$toSystem = F2(
	function (config, data) {
		var yRange = A2(
			$terezka$line_charts$Internal$Coordinate$range,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.em;
				},
				function ($) {
					return $.dt;
				}),
			data);
		var xRange = A2(
			$terezka$line_charts$Internal$Coordinate$range,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.em;
				},
				function ($) {
					return $.ds;
				}),
			data);
		var size = A2(
			$terezka$line_charts$Internal$Coordinate$Size,
			$terezka$line_charts$Internal$Axis$pixels(config.ds),
			$terezka$line_charts$Internal$Axis$pixels(config.dt));
		var hasArea = $terezka$line_charts$Internal$Area$hasArea(config.dA);
		var container_ = A2($terezka$line_charts$Internal$Container$properties, $elm$core$Basics$identity, config.dL);
		var frame = A2($terezka$line_charts$Internal$Coordinate$Frame, container_.eb, size);
		var adjustDomainRange = function (domain) {
			return hasArea ? $terezka$line_charts$Internal$Coordinate$ground(domain) : domain;
		};
		var system = {
			aY: frame,
			dY: container_.dY,
			ds: xRange,
			b2: xRange,
			dt: adjustDomainRange(yRange),
			b3: yRange
		};
		return _Utils_update(
			system,
			{
				ds: A2(
					$terezka$line_charts$Internal$Axis$Range$applyX,
					$terezka$line_charts$Internal$Axis$range(config.ds),
					system),
				dt: A2(
					$terezka$line_charts$Internal$Axis$Range$applyY,
					$terezka$line_charts$Internal$Axis$range(config.dt),
					system)
			});
	});
var $terezka$line_charts$Internal$Axis$ticks = function (_v0) {
	var config = _v0;
	return config.ev;
};
var $terezka$line_charts$Internal$Axis$Tick$properties = function (_v0) {
	var properties_ = _v0;
	return properties_;
};
var $terezka$line_charts$Internal$Axis$Ticks$ticks = F3(
	function (dataRange, range, _v0) {
		var values = _v0;
		return A2(
			$elm$core$List$map,
			$terezka$line_charts$Internal$Axis$Tick$properties,
			A2(values, dataRange, range));
	});
var $terezka$line_charts$LineChart$Coordinate$Point = F2(
	function (x, y) {
		return {ds: x, dt: y};
	});
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $terezka$line_charts$Internal$Svg$gridDot = F3(
	function (radius, color, point) {
		return A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx(
					$elm$core$String$fromFloat(point.ds)),
					$elm$svg$Svg$Attributes$cy(
					$elm$core$String$fromFloat(point.dt)),
					$elm$svg$Svg$Attributes$r(
					$elm$core$String$fromFloat(radius)),
					$elm$svg$Svg$Attributes$fill(
					$avh4$elm_color$Color$toCssString(color))
				]),
			_List_Nil);
	});
var $terezka$line_charts$LineChart$Coordinate$scaleSvgX = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$lengthX(system)) / $terezka$line_charts$Internal$Coordinate$reachX(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toSvgX = F2(
	function (system, value) {
		return A2($terezka$line_charts$LineChart$Coordinate$scaleSvgX, system, value - system.ds.a0) + system.aY.eb.cL;
	});
var $terezka$line_charts$LineChart$Coordinate$scaleSvgY = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$lengthY(system)) / $terezka$line_charts$Internal$Coordinate$reachY(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toSvgY = F2(
	function (system, value) {
		return A2($terezka$line_charts$LineChart$Coordinate$scaleSvgY, system, system.dt.a$ - value) + system.aY.eb.dk;
	});
var $terezka$line_charts$LineChart$Coordinate$toSvg = F2(
	function (system, point) {
		return {
			ds: A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, point.ds),
			dt: A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, point.dt)
		};
	});
var $terezka$line_charts$Internal$Grid$viewDots = F5(
	function (system, verticals, horizontals, radius, color) {
		var dot = F2(
			function (x, y) {
				return A2(
					$terezka$line_charts$LineChart$Coordinate$toSvg,
					system,
					A2($terezka$line_charts$LineChart$Coordinate$Point, x, y));
			});
		var dots_ = function (g) {
			return A2(
				$elm$core$List$map,
				dot(g),
				horizontals);
		};
		var alldots = A2($elm$core$List$concatMap, dots_, verticals);
		return A2(
			$elm$core$List$map,
			A2($terezka$line_charts$Internal$Svg$gridDot, radius, color),
			alldots);
	});
var $terezka$line_charts$Internal$Utils$concat = F3(
	function (first, second, third) {
		return _Utils_ap(
			first,
			_Utils_ap(second, third));
	});
var $terezka$line_charts$Internal$Path$Line = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Path$Move = function (a) {
	return {$: 0, a: a};
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $terezka$line_charts$Internal$Path$join = function (commands) {
	return A2($elm$core$String$join, ' ', commands);
};
var $terezka$line_charts$Internal$Path$bool = function (bool_) {
	return bool_ ? '1' : '0';
};
var $terezka$line_charts$Internal$Path$point = function (point_) {
	return $elm$core$String$fromFloat(point_.ds) + (' ' + $elm$core$String$fromFloat(point_.dt));
};
var $terezka$line_charts$Internal$Path$points = function (points_) {
	return A2(
		$elm$core$String$join,
		',',
		A2($elm$core$List$map, $terezka$line_charts$Internal$Path$point, points_));
};
var $terezka$line_charts$Internal$Path$toString = function (command) {
	switch (command.$) {
		case 9:
			return 'Z';
		case 0:
			var p = command.a;
			return 'M' + $terezka$line_charts$Internal$Path$point(p);
		case 1:
			var p = command.a;
			return 'L' + $terezka$line_charts$Internal$Path$point(p);
		case 2:
			var x = command.a;
			return 'H' + $elm$core$String$fromFloat(x);
		case 3:
			var y = command.a;
			return 'V' + $elm$core$String$fromFloat(y);
		case 4:
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return 'C' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, c2, p]));
		case 5:
			var c1 = command.a;
			var p = command.b;
			return 'Q' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 6:
			var c1 = command.a;
			var p = command.b;
			return 'Q' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 7:
			var p = command.a;
			return 'T' + $terezka$line_charts$Internal$Path$point(p);
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return 'A' + $terezka$line_charts$Internal$Path$join(
				_List_fromArray(
					[
						$elm$core$String$fromFloat(rx),
						$elm$core$String$fromFloat(ry),
						$elm$core$String$fromInt(xAxisRotation),
						$terezka$line_charts$Internal$Path$bool(largeArcFlag),
						$terezka$line_charts$Internal$Path$bool(sweepFlag),
						$terezka$line_charts$Internal$Path$point(p)
					]));
	}
};
var $terezka$line_charts$Internal$Path$Arc = F6(
	function (a, b, c, d, e, f) {
		return {$: 8, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $terezka$line_charts$Internal$Path$Close = {$: 9};
var $terezka$line_charts$Internal$Path$CubicBeziers = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $terezka$line_charts$Internal$Path$CubicBeziersShort = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $terezka$line_charts$Internal$Path$Horizontal = function (a) {
	return {$: 2, a: a};
};
var $terezka$line_charts$Internal$Path$QuadraticBeziers = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $terezka$line_charts$Internal$Path$QuadraticBeziersShort = function (a) {
	return {$: 7, a: a};
};
var $terezka$line_charts$Internal$Path$Vertical = function (a) {
	return {$: 3, a: a};
};
var $terezka$line_charts$Internal$Path$translate = F2(
	function (system, command) {
		switch (command.$) {
			case 0:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$Move(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 1:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$Line(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 2:
				var x = command.a;
				return $terezka$line_charts$Internal$Path$Horizontal(
					A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x));
			case 3:
				var y = command.a;
				return $terezka$line_charts$Internal$Path$Vertical(
					A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
			case 4:
				var c1 = command.a;
				var c2 = command.b;
				var p = command.c;
				return A3(
					$terezka$line_charts$Internal$Path$CubicBeziers,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c2),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 5:
				var c1 = command.a;
				var p = command.b;
				return A2(
					$terezka$line_charts$Internal$Path$CubicBeziersShort,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 6:
				var c1 = command.a;
				var p = command.b;
				return A2(
					$terezka$line_charts$Internal$Path$QuadraticBeziers,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 7:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$QuadraticBeziersShort(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 8:
				var rx = command.a;
				var ry = command.b;
				var xAxisRotation = command.c;
				var largeArcFlag = command.d;
				var sweepFlag = command.e;
				var p = command.f;
				return A6(
					$terezka$line_charts$Internal$Path$Arc,
					rx,
					ry,
					xAxisRotation,
					largeArcFlag,
					sweepFlag,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			default:
				return $terezka$line_charts$Internal$Path$Close;
		}
	});
var $terezka$line_charts$Internal$Path$description = F2(
	function (system, commands) {
		return $terezka$line_charts$Internal$Path$join(
			A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					$terezka$line_charts$Internal$Path$translate(system),
					$terezka$line_charts$Internal$Path$toString),
				commands));
	});
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $terezka$line_charts$Internal$Path$viewPath = function (attributes) {
	return A2($elm$svg$Svg$path, attributes, _List_Nil);
};
var $terezka$line_charts$Internal$Path$view = F3(
	function (system, attributes, commands) {
		return $terezka$line_charts$Internal$Path$viewPath(
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						A2($terezka$line_charts$Internal$Path$description, system, commands))
					])));
	});
var $terezka$line_charts$Internal$Svg$horizontal = F5(
	function (system, userAttributes, y, x1, x2) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			$terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Path$Move(
					{ds: x1, dt: y}),
					$terezka$line_charts$Internal$Path$Line(
					{ds: x1, dt: y}),
					$terezka$line_charts$Internal$Path$Line(
					{ds: x2, dt: y})
				]));
	});
var $terezka$line_charts$Internal$Svg$horizontalGrid = F3(
	function (system, userAttributes, y) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5($terezka$line_charts$Internal$Svg$horizontal, system, attributes, y, system.ds.a0, system.ds.a$);
	});
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $terezka$line_charts$Internal$Svg$vertical = F5(
	function (system, userAttributes, x, y1, y2) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			$terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Path$Move(
					{ds: x, dt: y1}),
					$terezka$line_charts$Internal$Path$Line(
					{ds: x, dt: y1}),
					$terezka$line_charts$Internal$Path$Line(
					{ds: x, dt: y2})
				]));
	});
var $terezka$line_charts$Internal$Svg$verticalGrid = F3(
	function (system, userAttributes, x) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5($terezka$line_charts$Internal$Svg$vertical, system, attributes, x, system.dt.a0, system.dt.a$);
	});
var $terezka$line_charts$Internal$Grid$viewLines = F5(
	function (system, verticals, horizontals, width, color) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$strokeWidth(
				$elm$core$String$fromFloat(width)),
				$elm$svg$Svg$Attributes$stroke(
				$avh4$elm_color$Color$toCssString(color))
			]);
		return _Utils_ap(
			A2(
				$elm$core$List$map,
				A2($terezka$line_charts$Internal$Svg$horizontalGrid, system, attributes),
				horizontals),
			A2(
				$elm$core$List$map,
				A2($terezka$line_charts$Internal$Svg$verticalGrid, system, attributes),
				verticals));
	});
var $terezka$line_charts$Internal$Grid$view = F4(
	function (system, xAxis, yAxis, grid) {
		var hasGrid = function (tick) {
			return tick.dU ? $elm$core$Maybe$Just(tick.aM) : $elm$core$Maybe$Nothing;
		};
		var horizontals = A2(
			$elm$core$List$filterMap,
			hasGrid,
			A3(
				$terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.b3,
				system.dt,
				$terezka$line_charts$Internal$Axis$ticks(yAxis)));
		var verticals = A2(
			$elm$core$List$filterMap,
			hasGrid,
			A3(
				$terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.b2,
				system.ds,
				$terezka$line_charts$Internal$Axis$ticks(xAxis)));
		if (!grid.$) {
			var radius = grid.a;
			var color = grid.b;
			return A5($terezka$line_charts$Internal$Grid$viewDots, system, verticals, horizontals, radius, color);
		} else {
			var width = grid.a;
			var color = grid.b;
			return A5($terezka$line_charts$Internal$Grid$viewLines, system, verticals, horizontals, width, color);
		}
	});
var $terezka$line_charts$Internal$Svg$End = 2;
var $terezka$line_charts$Internal$Svg$Start = 0;
var $terezka$line_charts$Internal$Svg$anchorStyle = function (anchor) {
	var anchorString = function () {
		switch (anchor) {
			case 0:
				return 'start';
			case 1:
				return 'middle';
			default:
				return 'end';
		}
	}();
	return $elm$svg$Svg$Attributes$style('text-anchor: ' + (anchorString + ';'));
};
var $terezka$line_charts$Internal$Svg$Transfrom = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $terezka$line_charts$Internal$Svg$move = F3(
	function (system, x, y) {
		return A2(
			$terezka$line_charts$Internal$Svg$Transfrom,
			A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x),
			A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
	});
var $terezka$line_charts$Internal$Svg$offset = F2(
	function (x, y) {
		return A2($terezka$line_charts$Internal$Svg$Transfrom, x, y);
	});
var $terezka$line_charts$Internal$Svg$addPosition = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var xf = _v1.a;
		var yf = _v1.b;
		return A2($terezka$line_charts$Internal$Svg$Transfrom, xf + x, yf + y);
	});
var $terezka$line_charts$Internal$Svg$toPosition = A2(
	$elm$core$List$foldr,
	$terezka$line_charts$Internal$Svg$addPosition,
	A2($terezka$line_charts$Internal$Svg$Transfrom, 0, 0));
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $terezka$line_charts$Internal$Svg$transform = function (translations) {
	var _v0 = $terezka$line_charts$Internal$Svg$toPosition(translations);
	var x = _v0.a;
	var y = _v0.b;
	return $elm$svg$Svg$Attributes$transform(
		'translate(' + ($elm$core$String$fromFloat(x) + (', ' + ($elm$core$String$fromFloat(y) + ')'))));
};
var $terezka$line_charts$Internal$Utils$viewMaybe = F2(
	function (a, view) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$svg$Svg$text(''),
			A2($elm$core$Maybe$map, view, a));
	});
var $terezka$line_charts$Internal$Legends$viewFree = F5(
	function (system, placement, viewLabel, line, data) {
		var _v0 = function () {
			if (!placement) {
				return _Utils_Tuple3(data, 2, -10);
			} else {
				return _Utils_Tuple3(
					$elm$core$List$reverse(data),
					0,
					10);
			}
		}();
		var orderedPoints = _v0.a;
		var anchor = _v0.b;
		var xOffset = _v0.c;
		var transform = function (_v3) {
			var x = _v3.ds;
			var y = _v3.dt;
			return $terezka$line_charts$Internal$Svg$transform(
				_List_fromArray(
					[
						A3($terezka$line_charts$Internal$Svg$move, system, x, y),
						A2($terezka$line_charts$Internal$Svg$offset, xOffset, 3)
					]));
		};
		var viewLegend = function (_v2) {
			var point = _v2.em;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						transform(point),
						$terezka$line_charts$Internal$Svg$anchorStyle(anchor)
					]),
				_List_fromArray(
					[
						viewLabel(
						$terezka$line_charts$Internal$Line$label(line))
					]));
		};
		return A2(
			$terezka$line_charts$Internal$Utils$viewMaybe,
			$elm$core$List$head(orderedPoints),
			viewLegend);
	});
var $terezka$line_charts$Internal$Legends$viewFrees = F3(
	function (_v0, placement, view_) {
		var system = _v0.dh;
		var lines = _v0.bA;
		var data = _v0.bg;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__legends')
				]),
			A3(
				$elm$core$List$map2,
				A3($terezka$line_charts$Internal$Legends$viewFree, system, placement, view_),
				lines,
				data));
	});
var $terezka$line_charts$Internal$Line$shape = function (_v0) {
	var config = _v0;
	return config.db;
};
var $terezka$line_charts$LineChart$Coordinate$toDataX = F2(
	function (system, value) {
		return system.ds.a0 + A2($terezka$line_charts$LineChart$Coordinate$scaleDataX, system, value - system.aY.eb.cL);
	});
var $terezka$line_charts$LineChart$Coordinate$toDataY = F2(
	function (system, value) {
		return system.dt.a$ - A2($terezka$line_charts$LineChart$Coordinate$scaleDataY, system, value - system.aY.eb.dk);
	});
var $terezka$line_charts$LineChart$Coordinate$toData = F2(
	function (system, point) {
		return {
			ds: A2($terezka$line_charts$LineChart$Coordinate$toDataX, system, point.ds),
			dt: A2($terezka$line_charts$LineChart$Coordinate$toDataY, system, point.dt)
		};
	});
var $elm$svg$Svg$Attributes$strokeOpacity = _VirtualDom_attribute('stroke-opacity');
var $terezka$line_charts$Internal$Dots$varietyAttributes = F2(
	function (color, variety) {
		switch (variety.$) {
			case 0:
				var width = variety.a;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke(
						$avh4$elm_color$Color$toCssString(color)),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$fill('white')
					]);
			case 2:
				var width = variety.a;
				var opacity = variety.b;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke(
						$avh4$elm_color$Color$toCssString(color)),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$strokeOpacity(
						$elm$core$String$fromFloat(opacity)),
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
			case 1:
				var width = variety.a;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke('white'),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
			default:
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
		}
	});
var $terezka$line_charts$Internal$Dots$viewCircle = F5(
	function (events, variety, color, area, point) {
		var radius = $elm$core$Basics$sqrt(area / $elm$core$Basics$pi);
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$cx(
				$elm$core$String$fromFloat(point.ds)),
				$elm$svg$Svg$Attributes$cy(
				$elm$core$String$fromFloat(point.dt)),
				$elm$svg$Svg$Attributes$r(
				$elm$core$String$fromFloat(radius))
			]);
		return A2(
			$elm$svg$Svg$circle,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$pathPlus = F2(
	function (area, point) {
		var side = $elm$core$Basics$sqrt(area / 5);
		var r6 = side / 2;
		var r3 = side;
		var commands = _List_fromArray(
			[
				'M' + ($elm$core$String$fromFloat(point.ds - r6) + (' ' + $elm$core$String$fromFloat((point.dt - r3) - r6))),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(r3)
			]);
		return A2($elm$core$String$join, ' ', commands);
	});
var $terezka$line_charts$Internal$Dots$viewCross = F5(
	function (events, variety, color, area, point) {
		var rotation = 'rotate(45 ' + ($elm$core$String$fromFloat(point.ds) + (' ' + ($elm$core$String$fromFloat(point.dt) + ')')));
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathPlus, area, point)),
				$elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewDiamond = F5(
	function (events, variety, color, area, point) {
		var side = $elm$core$Basics$sqrt(area);
		var rotation = 'rotate(45 ' + ($elm$core$String$fromFloat(point.ds) + (' ' + ($elm$core$String$fromFloat(point.dt) + ')')));
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(point.ds - (side / 2))),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(point.dt - (side / 2))),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			$elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewPlus = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathPlus, area, point))
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewSquare = F5(
	function (events, variety, color, area, point) {
		var side = $elm$core$Basics$sqrt(area);
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(point.ds - (side / 2))),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(point.dt - (side / 2))),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(side))
			]);
		return A2(
			$elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$core$Basics$tan = _Basics_tan;
var $terezka$line_charts$Internal$Dots$pathTriangle = F2(
	function (area, point) {
		var side = $elm$core$Basics$sqrt(
			(area * 4) / $elm$core$Basics$sqrt(3));
		var height = ($elm$core$Basics$sqrt(3) * side) / 2;
		var fromMiddle = height - (($elm$core$Basics$tan(
			$elm$core$Basics$degrees(30)) * side) / 2);
		var commands = _List_fromArray(
			[
				'M' + ($elm$core$String$fromFloat(point.ds) + (' ' + $elm$core$String$fromFloat(point.dt - fromMiddle))),
				'l' + ($elm$core$String$fromFloat((-side) / 2) + (' ' + $elm$core$String$fromFloat(height))),
				'h' + $elm$core$String$fromFloat(side),
				'z'
			]);
		return A2($elm$core$String$join, ' ', commands);
	});
var $terezka$line_charts$Internal$Dots$viewTriangle = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathTriangle, area, point))
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewShape = F5(
	function (system, _v0, shape, color, point) {
		var radius = _v0.bL;
		var variety = _v0.b0;
		var view_ = function () {
			switch (shape) {
				case 1:
					return $terezka$line_charts$Internal$Dots$viewCircle;
				case 2:
					return $terezka$line_charts$Internal$Dots$viewTriangle;
				case 3:
					return $terezka$line_charts$Internal$Dots$viewSquare;
				case 4:
					return $terezka$line_charts$Internal$Dots$viewDiamond;
				case 5:
					return $terezka$line_charts$Internal$Dots$viewCross;
				case 6:
					return $terezka$line_charts$Internal$Dots$viewPlus;
				default:
					return F5(
						function (_v2, _v3, _v4, _v5, _v6) {
							return $elm$svg$Svg$text('');
						});
			}
		}();
		var size = (2 * $elm$core$Basics$pi) * radius;
		var pointSvg = A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, point);
		return A5(view_, _List_Nil, variety, color, size, pointSvg);
	});
var $terezka$line_charts$Internal$Dots$viewSample = F5(
	function (_v0, shape, color, system, data) {
		var config = _v0;
		var _v1 = config.bz(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.eF;
				},
				data));
		var style_ = _v1;
		return A4($terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color);
	});
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $terezka$line_charts$Internal$Area$opacity = function (config) {
	switch (config.$) {
		case 0:
			return 0;
		case 1:
			var opacity_ = config.a;
			return opacity_;
		case 2:
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var $terezka$line_charts$Internal$Line$toAreaAttributes = F3(
	function (_v0, _v1, area) {
		var serie = _v0;
		var style_ = _v1;
		return _List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('chart__interpolation__area__fragment'),
				$elm$svg$Svg$Attributes$fill(
				$avh4$elm_color$Color$toCssString(
					style_.dJ(serie.dJ)))
			]);
	});
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $terezka$line_charts$Internal$Line$toSeriesAttributes = F2(
	function (_v0, _v1) {
		var serie = _v0;
		var style_ = _v1;
		return _List_fromArray(
			[
				$elm$svg$Svg$Attributes$style('pointer-events: none;'),
				$elm$svg$Svg$Attributes$class('chart__interpolation__line__fragment'),
				$elm$svg$Svg$Attributes$stroke(
				$avh4$elm_color$Color$toCssString(
					style_.dJ(serie.dJ))),
				$elm$svg$Svg$Attributes$strokeWidth(
				$elm$core$String$fromFloat(style_.dr)),
				$elm$svg$Svg$Attributes$strokeDasharray(
				A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $elm$core$String$fromFloat, serie.cl))),
				$elm$svg$Svg$Attributes$fill('transparent')
			]);
	});
var $terezka$line_charts$Internal$Utils$viewIf = F2(
	function (condition, view) {
		return condition ? view(0) : $elm$svg$Svg$text('');
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $terezka$line_charts$Internal$Line$viewSample = F5(
	function (_v0, line_, area, data_, sampleWidth) {
		var look = _v0;
		var style_ = look(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.eF;
				},
				data_));
		var sizeAttributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x1('0'),
				$elm$svg$Svg$Attributes$y1('0'),
				$elm$svg$Svg$Attributes$x2(
				$elm$core$String$fromFloat(sampleWidth)),
				$elm$svg$Svg$Attributes$y2('0')
			]);
		var rectangleAttributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x('0'),
				$elm$svg$Svg$Attributes$y('0'),
				$elm$svg$Svg$Attributes$height('9'),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(sampleWidth))
			]);
		var lineAttributes = A2($terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_);
		var areaAttributes = A2(
			$elm$core$List$cons,
			$elm$svg$Svg$Attributes$fillOpacity(
				$elm$core$String$fromFloat(
					$terezka$line_charts$Internal$Area$opacity(area))),
			A3($terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area));
		var viewRectangle = function (_v1) {
			return A2(
				$elm$svg$Svg$rect,
				_Utils_ap(areaAttributes, rectangleAttributes),
				_List_Nil);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$line,
					_Utils_ap(lineAttributes, sizeAttributes),
					_List_Nil),
					A2(
					$terezka$line_charts$Internal$Utils$viewIf,
					$terezka$line_charts$Internal$Area$hasArea(area),
					viewRectangle)
				]));
	});
var $terezka$line_charts$Internal$Legends$viewSample = F4(
	function (_v0, sampleWidth, line, data) {
		var system = _v0.dh;
		var lineConfig = _v0.cN;
		var dotsConfig = _v0.cp;
		var area = _v0.dA;
		var shape = $terezka$line_charts$Internal$Line$shape(line);
		var dotPosition = A2(
			$terezka$line_charts$LineChart$Coordinate$toData,
			system,
			A2($terezka$line_charts$Internal$Data$Point, sampleWidth / 2, 0));
		var color = A3($terezka$line_charts$Internal$Line$color, lineConfig, line, data);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__sample')
				]),
			_List_fromArray(
				[
					A5($terezka$line_charts$Internal$Line$viewSample, lineConfig, line, area, data, sampleWidth),
					A6($terezka$line_charts$Internal$Dots$viewSample, dotsConfig, shape, color, system, data, dotPosition)
				]));
	});
var $terezka$line_charts$Internal$Legends$viewGrouped = F3(
	function (_arguments, sampleWidth, container) {
		var toLegend = F2(
			function (line, data) {
				return {
					cK: $terezka$line_charts$Internal$Line$label(line),
					bO: A4($terezka$line_charts$Internal$Legends$viewSample, _arguments, sampleWidth, line, data)
				};
			});
		var legends = A3($elm$core$List$map2, toLegend, _arguments.bA, _arguments.bg);
		return A2(container, _arguments.dh, legends);
	});
var $terezka$line_charts$Internal$Legends$view = function (_arguments) {
	var _v0 = _arguments.d8;
	switch (_v0.$) {
		case 1:
			var placement = _v0.a;
			var view_ = _v0.b;
			return A3($terezka$line_charts$Internal$Legends$viewFrees, _arguments, placement, view_);
		case 2:
			var sampleWidth = _v0.a;
			var container = _v0.b;
			return A3(
				$terezka$line_charts$Internal$Legends$viewGrouped,
				_arguments,
				sampleWidth,
				container(_arguments));
		default:
			return $elm$svg$Svg$text('');
	}
};
var $terezka$line_charts$Internal$Area$opacityContainer = function (config) {
	switch (config.$) {
		case 0:
			return 1;
		case 1:
			var opacity_ = config.a;
			return 1;
		case 2:
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var $terezka$line_charts$Internal$Utils$unzip3 = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var a = _v0.a;
			var b = _v0.b;
			var c = _v0.c;
			var aas = _v1.a;
			var bs = _v1.b;
			var cs = _v1.c;
			return _Utils_Tuple3(
				A2($elm$core$List$cons, a, aas),
				A2($elm$core$List$cons, b, bs),
				A2($elm$core$List$cons, c, cs));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil),
		pairs);
};
var $elm$core$List$map3 = _List_map3;
var $terezka$line_charts$Internal$Line$viewNormal = function (_v0) {
	var areas = _v0.a;
	var lines = _v0.b;
	var dots = _v0.c;
	var view_ = F3(
		function (area_, line_, dots_) {
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__line')
					]),
				_List_fromArray(
					[area_, line_, dots_]));
		});
	return A4($elm$core$List$map3, view_, areas, lines, dots);
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $terezka$line_charts$Internal$Data$isWithinRange = F2(
	function (system, point) {
		return _Utils_eq(
			A3($elm$core$Basics$clamp, system.ds.a0, system.ds.a$, point.ds),
			point.ds) && _Utils_eq(
			A3($elm$core$Basics$clamp, system.dt.a0, system.dt.a$, point.dt),
			point.dt);
	});
var $terezka$line_charts$Internal$Utils$part = F4(
	function (isReal, points, current, parts) {
		part:
		while (true) {
			if (points.b) {
				var first = points.a;
				var rest = points.b;
				if (isReal(first)) {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _Utils_ap(
						current,
						_List_fromArray(
							[first])),
						$temp$parts = parts;
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				} else {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _List_Nil,
						$temp$parts = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							current,
							$elm$core$Maybe$Just(first)),
						parts);
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				}
			} else {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(current, $elm$core$Maybe$Nothing),
					parts);
			}
		}
	});
var $terezka$line_charts$Internal$Interpolation$linear = $elm$core$List$map(
	$elm$core$List$map($terezka$line_charts$Internal$Path$Line));
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $terezka$line_charts$Internal$Interpolation$First = {$: 0};
var $terezka$line_charts$Internal$Interpolation$Previous = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Interpolation$monotoneCurve = F4(
	function (point0, point1, tangent0, tangent1) {
		var dx = (point1.ds - point0.ds) / 3;
		return A3(
			$terezka$line_charts$Internal$Path$CubicBeziers,
			{ds: point0.ds + dx, dt: point0.dt + (dx * tangent0)},
			{ds: point1.ds - dx, dt: point1.dt - (dx * tangent1)},
			point1);
	});
var $terezka$line_charts$Internal$Interpolation$slope2 = F3(
	function (point0, point1, t) {
		var h = point1.ds - point0.ds;
		return (!(!h)) ? ((((3 * (point1.dt - point0.dt)) / h) - t) / 2) : t;
	});
var $terezka$line_charts$Internal$Interpolation$sign = function (x) {
	return (x < 0) ? (-1) : 1;
};
var $terezka$line_charts$Internal$Interpolation$toH = F2(
	function (h0, h1) {
		return (!h0) ? ((h1 < 0) ? (0 * (-1)) : h1) : h0;
	});
var $terezka$line_charts$Internal$Interpolation$slope3 = F3(
	function (point0, point1, point2) {
		var h1 = point2.ds - point1.ds;
		var h0 = point1.ds - point0.ds;
		var s0h = A2($terezka$line_charts$Internal$Interpolation$toH, h0, h1);
		var s0 = (point1.dt - point0.dt) / s0h;
		var s1h = A2($terezka$line_charts$Internal$Interpolation$toH, h1, h0);
		var s1 = (point2.dt - point1.dt) / s1h;
		var p = ((s0 * h1) + (s1 * h0)) / (h0 + h1);
		var slope = ($terezka$line_charts$Internal$Interpolation$sign(s0) + $terezka$line_charts$Internal$Interpolation$sign(s1)) * A2(
			$elm$core$Basics$min,
			A2(
				$elm$core$Basics$min,
				$elm$core$Basics$abs(s0),
				$elm$core$Basics$abs(s1)),
			0.5 * $elm$core$Basics$abs(p));
		return $elm$core$Basics$isNaN(slope) ? 0 : slope;
	});
var $terezka$line_charts$Internal$Interpolation$monotonePart = F2(
	function (points, _v0) {
		var tangent = _v0.a;
		var commands = _v0.b;
		var _v1 = _Utils_Tuple2(tangent, points);
		_v1$4:
		while (true) {
			if (!_v1.a.$) {
				if (_v1.b.b && _v1.b.b.b) {
					if (_v1.b.b.b.b) {
						var _v2 = _v1.a;
						var _v3 = _v1.b;
						var p0 = _v3.a;
						var _v4 = _v3.b;
						var p1 = _v4.a;
						var _v5 = _v4.b;
						var p2 = _v5.a;
						var rest = _v5.b;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						var t0 = A3($terezka$line_charts$Internal$Interpolation$slope2, p0, p1, t1);
						return A2(
							$terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								$elm$core$List$cons,
								p1,
								A2($elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								$terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var _v9 = _v1.a;
						var _v10 = _v1.b;
						var p0 = _v10.a;
						var _v11 = _v10.b;
						var p1 = _v11.a;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							$terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t1, t1),
										$terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _v1$4;
				}
			} else {
				if (_v1.b.b && _v1.b.b.b) {
					if (_v1.b.b.b.b) {
						var t0 = _v1.a.a;
						var _v6 = _v1.b;
						var p0 = _v6.a;
						var _v7 = _v6.b;
						var p1 = _v7.a;
						var _v8 = _v7.b;
						var p2 = _v8.a;
						var rest = _v8.b;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						return A2(
							$terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								$elm$core$List$cons,
								p1,
								A2($elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								$terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var t0 = _v1.a.a;
						var _v12 = _v1.b;
						var p0 = _v12.a;
						var _v13 = _v12.b;
						var p1 = _v13.a;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							$terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1),
										$terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _v1$4;
				}
			}
		}
		return _Utils_Tuple2(tangent, commands);
	});
var $terezka$line_charts$Internal$Interpolation$monotoneSection = F2(
	function (points, _v0) {
		var tangent = _v0.a;
		var acc = _v0.b;
		var _v1 = function () {
			if (points.b) {
				var p0 = points.a;
				var rest = points.b;
				return A2(
					$terezka$line_charts$Internal$Interpolation$monotonePart,
					A2($elm$core$List$cons, p0, rest),
					_Utils_Tuple2(
						tangent,
						_List_fromArray(
							[
								$terezka$line_charts$Internal$Path$Line(p0)
							])));
			} else {
				return _Utils_Tuple2(tangent, _List_Nil);
			}
		}();
		var t0 = _v1.a;
		var commands = _v1.b;
		return _Utils_Tuple2(
			t0,
			A2($elm$core$List$cons, commands, acc));
	});
var $terezka$line_charts$Internal$Interpolation$monotone = function (sections) {
	return A3(
		$elm$core$List$foldr,
		$terezka$line_charts$Internal$Interpolation$monotoneSection,
		_Utils_Tuple2($terezka$line_charts$Internal$Interpolation$First, _List_Nil),
		sections).b;
};
var $terezka$line_charts$Internal$Interpolation$after = F2(
	function (a, b) {
		return _List_fromArray(
			[
				a,
				A2($terezka$line_charts$Internal$Data$Point, b.ds, a.dt),
				b
			]);
	});
var $terezka$line_charts$Internal$Interpolation$stepped = function (sections) {
	var expand = F2(
		function (result, section) {
			expand:
			while (true) {
				if (section.a.b) {
					if (section.a.b.b) {
						var _v1 = section.a;
						var a = _v1.a;
						var _v2 = _v1.b;
						var b = _v2.a;
						var rest = _v2.b;
						var broken = section.b;
						var $temp$result = _Utils_ap(
							result,
							A2($terezka$line_charts$Internal$Interpolation$after, a, b)),
							$temp$section = _Utils_Tuple2(
							A2($elm$core$List$cons, b, rest),
							broken);
						result = $temp$result;
						section = $temp$section;
						continue expand;
					} else {
						if (!section.b.$) {
							var _v3 = section.a;
							var last = _v3.a;
							var broken = section.b.a;
							return _Utils_ap(
								result,
								_List_fromArray(
									[
										A2($terezka$line_charts$Internal$Data$Point, broken.ds, last.dt)
									]));
						} else {
							var _v4 = section.a;
							var last = _v4.a;
							var _v5 = section.b;
							return result;
						}
					}
				} else {
					return result;
				}
			}
		});
	return A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			expand(_List_Nil),
			$elm$core$List$map($terezka$line_charts$Internal$Path$Line)),
		sections);
};
var $terezka$line_charts$Internal$Interpolation$toCommands = F2(
	function (interpolation, data) {
		var pointsSections = $elm$core$List$map(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$mapFirst(
					$elm$core$List$map(
						function ($) {
							return $.em;
						})),
				$elm$core$Tuple$mapSecond(
					$elm$core$Maybe$map(
						function ($) {
							return $.em;
						}))));
		var points = $elm$core$List$map(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$elm$core$List$map(
					function ($) {
						return $.em;
					})));
		switch (interpolation) {
			case 0:
				return $terezka$line_charts$Internal$Interpolation$linear(
					points(data));
			case 1:
				return $terezka$line_charts$Internal$Interpolation$monotone(
					points(data));
			default:
				return $terezka$line_charts$Internal$Interpolation$stepped(
					pointsSections(data));
		}
	});
var $terezka$line_charts$Internal$Area$opacitySingle = function (config) {
	switch (config.$) {
		case 0:
			return 0;
		case 1:
			var opacity_ = config.a;
			return opacity_;
		case 2:
			var opacity_ = config.a;
			return 1;
		default:
			var opacity_ = config.a;
			return 1;
	}
};
var $terezka$line_charts$Internal$Path$toPoint = function (command) {
	switch (command.$) {
		case 9:
			return A2($terezka$line_charts$LineChart$Coordinate$Point, 0, 0);
		case 0:
			var p = command.a;
			return p;
		case 1:
			var p = command.a;
			return p;
		case 2:
			var x = command.a;
			return A2($terezka$line_charts$LineChart$Coordinate$Point, x, 0);
		case 3:
			var y = command.a;
			return A2($terezka$line_charts$LineChart$Coordinate$Point, 0, y);
		case 4:
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return p;
		case 5:
			var c1 = command.a;
			var p = command.b;
			return p;
		case 6:
			var c1 = command.a;
			var p = command.b;
			return p;
		case 7:
			var p = command.a;
			return p;
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return p;
	}
};
var $terezka$line_charts$Internal$Utils$towardsZero = function (_v0) {
	var max = _v0.a$;
	var min = _v0.a0;
	return A3($elm$core$Basics$clamp, min, max, 0);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $terezka$line_charts$Internal$Utils$last = function (list) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$drop,
			$elm$core$List$length(list) - 1,
			list));
};
var $terezka$line_charts$Internal$Utils$lastSafe = F2(
	function (first, rest) {
		return A2(
			$elm$core$Maybe$withDefault,
			first,
			$terezka$line_charts$Internal$Utils$last(rest));
	});
var $terezka$line_charts$Internal$Utils$viewWithEdges = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A3(
				view,
				first,
				rest,
				A2($terezka$line_charts$Internal$Utils$lastSafe, first, rest));
		} else {
			return $elm$svg$Svg$text('');
		}
	});
var $elm$svg$Svg$Attributes$clipPath = _VirtualDom_attribute('clip-path');
var $terezka$line_charts$Internal$Svg$withinChartArea = function (_v0) {
	var id = _v0.dY;
	return $elm$svg$Svg$Attributes$clipPath(
		'url(#' + ($terezka$line_charts$Internal$Utils$toChartAreaId(id) + ')'));
};
var $terezka$line_charts$LineChart$Junk$withinChartArea = $terezka$line_charts$Internal$Svg$withinChartArea;
var $terezka$line_charts$Internal$Line$viewArea = F5(
	function (_v0, line_, style_, interpolation, data_) {
		var system = _v0.dh;
		var lineConfig = _v0.cN;
		var area = _v0.dA;
		var ground = function (point) {
			return A2(
				$terezka$line_charts$Internal$Data$Point,
				point.ds,
				$terezka$line_charts$Internal$Utils$towardsZero(system.dt));
		};
		var commands = F3(
			function (first, middle, last) {
				return A3(
					$terezka$line_charts$Internal$Utils$concat,
					_List_fromArray(
						[
							$terezka$line_charts$Internal$Path$Move(
							ground(
								$terezka$line_charts$Internal$Path$toPoint(first))),
							$terezka$line_charts$Internal$Path$Line(
							$terezka$line_charts$Internal$Path$toPoint(first))
						]),
					interpolation,
					_List_fromArray(
						[
							$terezka$line_charts$Internal$Path$Line(
							ground(
								$terezka$line_charts$Internal$Path$toPoint(last)))
						]));
			});
		var attributes = A2(
			$elm$core$List$cons,
			$terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fillOpacity(
					$elm$core$String$fromFloat(
						$terezka$line_charts$Internal$Area$opacitySingle(area))),
				A3($terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area)));
		return A2(
			$terezka$line_charts$Internal$Utils$viewWithEdges,
			interpolation,
			F3(
				function (first, middle, last) {
					return A3(
						$terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A3(commands, first, middle, last));
				}));
	});
var $terezka$line_charts$Internal$Dots$view = F2(
	function (_v0, data) {
		var system = _v0.dh;
		var dotsConfig = _v0.cp;
		var shape = _v0.db;
		var color = _v0.dJ;
		var _v1 = dotsConfig;
		var config = _v1;
		var _v2 = config.bw(data.eF);
		var style_ = _v2;
		return A5($terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color, data.em);
	});
var $terezka$line_charts$Internal$Line$viewDot = F3(
	function (_arguments, _v0, _v1) {
		var lineConfig = _v0;
		var style_ = _v1;
		return $terezka$line_charts$Internal$Dots$view(
			{
				dJ: style_.dJ(lineConfig.dJ),
				cp: _arguments.cp,
				db: lineConfig.db,
				dh: _arguments.dh
			});
	});
var $terezka$line_charts$Internal$Utils$viewWithFirst = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A2(view, first, rest);
		} else {
			return $elm$svg$Svg$text('');
		}
	});
var $terezka$line_charts$Internal$Line$viewSeries = F5(
	function (_v0, line_, style_, interpolation, data_) {
		var system = _v0.dh;
		var lineConfig = _v0.cN;
		var attributes = A2(
			$elm$core$List$cons,
			$terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2($terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_));
		return A2(
			$terezka$line_charts$Internal$Utils$viewWithFirst,
			data_,
			F2(
				function (first, _v1) {
					return A3(
						$terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A2(
							$elm$core$List$cons,
							$terezka$line_charts$Internal$Path$Move(first.em),
							interpolation));
				}));
	});
var $terezka$line_charts$Internal$Line$viewSingle = F3(
	function (_arguments, line_, data_) {
		var style_ = function (_v1) {
			var look = _v1;
			return look(
				A2(
					$elm$core$List$map,
					function ($) {
						return $.eF;
					},
					data_));
		}(_arguments.cN);
		var sections = A4(
			$terezka$line_charts$Internal$Utils$part,
			function ($) {
				return $.d5;
			},
			data_,
			_List_Nil,
			_List_Nil);
		var parts = A2($elm$core$List$map, $elm$core$Tuple$first, sections);
		var viewDots = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__dots')
				]),
			A2(
				$elm$core$List$map,
				A3($terezka$line_charts$Internal$Line$viewDot, _arguments, line_, style_),
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeL,
						$terezka$line_charts$Internal$Data$isWithinRange(_arguments.dh),
						function ($) {
							return $.em;
						}),
					$elm$core$List$concat(parts))));
		var commands = A2($terezka$line_charts$Internal$Interpolation$toCommands, _arguments.d0, sections);
		var viewAreas = function (_v0) {
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__interpolation__area')
					]),
				A3(
					$elm$core$List$map2,
					A3($terezka$line_charts$Internal$Line$viewArea, _arguments, line_, style_),
					commands,
					parts));
		};
		var viewSeriess = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__interpolation__line')
				]),
			A3(
				$elm$core$List$map2,
				A3($terezka$line_charts$Internal$Line$viewSeries, _arguments, line_, style_),
				commands,
				parts));
		return _Utils_Tuple3(
			A2(
				$terezka$line_charts$Internal$Utils$viewIf,
				$terezka$line_charts$Internal$Area$hasArea(_arguments.dA),
				viewAreas),
			viewSeriess,
			viewDots);
	});
var $terezka$line_charts$Internal$Line$viewStacked = F2(
	function (area, _v0) {
		var areas = _v0.a;
		var lines = _v0.b;
		var dots = _v0.c;
		var toList = F2(
			function (l, d) {
				return _List_fromArray(
					[l, d]);
			});
		var opacity = 'opacity: ' + $elm$core$String$fromFloat(
			$terezka$line_charts$Internal$Area$opacityContainer(area));
		var bottoms = $elm$core$List$concat(
			A3($elm$core$List$map2, toList, lines, dots));
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__bottoms'),
						$elm$svg$Svg$Attributes$style(opacity)
					]),
				areas),
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__tops')
					]),
				bottoms)
			]);
	});
var $terezka$line_charts$Internal$Line$view = F3(
	function (_arguments, lines, datas) {
		var container = $elm$svg$Svg$g(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__lines')
				]));
		var buildSeriesViews = ($terezka$line_charts$Internal$Area$opacityContainer(_arguments.dA) < 1) ? $terezka$line_charts$Internal$Line$viewStacked(_arguments.dA) : $terezka$line_charts$Internal$Line$viewNormal;
		return container(
			buildSeriesViews(
				$terezka$line_charts$Internal$Utils$unzip3(
					A3(
						$elm$core$List$map2,
						$terezka$line_charts$Internal$Line$viewSingle(_arguments),
						lines,
						datas))));
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $terezka$line_charts$LineChart$viewBoxAttribute = function (_v0) {
	var frame = _v0.aY;
	return $elm$svg$Svg$Attributes$viewBox(
		'0 0 ' + ($elm$core$String$fromFloat(frame.dc.dr) + (' ' + $elm$core$String$fromFloat(frame.dc.cy))));
};
var $terezka$line_charts$Internal$Axis$Line$config = function (_v0) {
	var config_ = _v0;
	return config_;
};
var $terezka$line_charts$Internal$Axis$Title$config = function (_v0) {
	var title = _v0;
	return title;
};
var $terezka$line_charts$Internal$Axis$Intersection$getY = function (_v0) {
	var func = _v0;
	return A2(
		$elm$core$Basics$composeL,
		function ($) {
			return $.dt;
		},
		func);
};
var $terezka$line_charts$Internal$Axis$attributesLine = F2(
	function (system, _v0) {
		var events = _v0.dS;
		var width = _v0.dr;
		var color = _v0.dJ;
		return _Utils_ap(
			events,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(width)),
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString(color)),
					$terezka$line_charts$Internal$Svg$withinChartArea(system)
				]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			$terezka$line_charts$Internal$Svg$horizontal,
			system,
			A2($terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.bX,
			config.cr);
	});
var $terezka$line_charts$Internal$Axis$attributesTick = function (_v0) {
	var width = _v0.dr;
	var color = _v0.dJ;
	return _List_fromArray(
		[
			$elm$svg$Svg$Attributes$strokeWidth(
			$elm$core$String$fromFloat(width)),
			$elm$svg$Svg$Attributes$stroke(
			$avh4$elm_color$Color$toCssString(color))
		]);
};
var $terezka$line_charts$Internal$Axis$Tick$isPositive = function (direction) {
	if (direction === 1) {
		return true;
	} else {
		return false;
	}
};
var $terezka$line_charts$Internal$Axis$lengthOfTick = function (_v0) {
	var length = _v0.aL;
	var direction = _v0.bk;
	return $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (-length) : length;
};
var $terezka$line_charts$Internal$Svg$Middle = 1;
var $terezka$line_charts$Internal$Axis$viewHorizontalLabel = F4(
	function (system, _v0, position, view) {
		var direction = _v0.bk;
		var length = _v0.aL;
		var yOffset = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? ((-5) - length) : (15 + length);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.ds, position.dt),
							A2($terezka$line_charts$Internal$Svg$offset, 0, yOffset)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(1)
				]),
			_List_fromArray(
				[view]));
	});
var $terezka$line_charts$Internal$Svg$xTick = F5(
	function (system, height, userAttributes, y, x) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y) + height))
				]));
		return A2($elm$svg$Svg$line, attributes, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalTick = F3(
	function (system, point, tick) {
		var x = point.ds;
		var y = point.dt;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					$terezka$line_charts$Internal$Svg$xTick,
					system,
					$terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					$terezka$line_charts$Internal$Axis$attributesTick(tick),
					y,
					x),
					A2(
					$terezka$line_charts$Internal$Utils$viewMaybe,
					tick.cK,
					A3($terezka$line_charts$Internal$Axis$viewHorizontalLabel, system, tick, point))
				]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalTitle = F3(
	function (system, at, _v0) {
		var title = _v0.ex;
		var position = at(
			A2(title.aM, system.b2, system.ds));
		var _v1 = title.b;
		var xOffset = _v1.a;
		var yOffset = _v1.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__title'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.ds, position.dt),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset + 15, yOffset + 5)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(0)
				]),
			_List_fromArray(
				[title.eH]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontal = F3(
	function (system, intersection, _v0) {
		var config = _v0;
		var viewConfig = {
			d1: A2($terezka$line_charts$Internal$Axis$Intersection$getY, intersection, system),
			d9: A3($terezka$line_charts$Internal$Axis$Line$config, config.dE, system.b2, system.ds),
			ev: A3($terezka$line_charts$Internal$Axis$Ticks$ticks, system.b2, system.ds, config.ev),
			ex: $terezka$line_charts$Internal$Axis$Title$config(config.ex)
		};
		var viewAxisLine = A2($terezka$line_charts$Internal$Axis$viewHorizontalAxisLine, system, viewConfig.d1);
		var at = function (x) {
			return {ds: x, dt: viewConfig.d1};
		};
		var viewTick = function (tick) {
			return A3(
				$terezka$line_charts$Internal$Axis$viewHorizontalTick,
				system,
				at(tick.aM),
				tick);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__axis--horizontal')
				]),
			_List_fromArray(
				[
					A3($terezka$line_charts$Internal$Axis$viewHorizontalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.d9),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2($elm$core$List$map, viewTick, viewConfig.ev))
				]));
	});
var $terezka$line_charts$Internal$Axis$Intersection$getX = function (_v0) {
	var func = _v0;
	return A2(
		$elm$core$Basics$composeL,
		function ($) {
			return $.ds;
		},
		func);
};
var $terezka$line_charts$Internal$Axis$viewVerticalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			$terezka$line_charts$Internal$Svg$vertical,
			system,
			A2($terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.bX,
			config.cr);
	});
var $terezka$line_charts$Internal$Axis$viewVerticalLabel = F4(
	function (system, _v0, position, view) {
		var direction = _v0.bk;
		var length = _v0.aL;
		var xOffset = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (5 + length) : ((-5) - length);
		var anchor = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? 0 : 2;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.ds, position.dt),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset, 5)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(anchor)
				]),
			_List_fromArray(
				[view]));
	});
var $terezka$line_charts$Internal$Svg$yTick = F5(
	function (system, width, userAttributes, x, y) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick'),
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x) - width)),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y)))
				]));
		return A2($elm$svg$Svg$line, attributes, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$viewVerticalTick = F3(
	function (system, point, tick) {
		var x = point.ds;
		var y = point.dt;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					$terezka$line_charts$Internal$Svg$yTick,
					system,
					$terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					$terezka$line_charts$Internal$Axis$attributesTick(tick),
					x,
					y),
					A2(
					$terezka$line_charts$Internal$Utils$viewMaybe,
					tick.cK,
					A3($terezka$line_charts$Internal$Axis$viewVerticalLabel, system, tick, point))
				]));
	});
var $terezka$line_charts$Internal$Axis$viewVerticalTitle = F3(
	function (system, at, _v0) {
		var title = _v0.ex;
		var position = at(
			A2(title.aM, system.b3, system.dt));
		var _v1 = title.b;
		var xOffset = _v1.a;
		var yOffset = _v1.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__title'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.ds, position.dt),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset + 2, yOffset - 10)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(2)
				]),
			_List_fromArray(
				[title.eH]));
	});
var $terezka$line_charts$Internal$Axis$viewVertical = F3(
	function (system, intersection, _v0) {
		var config = _v0;
		var viewConfig = {
			d1: A2($terezka$line_charts$Internal$Axis$Intersection$getX, intersection, system),
			d9: A3($terezka$line_charts$Internal$Axis$Line$config, config.dE, system.b3, system.dt),
			ev: A3($terezka$line_charts$Internal$Axis$Ticks$ticks, system.b3, system.dt, config.ev),
			ex: $terezka$line_charts$Internal$Axis$Title$config(config.ex)
		};
		var viewAxisLine = A2($terezka$line_charts$Internal$Axis$viewVerticalAxisLine, system, viewConfig.d1);
		var at = function (y) {
			return {ds: viewConfig.d1, dt: y};
		};
		var viewTick = function (tick) {
			return A3(
				$terezka$line_charts$Internal$Axis$viewVerticalTick,
				system,
				at(tick.aM),
				tick);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__axis--vertical')
				]),
			_List_fromArray(
				[
					A3($terezka$line_charts$Internal$Axis$viewVerticalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.d9),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2($elm$core$List$map, viewTick, viewConfig.ev))
				]));
	});
var $terezka$line_charts$LineChart$viewCustom = F2(
	function (config, lines) {
		var junkLineInfo = function (line_) {
			return _Utils_Tuple3(
				A3($terezka$line_charts$Internal$Line$color, config.d9, line_, _List_Nil),
				$terezka$line_charts$Internal$Line$label(line_),
				$terezka$line_charts$Internal$Line$data(line_));
		};
		var getJunk = A3(
			$terezka$line_charts$Internal$Junk$getLayers,
			A2($elm$core$List$map, junkLineInfo, lines),
			$terezka$line_charts$Internal$Axis$variable(config.ds),
			$terezka$line_charts$Internal$Axis$variable(config.dt));
		var data = A2($terezka$line_charts$LineChart$toDataPoints, config, lines);
		var dataAll = $elm$core$List$concat(data);
		var dataSafe = A2(
			$elm$core$List$map,
			$elm$core$List$filter(
				function ($) {
					return $.d5;
				}),
			data);
		var dataAllSafe = $elm$core$List$concat(dataSafe);
		var system = A2($terezka$line_charts$LineChart$toSystem, config, dataAllSafe);
		var viewLines = $terezka$line_charts$Internal$Line$view(
			{dA: config.dA, cp: config.dP, d0: config.d0, cN: config.d9, dh: system});
		var viewLegends = $terezka$line_charts$Internal$Legends$view(
			{
				dA: config.dA,
				bg: dataSafe,
				cp: config.dP,
				d8: config.d8,
				cN: config.d9,
				bA: lines,
				dh: system,
				ds: $terezka$line_charts$Internal$Axis$variable(config.ds),
				dt: $terezka$line_charts$Internal$Axis$variable(config.dt)
			});
		var attributes = $elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					$terezka$line_charts$Internal$Container$properties,
					function ($) {
						return $.dD;
					},
					config.dL),
					A3($terezka$line_charts$Internal$Events$toContainerAttributes, dataAll, system, config.dS),
					_List_fromArray(
					[
						$terezka$line_charts$LineChart$viewBoxAttribute(system)
					])
				]));
		var addGrid = $terezka$line_charts$Internal$Junk$addBelow(
			A4($terezka$line_charts$Internal$Grid$view, system, config.ds, config.dt, config.dU));
		var junk = addGrid(
			A2(getJunk, system, config.d6));
		return A4(
			$terezka$line_charts$LineChart$container,
			config,
			system,
			junk.bp,
			A2(
				$elm$svg$Svg$svg,
				attributes,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$defs,
						_List_Nil,
						_List_fromArray(
							[
								$terezka$line_charts$LineChart$clipPath(system)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('chart__junk--below')
							]),
						junk.aI),
						A2(viewLines, lines, data),
						A3($terezka$line_charts$LineChart$chartAreaPlatform, config, dataAll, system),
						A3($terezka$line_charts$Internal$Axis$viewHorizontal, system, config.d1, config.ds),
						A3($terezka$line_charts$Internal$Axis$viewVertical, system, config.d1, config.dt),
						viewLegends,
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('chart__junk--above')
							]),
						junk.bd)
					])));
	});
var $terezka$line_charts$Internal$Line$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$Style = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$style = F2(
	function (width, color_) {
		return {dJ: color_, dr: width};
	});
var $terezka$line_charts$Internal$Line$wider = function (width) {
	return function (_v0) {
		return A2($terezka$line_charts$Internal$Line$style, width, $elm$core$Basics$identity);
	};
};
var $terezka$line_charts$LineChart$Line$wider = $terezka$line_charts$Internal$Line$wider;
var $author$project$Page$Acceleration$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex-column')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Stepper acceleration profile')
					])),
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Input')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('inputAccel'),
								$elm$html$Html$Attributes$class('item-label cy bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('\u03C9\u2032')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$id('inputAccel'),
								$elm$html$Html$Attributes$class('item-input cy'),
								$elm$html$Html$Attributes$value(model.U.F),
								$elm$html$Html$Events$onInput($author$project$Page$Acceleration$UpdateAcceleration)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-unit cy bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('radians / sec'),
								A2(
								$elm$html$Html$sup,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('2')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-desc cy')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('(Angular acceleration)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-err')
							]),
						A2($elm$core$List$map, $author$project$Page$Acceleration$errorItem, model.U.w)),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('inputDelay'),
								$elm$html$Html$Attributes$class('item-label cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('c'),
								A2(
								$elm$html$Html$sub,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('min')
									]))
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$id('inputDelay'),
								$elm$html$Html$Attributes$class('item-input'),
								$elm$html$Html$Attributes$value(model.O.F),
								$elm$html$Html$Events$onInput($author$project$Page$Acceleration$UpdateMinInterval)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-unit cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('\u03BCs')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-desc cy darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('(Min. step pulse interval)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-err cy darker-row')
							]),
						A2($elm$core$List$map, $author$project$Page$Acceleration$errorItem, model.O.w)),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('inputStepAngle'),
								$elm$html$Html$Attributes$class('item-label cy bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('\u03B1')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$id('inputStepAngle'),
								$elm$html$Html$Attributes$class('item-input cy'),
								$elm$html$Html$Attributes$value(model.ac.F),
								$elm$html$Html$Events$onInput($author$project$Page$Acceleration$UpdateStepAngle)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-unit cy bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('°')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-desc cy')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('(Step angle in degrees)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-err')
							]),
						A2($elm$core$List$map, $author$project$Page$Acceleration$errorItem, model.ac.w)),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('inputFreq'),
								$elm$html$Html$Attributes$class('item-label cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('f')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$id('inputFreq'),
								$elm$html$Html$Attributes$class('item-input'),
								$elm$html$Html$Attributes$value(model.aC.F),
								$elm$html$Html$Events$onInput($author$project$Page$Acceleration$UpdateTimerFrequency)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-unit cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('MHz')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-desc cy darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('(Step timer frequency)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('item-err cy darker-row')
							]),
						A2($elm$core$List$map, $author$project$Page$Acceleration$errorItem, model.aC.w)),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('btn btn-light item-ctrl'),
								$elm$html$Html$Events$onClick($author$project$Page$Acceleration$CalculateRamp),
								$elm$html$Html$Attributes$disabled(
								!$elm$core$List$isEmpty(
									_Utils_ap(model.U.w, model.O.w)))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Generate ramp')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$hidden(!model.aK),
						$elm$html$Html$Attributes$class('top-offset-huge flex-column cy dark-text')
					]),
				_List_fromArray(
					[
						A3(
						$perzanko$elm_loading$Loading$render,
						4,
						_Utils_update(
							$perzanko$elm_loading$Loading$defaultConfig,
							{dJ: '#373a3e', dc: 50}),
						0),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Calculation in progress. Just a moment, please...')
							]))
					])),
				A2(
				$elm$html$Html$h4,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$hidden(
						$elm$core$List$isEmpty(model.v)),
						$elm$html$Html$Attributes$class('top-offset-large')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Acceleration ramp')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex-column darker'),
						$elm$html$Html$Attributes$hidden(
						$elm$core$List$isEmpty(model.v))
					]),
				_List_fromArray(
					[
						A2(
						$terezka$line_charts$LineChart$viewCustom,
						{
							dA: $terezka$line_charts$LineChart$Area$default,
							dL: $terezka$line_charts$LineChart$Container$custom(
								{
									dC: _List_Nil,
									dD: _List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'fill', 'white')
										]),
									dY: 'chart1',
									eb: A4($terezka$line_charts$LineChart$Container$Margin, 100, 100, 100, 100),
									dc: $terezka$line_charts$LineChart$Container$relative
								}),
							dP: $terezka$line_charts$LineChart$Dots$default,
							dS: $terezka$line_charts$LineChart$Events$default,
							dU: $terezka$line_charts$LineChart$Grid$default,
							d0: $terezka$line_charts$LineChart$Interpolation$default,
							d1: $terezka$line_charts$LineChart$Axis$Intersection$default,
							d6: $terezka$line_charts$LineChart$Junk$default,
							d8: $terezka$line_charts$LineChart$Legends$none,
							d9: $terezka$line_charts$LineChart$Line$wider(3),
							ds: A3(
								$terezka$line_charts$LineChart$Axis$default,
								3500,
								'Time (s)',
								function ($) {
									return $.co;
								}),
							dt: $terezka$line_charts$LineChart$Axis$custom(
								{
									dE: $terezka$line_charts$LineChart$Axis$Line$full($terezka$line_charts$LineChart$Colors$grayLightest),
									el: 800,
									eo: A2($terezka$line_charts$LineChart$Axis$Range$padded, 20, 20),
									ev: $terezka$line_charts$LineChart$Axis$Ticks$default,
									ex: A3($terezka$line_charts$LineChart$Axis$Title$atAxisMax, 60, 0, 'Motor speed (RPM)'),
									eG: A2(
										$elm$core$Basics$composeL,
										$elm$core$Maybe$Just,
										function ($) {
											return $.b8;
										})
								})
						},
						_List_fromArray(
							[
								A4(
								$terezka$line_charts$LineChart$line,
								A3($avh4$elm_color$Color$rgb255, 222, 255, 0),
								$terezka$line_charts$LineChart$Dots$none,
								'Acceleration profile',
								model.aN.cx)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid-results darker'),
						$elm$html$Html$Attributes$hidden(
						$elm$core$List$isEmpty(model.v))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy right-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Ramp time')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$cuducos$elm_format_number$FormatNumber$format,
									_Utils_update(
										$cuducos$elm_format_number$FormatNumber$Locales$frenchLocale,
										{
											bi: '.',
											bj: $cuducos$elm_format_number$FormatNumber$Locales$Exact(3)
										}),
									$elm$core$List$sum(model.v) / 1000000.0) + ' s')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy right-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('RPM'),
								A2(
								$elm$html$Html$sub,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('max')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$cuducos$elm_format_number$FormatNumber$format,
									_Utils_update(
										$cuducos$elm_format_number$FormatNumber$Locales$frenchLocale,
										{
											bi: '.',
											bj: $cuducos$elm_format_number$FormatNumber$Locales$Exact(0)
										}),
									function () {
										var _v0 = _Utils_Tuple2(model.O.y, model.ac.y);
										if ((!_v0.a.$) && (!_v0.b.$)) {
											var a = _v0.a.a;
											var b = _v0.b.a;
											return (((1000000 / a) * b) * 60) / 360;
										} else {
											return 0;
										}
									}()))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy right-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Steps in ramp')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cy bold darker-row')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(
									$elm$core$List$length(model.v)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid top-offset-medium'),
						$elm$html$Html$Attributes$hidden(
						$elm$core$List$isEmpty(model.v))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('btn btn-dark item-ctrl'),
								$elm$html$Html$Events$onClick($author$project$Page$Acceleration$ToggleShowSteps)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.ax ? 'Hide step values' : 'Show step values')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$hidden(!model.ax),
						$elm$html$Html$Attributes$class('steps darker')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'const DELAYS = {' + (A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $author$project$Page$Acceleration$formatDelay, model.v)) + '};'))
					]))
			]));
};
var $author$project$Page$Precision$Decrement = 1;
var $author$project$Page$Precision$Increment = 0;
var $author$project$Page$Precision$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('-')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(model))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(0)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+')
					]))
			]));
};
var $author$project$Page$Resolution$Decrement = 1;
var $author$project$Page$Resolution$Increment = 0;
var $author$project$Page$Resolution$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('-')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(model))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(0)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+')
					]))
			]));
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Main$viewLink = F4(
	function (path, title, route, activeRoute) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(path),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('nav-link', true),
									_Utils_Tuple2(
									'active',
									_Utils_eq(activeRoute, route))
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						]))
				]));
	});
var $author$project$Main$view = function (model) {
	var page = function () {
		var _v0 = model.Q;
		switch (_v0.$) {
			case 0:
				var pageModel = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$AccelerationMsg,
					$author$project$Page$Acceleration$view(pageModel));
			case 1:
				var pageModel = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$ResolutionMsg,
					$author$project$Page$Resolution$view(pageModel));
			default:
				var pageModel = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$PrecisionMsg,
					$author$project$Page$Precision$view(pageModel));
		}
	}();
	return {
		dF: _List_fromArray(
			[
				A2(
				$elm$html$Html$nav,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar navbar-expand-lg navbar-dark bg-dark')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('container-fluid')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('navbar-brand mb-0 h1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Gullwing helper')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('collapse navbar-collapse'),
										$elm$html$Html$Attributes$id('navbarSupportedContent')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$ul,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('navbar-nav me-auto mb-2 mb-lg-0')
											]),
										_List_fromArray(
											[
												A4($author$project$Main$viewLink, '/acceleration', 'Acceleration', 0, model.aa),
												A4($author$project$Main$viewLink, '/resolution', 'Resolution', 1, model.aa),
												A4($author$project$Main$viewLink, '/precision', 'Precision', 2, model.aa)
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('workspace')
					]),
				_List_fromArray(
					[page]))
			]),
		ex: 'Gullwing helper'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{d$: $author$project$Main$init, ei: $author$project$Main$UrlChanged, ej: $author$project$Main$LinkClicked, eu: $author$project$Main$subscriptions, eD: $author$project$Main$update, eH: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));