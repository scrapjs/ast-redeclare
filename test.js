var assert = require('chai').assert;
var parse = require('esprima').parse;
var gen = require('escodegen').generate;
var foldVars = require('./');

describe('', function(){
	it ('global scope', function(){
		var src = 'var a = 1; var b = 2; if (a > 1) { var c = b; } else {var c = 3, e;} var d = 4;';
		var ast = parse(src);

		ast = foldVars(ast);
		var out = gen(ast, {format: {indent: {style: ''}, newline: ' '}});

		assert.deepEqual(out, "var a, b, c, e, d; a = 1; b = 2; if (a > 1) { c = b; } else { c = 3; } d = 4;");
	});

	it('scoped', function(){
		var src = 'var x = 1; var x = (function(){var x = 1; (function () { ; var y = 1;})(); return x;})(); var y = 2;';
		var ast = parse(src);

		ast = foldVars(ast);
		var out = gen(ast, {format: {indent: {style: ''}, newline: ' '}});

		assert.deepEqual(out, "var x, y; x = 1; x = function () { var x; x = 1; (function () { var y; ; y = 1; }()); return x; }(); y = 2;");
	});

	it.skip('sub scopes', function(){
		// 'function x() { try {} catch (e) {var x = 1}; var x = 1; (function(){;;; var x = 1;}) }; '
		var src = 'var x = 1; var x = (function(){;;; var x = 1;})()';
		var ast = parse(src);

		ast = foldVars(ast);
		var out = gen(ast, {format: {indent: {style: ''}, newline: ' '}});

		assert.deepEqual(out, "");
	});

	it('empty declarations', function(){
		var src = 'function x(a){ function y (b){ return (function z(c){ return a + b + c})(); }}';
		var ast = parse(src);

		ast = foldVars(ast);
		var out = gen(ast, {format: {indent: {style: ''}, newline: ' '}});

		assert.deepEqual(out, "function x(a) { function y(b) { return function z(c) { return a + b + c; }(); } }");
	});

	it('keep logic unchanged', function(){
		var src = '(function () { ' +
			'var a; var b = a; a = 1; var c = a; var a = 2; var d = a;' +
			'return {a: a, b: b, c: c, d: d}' +
			'})()';
		var ast = parse(src);
		foldVars(ast);

		var out = gen(ast);

		assert.deepEqual(eval(out), eval(src));
	});

	it('inner evals');
	it('let');
	it('destructuring');
});
