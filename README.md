# ast-redeclare [![Build Status](https://travis-ci.org/dfcreative/ast-redeclare.svg?branch=master)](https://travis-ci.org/dfcreative/ast-redeclare)

Hoist and fold variable declarations within scopes, so that each variable has only one declaration per scope. Don’t touch functions.
Useful to normalize code before analysis, like data-flow etc.


## Usage

```sh
npm install ast-redeclare
```

```js
var parse = require('esprima').parse;
var generate = require('escodegen').generate;
var redeclare = require('ast-redeclare');

var ast = parse(
	'var a = 1, b = 2; if (a > 1) { var c = b; } else {var c = 3;} var d = 4;'
);
ast = redeclare(ast);

generate(ast);
//var a, b, c, d; a = 1; b = 2; if (a > 1) { c = b; } else { c = 3; }; d = 4;

```

## API

#### redeclare(Node) → Node


## Analogs

* [ast-hoist](https://www.npmjs.com/package/ast-hoist)
* [hoister](https://www.npmjs.com/package/hoister)


[![NPM](https://nodei.co/npm/ast-redeclare.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ast-redeclare/)