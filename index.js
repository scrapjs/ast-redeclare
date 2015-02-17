/**
 * Redeclare variables within the scopes.
 * @module ast-redeclare
 */

var types = require('ast-types');
var n = types.namedTypes, b = types.builders;
var analyze = require('escope').analyze;


/**
 * Eval AST with options passed
 */
function redeclare(ast){
	var scopeMan = analyze(ast);

	//for each scope - redeclare variables
	scopeMan.scopes.forEach(function(scope){
		//append variable declarations statement
		var scopeNode = scope.block;
		var variableScope = scope.variableScope;

		var declarators = [];

		var declaration = b.variableDeclaration('var', declarators);

		//declare empty identifiers for found variables
		variableScope.variables.forEach(function(variable){
			//ignore implicitly declared variables
			if (variable.name === 'arguments') return;
			for (var i in variable.defs){
				if (variable.defs[i].type !== 'Variable') return;
			}

			var declarator = b.variableDeclarator(b.identifier(variable.name), null);
			declarators.push(declarator);
		});

		//replace declarators with init expressions
		types.visit(scopeNode, {
			visitVariableDeclaration: function(path){
				this.traverse(path);
				var node = path.node;

				var expressions = [];

				node.declarations.forEach(function(declarator){
					if (declarator.init) expressions.push(
						b.expressionStatement(
							b.assignmentExpression('=', declarator.id , declarator.init)
						)
					);
				});

				path.replace.apply(path, expressions);
			}
		});

		//append declaration to the beginning of scope
		if (declaration.declarations.length) {
			if (scope.type === 'global') {
				scopeNode.body.unshift(declaration);
			}
			else {
				scopeNode.body.body.unshift(declaration);
			}
		}

		// if (n.Program.check(scopeNode)) {
		// }
		// else if (n.Function.check(scopeNode)){
		// }
	});

	return ast;
}

module.exports = redeclare;