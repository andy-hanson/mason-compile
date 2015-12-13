'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', '../../CompileError', '../lex/chars', '../Token', '../util'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('../../CompileError'), require('../lex/chars'), require('../Token'), require('../util'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.CompileError, global.chars, global.Token, global.util);
		global.english = mod.exports;
	}
})(this, function (exports, _CompileError, _chars, _Token, _util) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		// Lex:

		badInterpolation: `${ (0, _CompileError.code)('#') } must be followed by ${ (0, _CompileError.code)('(') }, ${ (0, _CompileError.code)('#') }, or a name.`,
		badSpacedIndent: indent => `Indentation spaces must be a multiple of ${ indent }.`,
		emptyBlock: 'Empty block.',
		extraSpace: 'Unnecessary space.',
		mismatchedGroupClose: (actual, expected) => `Trying to close ${ (0, _Token.showGroupKind)(actual) }, but last opened ${ (0, _Token.showGroupKind)(expected) }.`,
		noLeadingSpace: 'Line begins in a space',
		nonLeadingTab: 'Tab may only be used to indent',
		noNewlineInInterpolation: 'Quote interpolation cannot contain newline.',
		reservedChar: char => `Reserved character ${ (0, _chars.showChar)(char) }.`,
		suggestSimpleQuote: name => `Quoted text could be a simple quote ${ (0, _CompileError.code)(`'${ name }`) }.`,
		tooMuchIndent: 'Line is indented more than once.',
		tooMuchIndentQuote: 'Indented quote must have exactly one more indent than previous line.',
		trailingDocComment: `Doc comment must go on its own line. Did you mean ${ (0, _CompileError.code)('||') }?`,
		trailingSpace: 'Line ends in a space.',
		unclosedQuote: 'Unclosed quote.',

		// Parse:

		argsCond: `${ (0, _Token.showKeyword)(_Token.Keywords.Cond) } takes exactly 3 arguments.`,
		argsConditional: kind => `${ (0, _Token.showKeyword)(kind) } with no block takes exactly 2 arguments.`,
		argsDel: `${ (0, _Token.showKeyword)(_Token.Keywords.Del) } takes only one argument.`,
		argsTraitDo: `${ (0, _Token.showKeyword)(_Token.Keywords.TraitDo) } takes 2 arguments: implementor and trait.`,
		assignNothing: 'Assignment to nothing.',
		asToken: `Expected only 1 token after ${ (0, _Token.showKeyword)(_Token.Keywords.As) }.`,
		caseFocusIsImplicit: 'Can\'t make focus — is implicitly provided as first argument.',
		caseSwitchNeedsParts: `Must have at least 1 non-${ (0, _Token.showKeyword)(_Token.Keywords.Else) } test.`,
		destructureAllLazy: 'All locals of destructuring assignment must all lazy or all non-lazy.',
		expectedAfterAssert: `Expected something after ${ (0, _Token.showKeyword)(_Token.Keywords.Assert) }.`,
		expectedAfterColon: `Expected something after ${ (0, _Token.showKeyword)(_Token.Keywords.Colon) }.`,
		expectedBlock: 'Expected an indented block.',
		expectedExpression: 'Expected an expression, got nothing.',
		expectedFuncKind: token => `Expected function kind, got ${ token }.`,
		expectedImportModuleName: 'Expected a module name to import.',
		expectedKeyword: keyword => `Expected ${ (0, _Token.showKeyword)(keyword) }`,
		expectedMethodSplit: 'Expected a function keyword somewhere.',
		expectedOneLocal: 'Expected only one local declaration.',
		expectedLocalName: token => `Expected a local name, not ${ token }.`,
		expectedName: token => `Expected a name, not ${ token }`,
		extraParens: `Unnecessary ${ (0, _Token.showGroup)(_Token.Groups.Parenthesis) }`,
		implicitFunctionDot: `Function ${ (0, _chars.showChar)(_chars.Chars.Dot) } is implicit for methods.`,
		infiniteRange: `Use ${ (0, _Token.showKeyword)(_Token.Keywords.Dot3) } for infinite ranges.`,
		invalidImportModule: 'Not a valid module name.',
		noImportFocus: `${ (0, _Token.showKeyword)(_Token.Keywords.Focus) } not allowed as import name.`,
		noSpecialKeyword: kind => `${ (0, _Token.showKeyword)(kind) } is not allowed here.`,
		nothingAfterFinally: `Nothing may come after ${ (0, _Token.showKeyword)(_Token.Keywords.Finally) }.`,
		parensOutsideCall: `Use ${ (0, _CompileError.code)('(a b)') }, not ${ (0, _CompileError.code)('a(b)') }.`,
		reservedWord: token => `Reserved word ${ token }.`,
		switchArgIsImplicit: 'Value to switch on is `_`, the function\'s implicit argument.',
		tokenAfterSuper: `Expected ${ (0, _Token.showKeyword)(_Token.Keywords.Dot) } or ${ (0, _CompileError.code)('()') } after ${ (0, _Token.showKeyword)(_Token.Keywords.Super) }`,
		todoForPattern: 'TODO: pattern in for',
		todoLazyField: 'TODO: lazy fields',
		todoMutateDestructure: 'TODO: LocalDestructureMutate',
		unexpected: token => `Unexpected ${ token }.`,
		unexpectedAfter: token => `Did not expect anything after ${ token }.`,
		unexpectedAfterImportDo: `This is an ${ (0, _Token.showKeyword)(_Token.Keywords.ImportDo) }, so you can't import any values.`,
		unexpectedAfterKind: kind => `Did not expect anything between ${ (0, _Token.showKeyword)(kind) } and block.`,
		unexpectedAfterMethod: `Did not expect anything between ${ (0, _Token.showKeyword)(_Token.Keywords.Method) } and function.`,

		// Verify:

		ambiguousSK: 'Can\'t tell if this is a statement. Some parts are statements but others are values.',
		ambiguousForSK: `Can't tell if ${ (0, _Token.showKeyword)(_Token.Keywords.For) } is a statement. ` + `Some ${ (0, _Token.showKeyword)(_Token.Keywords.Break) }s have a value, others don't.`,
		argsLogic: 'Logic expression needs at least 2 arguments.',
		badRegExp: source => {
			try {
				/* eslint-disable no-new */
				new RegExp(source);
				// This should only be called for bad regexp...
				(0, _util.assert)(false);
			} catch (err) {
				return err.message;
			}
		},
		blockNeedsContent: 'Value block must have some content.',
		breakCantHaveValue: `${ (0, _Token.showKeyword)(_Token.Keywords.Break) } with value needs ${ (0, _Token.showKeyword)(_Token.Keywords.For) } to be in expression position.`,
		breakNeedsValue: `${ (0, _Token.showKeyword)(_Token.Keywords.For) } in expression position must ${ (0, _Token.showKeyword)(_Token.Keywords.Break) } with a value.`,
		breakValInForBag: `${ (0, _Token.showKeyword)(_Token.Keywords.Break) } in ${ (0, _Token.showKeyword)(_Token.Keywords.ForBag) } may not have value.`,
		cantDetermineName: 'Expression must be placed in a position where name can be determined.',
		cantInferBlockKind: 'Block has mixed bag/map/obj entries — can not infer type.',
		doFuncCantHaveType: 'Function with return type must return something.',
		duplicateImport: (name, prevLoc) => `${ (0, _CompileError.code)(name) } already imported at ${ prevLoc }`,
		duplicateKey: key => `Duplicate key ${ key }`,
		duplicateLocal: name => `A local ${ (0, _CompileError.code)(name) } already exists and can't be shadowed.`,
		elseRequiresCatch: `${ (0, _Token.showKeyword)(_Token.Keywords.Else) } must come after a ${ (0, _Token.showKeyword)(_Token.Keywords.Catch) }.`,
		exportName: 'Module export must have a constant name.',
		forAsyncNeedsAsync: `${ (0, _Token.showKeyword)(_Token.Keywords.ForAsync) } as statement must be inside an async function.`,
		misplacedAwait: `Cannot ${ (0, _Token.showKeyword)(_Token.Keywords.Await) } outside of async function.`,
		misplacedBreak: 'Not in a loop.',
		misplacedSpreadDo: `Can not spread here. Did you forget the space after ${ (0, _Token.showKeyword)(_Token.Keywords.Dot3) }?`,
		misplacedSpreadVal: `Can only spread in call, ${ (0, _Token.showKeyword)(_Token.Keywords.New) }, or ${ (0, _CompileError.code)('[]') }.`,
		misplacedYield: kind => `Cannot ${ (0, _Token.showKeyword)(kind) } outside of generator function.`,
		missingLocal: name => `No such local ${ (0, _CompileError.code)(name) }.`,
		noLazyCatch: 'Caught error can not be lazy.',
		noLazyIteratee: 'Iteration element can not be lazy.',
		overriddenBuiltin: (name, builtinPath) => `Local ${ (0, _CompileError.code)(name) } overrides builtin from ${ (0, _CompileError.code)(builtinPath) }.`,
		statementAsValue: 'This can only be used as a statement, but appears in expression context.',
		superForbidden: `Class has no superclass, so ${ (0, _Token.showKeyword)(_Token.Keywords.Super) } is not allowed.`,
		superMustBeStatement: `${ (0, _Token.showKeyword)(_Token.Keywords.Super) } in constructor must appear as a statement.'`,
		superNeeded: `Constructor must contain ${ (0, _Token.showKeyword)(_Token.Keywords.Super) }`,
		superNeedsMethod: `${ (0, _Token.showKeyword)(_Token.Keywords.Super) } must be in a method.`,
		unusedLocal: name => `Unused local variable ${ (0, _CompileError.code)(name) }.`,
		uselessExcept: `${ (0, _Token.showKeyword)(_Token.Keywords.Except) } must have ${ (0, _Token.showKeyword)(_Token.Keywords.Catch) } or ${ (0, _Token.showKeyword)(_Token.Keywords.Finally) }.`,
		valueAsStatement: 'Value appears in statement context, so it does nothing.'
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcml2YXRlL2xhbmd1YWdlcy9lbmdsaXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQkFLZTs7O0FBR2Qsa0JBQWdCLEVBQ2YsQ0FBQyxHQUFFLGtCQVRHLElBQUksRUFTRixHQUFHLENBQUMsRUFBQyxxQkFBcUIsR0FBRSxrQkFUOUIsSUFBSSxFQVMrQixHQUFHLENBQUMsRUFBQyxFQUFFLEdBQUUsa0JBVDVDLElBQUksRUFTNkMsR0FBRyxDQUFDLEVBQUMsWUFBWSxDQUFDO0FBQzFFLGlCQUFlLEVBQUUsTUFBTSxJQUN0QixDQUFDLHlDQUF5QyxHQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7QUFDdEQsWUFBVSxFQUNULGNBQWM7QUFDZixZQUFVLEVBQ1Qsb0JBQW9CO0FBQ3JCLHNCQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsS0FDdEMsQ0FBQyxnQkFBZ0IsR0FBRSxXQWZnQixhQUFhLEVBZWYsTUFBTSxDQUFDLEVBQUMsa0JBQWtCLEdBQUUsV0FmMUIsYUFBYSxFQWUyQixRQUFRLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDeEYsZ0JBQWMsRUFDYix3QkFBd0I7QUFDekIsZUFBYSxFQUNaLGdDQUFnQztBQUNqQywwQkFBd0IsRUFDdkIsNkNBQTZDO0FBQzlDLGNBQVksRUFBRSxJQUFJLElBQ2pCLENBQUMsbUJBQW1CLEdBQUUsV0F4QlQsUUFBUSxFQXdCVSxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDeEMsb0JBQWtCLEVBQUUsSUFBSSxJQUN2QixDQUFDLG9DQUFvQyxHQUFFLGtCQTNCakMsSUFBSSxFQTJCa0MsQ0FBQyxDQUFDLEdBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUMzRCxlQUFhLEVBQ1osa0NBQWtDO0FBQ25DLG9CQUFrQixFQUNqQixzRUFBc0U7QUFDdkUsb0JBQWtCLEVBQ2pCLENBQUMsa0RBQWtELEdBQUUsa0JBakMvQyxJQUFJ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QUFFLElBQUksSUFDaEIsQ0FBQyxzQkFBc0IsR0FBRSxrQkFsTW5CLElBQUksRUFrTW9CLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUN2QyxlQUFhLEVBQ1osQ0FBQyxHQUFFLFdBbE0rQyxXQUFXLEVBa012RCxPQWxNUSxRQUFRLENBa01QLE1BQU0sQ0FBQyxFQUFDLFdBQVcsR0FBRSxXQWxNYyxXQUFXLEVBa010QixPQWxNekIsUUFBUSxDQWtNMEIsS0FBSyxDQUFDLEVBQUMsSUFBSSxHQUFFLFdBbE1YLFdBQVcsRUFrTUcsT0FsTWxELFFBQVEsQ0FrTW1ELE9BQU8sQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNyRixrQkFBZ0IsRUFDZix5REFBeUQ7RUFDMUQiLCJmaWxlIjoiZW5nbGlzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29kZX0gZnJvbSAnLi4vLi4vQ29tcGlsZUVycm9yJ1xuaW1wb3J0IHtDaGFycywgc2hvd0NoYXJ9IGZyb20gJy4uL2xleC9jaGFycydcbmltcG9ydCB7R3JvdXBzLCBLZXl3b3Jkcywgc2hvd0dyb3VwLCBzaG93R3JvdXBLaW5kLCBzaG93S2V5d29yZCBhcyBrd30gZnJvbSAnLi4vVG9rZW4nXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQge1xuXHQvLyBMZXg6XG5cblx0YmFkSW50ZXJwb2xhdGlvbjpcblx0XHRgJHtjb2RlKCcjJyl9IG11c3QgYmUgZm9sbG93ZWQgYnkgJHtjb2RlKCcoJyl9LCAke2NvZGUoJyMnKX0sIG9yIGEgbmFtZS5gLFxuXHRiYWRTcGFjZWRJbmRlbnQ6IGluZGVudCA9PlxuXHRcdGBJbmRlbnRhdGlvbiBzcGFjZXMgbXVzdCBiZSBhIG11bHRpcGxlIG9mICR7aW5kZW50fS5gLFxuXHRlbXB0eUJsb2NrOlxuXHRcdCdFbXB0eSBibG9jay4nLFxuXHRleHRyYVNwYWNlOlxuXHRcdCdVbm5lY2Vzc2FyeSBzcGFjZS4nLFxuXHRtaXNtYXRjaGVkR3JvdXBDbG9zZTogKGFjdHVhbCwgZXhwZWN0ZWQpID0+XG5cdFx0YFRyeWluZyB0byBjbG9zZSAke3Nob3dHcm91cEtpbmQoYWN0dWFsKX0sIGJ1dCBsYXN0IG9wZW5lZCAke3Nob3dHcm91cEtpbmQoZXhwZWN0ZWQpfS5gLFxuXHRub0xlYWRpbmdTcGFjZTpcblx0XHQnTGluZSBiZWdpbnMgaW4gYSBzcGFjZScsXG5cdG5vbkxlYWRpbmdUYWI6XG5cdFx0J1RhYiBtYXkgb25seSBiZSB1c2VkIHRvIGluZGVudCcsXG5cdG5vTmV3bGluZUluSW50ZXJwb2xhdGlvbjpcblx0XHQnUXVvdGUgaW50ZXJwb2xhdGlvbiBjYW5ub3QgY29udGFpbiBuZXdsaW5lLicsXG5cdHJlc2VydmVkQ2hhcjogY2hhciA9PlxuXHRcdGBSZXNlcnZlZCBjaGFyYWN0ZXIgJHtzaG93Q2hhcihjaGFyKX0uYCxcblx0c3VnZ2VzdFNpbXBsZVF1b3RlOiBuYW1lID0+XG5cdFx0YFF1b3RlZCB0ZXh0IGNvdWxkIGJlIGEgc2ltcGxlIHF1b3RlICR7Y29kZShgJyR7bmFtZX1gKX0uYCxcblx0dG9vTXVjaEluZGVudDpcblx0XHQnTGluZSBpcyBpbmRlbnRlZCBtb3JlIHRoYW4gb25jZS4nLFxuXHR0b29NdWNoSW5kZW50UXVvdGU6XG5cdFx0J0luZGVudGVkIHF1b3RlIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBtb3JlIGluZGVudCB0aGFuIHByZXZpb3VzIGxpbmUuJyxcblx0dHJhaWxpbmdEb2NDb21tZW50OlxuXHRcdGBEb2MgY29tbWVudCBtdXN0IGdvIG9uIGl0cyBvd24gbGluZS4gRGlkIHlvdSBtZWFuICR7Y29kZSgnfHwnKX0/YCxcblx0dHJhaWxpbmdTcGFjZTpcblx0XHQnTGluZSBlbmRzIGluIGEgc3BhY2UuJyxcblx0dW5jbG9zZWRRdW90ZTpcblx0XHQnVW5jbG9zZWQgcXVvdGUuJyxcblxuXHQvLyBQYXJzZTpcblxuXHRhcmdzQ29uZDpcblx0XHRgJHtrdyhLZXl3b3Jkcy5Db25kKX0gdGFrZXMgZXhhY3RseSAzIGFyZ3VtZW50cy5gLFxuXHRhcmdzQ29uZGl0aW9uYWw6IGtpbmQgPT5cblx0XHRgJHtrdyhraW5kKX0gd2l0aCBubyBibG9jayB0YWtlcyBleGFjdGx5IDIgYXJndW1lbnRzLmAsXG5cdGFyZ3NEZWw6XG5cdFx0YCR7a3coS2V5d29yZHMuRGVsKX0gdGFrZXMgb25seSBvbmUgYXJndW1lbnQuYCxcblx0YXJnc1RyYWl0RG86XG5cdFx0YCR7a3coS2V5d29yZHMuVHJhaXREbyl9IHRha2VzIDIgYXJndW1lbnRzOiBpbXBsZW1lbnRvciBhbmQgdHJhaXQuYCxcblx0YXNzaWduTm90aGluZzpcblx0XHQnQXNzaWdubWVudCB0byBub3RoaW5nLicsXG5cdGFzVG9rZW46XG5cdFx0YEV4cGVjdGVkIG9ubHkgMSB0b2tlbiBhZnRlciAke2t3KEtleXdvcmRzLkFzKX0uYCxcblx0Y2FzZUZvY3VzSXNJbXBsaWNpdDpcblx0XHQnQ2FuXFwndCBtYWtlIGZvY3VzIOKAlCBpcyBpbXBsaWNpdGx5IHByb3ZpZGVkIGFzIGZpcnN0IGFyZ3VtZW50LicsXG5cdGNhc2VTd2l0Y2hOZWVkc1BhcnRzOlxuXHRcdGBNdXN0IGhhdmUgYXQgbGVhc3QgMSBub24tJHtrdyhLZXl3b3Jkcy5FbHNlKX0gdGVzdC5gLFxuXHRkZXN0cnVjdHVyZUFsbExhenk6XG5cdFx0J0FsbCBsb2NhbHMgb2YgZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50IG11c3QgYWxsIGxhenkgb3IgYWxsIG5vbi1sYXp5LicsXG5cdGV4cGVjdGVkQWZ0ZXJBc3NlcnQ6XG5cdFx0YEV4cGVjdGVkIHNvbWV0aGluZyBhZnRlciAke2t3KEtleXdvcmRzLkFzc2VydCl9LmAsXG5cdGV4cGVjdGVkQWZ0ZXJDb2xvbjpcblx0XHRgRXhwZWN0ZWQgc29tZXRoaW5nIGFmdGVyICR7a3coS2V5d29yZHMuQ29sb24pfS5gLFxuXHRleHBlY3RlZEJsb2NrOlxuXHRcdCdFeHBlY3RlZCBhbiBpbmRlbnRlZCBibG9jay4nLFxuXHRleHBlY3RlZEV4cHJlc3Npb246XG5cdFx0J0V4cGVjdGVkIGFuIGV4cHJlc3Npb24sIGdvdCBub3RoaW5nLicsXG5cdGV4cGVjdGVkRnVuY0tpbmQ6IHRva2VuID0+XG5cdFx0YEV4cGVjdGVkIGZ1bmN0aW9uIGtpbmQsIGdvdCAke3Rva2VufS5gLFxuXHRleHBlY3RlZEltcG9ydE1vZHVsZU5hbWU6XG5cdFx0J0V4cGVjdGVkIGEgbW9kdWxlIG5hbWUgdG8gaW1wb3J0LicsXG5cdGV4cGVjdGVkS2V5d29yZDoga2V5d29yZCA9PlxuXHRcdGBFeHBlY3RlZCAke2t3KGtleXdvcmQpfWAsXG5cdGV4cGVjdGVkTWV0aG9kU3BsaXQ6XG5cdFx0J0V4cGVjdGVkIGEgZnVuY3Rpb24ga2V5d29yZCBzb21ld2hlcmUuJyxcblx0ZXhwZWN0ZWRPbmVMb2NhbDpcblx0XHQnRXhwZWN0ZWQgb25seSBvbmUgbG9jYWwgZGVjbGFyYXRpb24uJyxcblx0ZXhwZWN0ZWRMb2NhbE5hbWU6IHRva2VuID0+XG5cdFx0YEV4cGVjdGVkIGEgbG9jYWwgbmFtZSwgbm90ICR7dG9rZW59LmAsXG5cdGV4cGVjdGVkTmFtZTogdG9rZW4gPT5cblx0XHRgRXhwZWN0ZWQgYSBuYW1lLCBub3QgJHt0b2tlbn1gLFxuXHRleHRyYVBhcmVuczpcblx0XHRgVW5uZWNlc3NhcnkgJHtzaG93R3JvdXAoR3JvdXBzLlBhcmVudGhlc2lzKX1gLFxuXHRpbXBsaWNpdEZ1bmN0aW9uRG90OlxuXHRcdGBGdW5jdGlvbiAke3Nob3dDaGFyKENoYXJzLkRvdCl9IGlzIGltcGxpY2l0IGZvciBtZXRob2RzLmAsXG5cdGluZmluaXRlUmFuZ2U6XG5cdFx0YFVzZSAke2t3KEtleXdvcmRzLkRvdDMpfSBmb3IgaW5maW5pdGUgcmFuZ2VzLmAsXG5cdGludmFsaWRJbXBvcnRNb2R1bGU6XG5cdFx0J05vdCBhIHZhbGlkIG1vZHVsZSBuYW1lLicsXG5cdG5vSW1wb3J0Rm9jdXM6XG5cdFx0YCR7a3coS2V5d29yZHMuRm9jdXMpfSBub3QgYWxsb3dlZCBhcyBpbXBvcnQgbmFtZS5gLFxuXHRub1NwZWNpYWxLZXl3b3JkOiBraW5kID0+XG5cdFx0YCR7a3coa2luZCl9IGlzIG5vdCBhbGxvd2VkIGhlcmUuYCxcblx0bm90aGluZ0FmdGVyRmluYWxseTpcblx0XHRgTm90aGluZyBtYXkgY29tZSBhZnRlciAke2t3KEtleXdvcmRzLkZpbmFsbHkpfS5gLFxuXHRwYXJlbnNPdXRzaWRlQ2FsbDpcblx0XHRgVXNlICR7Y29kZSgnKGEgYiknKX0sIG5vdCAke2NvZGUoJ2EoYiknKX0uYCxcblx0cmVzZXJ2ZWRXb3JkOiB0b2tlbiA9PlxuXHRcdGBSZXNlcnZlZCB3b3JkICR7dG9rZW59LmAsXG5cdHN3aXRjaEFyZ0lzSW1wbGljaXQ6XG5cdFx0J1ZhbHVlIHRvIHN3aXRjaCBvbiBpcyBgX2AsIHRoZSBmdW5jdGlvblxcJ3MgaW1wbGljaXQgYXJndW1lbnQuJyxcblx0dG9rZW5BZnRlclN1cGVyOlxuXHRcdGBFeHBlY3RlZCAke2t3KEtleXdvcmRzLkRvdCl9IG9yICR7Y29kZSgnKCknKX0gYWZ0ZXIgJHtrdyhLZXl3b3Jkcy5TdXBlcil9YCxcblx0dG9kb0ZvclBhdHRlcm46XG5cdFx0J1RPRE86IHBhdHRlcm4gaW4gZm9yJyxcblx0dG9kb0xhenlGaWVsZDpcblx0XHQnVE9ETzogbGF6eSBmaWVsZHMnLFxuXHR0b2RvTXV0YXRlRGVzdHJ1Y3R1cmU6XG5cdFx0J1RPRE86IExvY2FsRGVzdHJ1Y3R1cmVNdXRhdGUnLFxuXHR1bmV4cGVjdGVkOiB0b2tlbiA9PlxuXHRcdGBVbmV4cGVjdGVkICR7dG9rZW59LmAsXG5cdHVuZXhwZWN0ZWRBZnRlcjogdG9rZW4gPT5cblx0XHRgRGlkIG5vdCBleHBlY3QgYW55dGhpbmcgYWZ0ZXIgJHt0b2tlbn0uYCxcblx0dW5leHBlY3RlZEFmdGVySW1wb3J0RG86XG5cdFx0YFRoaXMgaXMgYW4gJHtrdyhLZXl3b3Jkcy5JbXBvcnREbyl9LCBzbyB5b3UgY2FuJ3QgaW1wb3J0IGFueSB2YWx1ZXMuYCxcblx0dW5leHBlY3RlZEFmdGVyS2luZDoga2luZCA9PlxuXHRcdGBEaWQgbm90IGV4cGVjdCBhbnl0aGluZyBiZXR3ZWVuICR7a3coa2luZCl9IGFuZCBibG9jay5gLFxuXHR1bmV4cGVjdGVkQWZ0ZXJNZXRob2Q6XG5cdFx0YERpZCBub3QgZXhwZWN0IGFueXRoaW5nIGJldHdlZW4gJHtrdyhLZXl3b3Jkcy5NZXRob2QpfSBhbmQgZnVuY3Rpb24uYCxcblxuXHQvLyBWZXJpZnk6XG5cblx0YW1iaWd1b3VzU0s6XG5cdFx0J0NhblxcJ3QgdGVsbCBpZiB0aGlzIGlzIGEgc3RhdGVtZW50LiBTb21lIHBhcnRzIGFyZSBzdGF0ZW1lbnRzIGJ1dCBvdGhlcnMgYXJlIHZhbHVlcy4nLFxuXHRhbWJpZ3VvdXNGb3JTSzpcblx0XHRgQ2FuJ3QgdGVsbCBpZiAke2t3KEtleXdvcmRzLkZvcil9IGlzIGEgc3RhdGVtZW50LiBgICtcblx0XHRgU29tZSAke2t3KEtleXdvcmRzLkJyZWFrKX1zIGhhdmUgYSB2YWx1ZSwgb3RoZXJzIGRvbid0LmAsXG5cdGFyZ3NMb2dpYzpcblx0XHQnTG9naWMgZXhwcmVzc2lvbiBuZWVkcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nLFxuXHRiYWRSZWdFeHA6IHNvdXJjZSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLW5ldyAqL1xuXHRcdFx0bmV3IFJlZ0V4cChzb3VyY2UpXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBmb3IgYmFkIHJlZ2V4cC4uLlxuXHRcdFx0YXNzZXJ0KGZhbHNlKVxuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVyci5tZXNzYWdlXG5cdFx0fVxuXHR9LFxuXHRibG9ja05lZWRzQ29udGVudDpcblx0XHQnVmFsdWUgYmxvY2sgbXVzdCBoYXZlIHNvbWUgY29udGVudC4nLFxuXHRicmVha0NhbnRIYXZlVmFsdWU6XG5cdFx0YCR7a3coS2V5d29yZHMuQnJlYWspfSB3aXRoIHZhbHVlIG5lZWRzICR7a3coS2V5d29yZHMuRm9yKX0gdG8gYmUgaW4gZXhwcmVzc2lvbiBwb3NpdGlvbi5gLFxuXHRicmVha05lZWRzVmFsdWU6XG5cdFx0YCR7a3coS2V5d29yZHMuRm9yKX0gaW4gZXhwcmVzc2lvbiBwb3NpdGlvbiBtdXN0ICR7a3coS2V5d29yZHMuQnJlYWspfSB3aXRoIGEgdmFsdWUuYCxcblx0YnJlYWtWYWxJbkZvckJhZzpcblx0XHRgJHtrdyhLZXl3b3Jkcy5CcmVhayl9IGluICR7a3coS2V5d29yZHMuRm9yQmFnKX0gbWF5IG5vdCBoYXZlIHZhbHVlLmAsXG5cdGNhbnREZXRlcm1pbmVOYW1lOlxuXHRcdCdFeHByZXNzaW9uIG11c3QgYmUgcGxhY2VkIGluIGEgcG9zaXRpb24gd2hlcmUgbmFtZSBjYW4gYmUgZGV0ZXJtaW5lZC4nLFxuXHRjYW50SW5mZXJCbG9ja0tpbmQ6XG5cdFx0J0Jsb2NrIGhhcyBtaXhlZCBiYWcvbWFwL29iaiBlbnRyaWVzIOKAlCBjYW4gbm90IGluZmVyIHR5cGUuJyxcblx0ZG9GdW5jQ2FudEhhdmVUeXBlOlxuXHRcdCdGdW5jdGlvbiB3aXRoIHJldHVybiB0eXBlIG11c3QgcmV0dXJuIHNvbWV0aGluZy4nLFxuXHRkdXBsaWNhdGVJbXBvcnQ6IChuYW1lLCBwcmV2TG9jKSA9PlxuXHRcdGAke2NvZGUobmFtZSl9IGFscmVhZHkgaW1wb3J0ZWQgYXQgJHtwcmV2TG9jfWAsXG5cdGR1cGxpY2F0ZUtleToga2V5ID0+XG5cdFx0YER1cGxpY2F0ZSBrZXkgJHtrZXl9YCxcblx0ZHVwbGljYXRlTG9jYWw6IG5hbWUgPT5cblx0XHRgQSBsb2NhbCAke2NvZGUobmFtZSl9IGFscmVhZHkgZXhpc3RzIGFuZCBjYW4ndCBiZSBzaGFkb3dlZC5gLFxuXHRlbHNlUmVxdWlyZXNDYXRjaDpcblx0XHRgJHtrdyhLZXl3b3Jkcy5FbHNlKX0gbXVzdCBjb21lIGFmdGVyIGEgJHtrdyhLZXl3b3Jkcy5DYXRjaCl9LmAsXG5cdGV4cG9ydE5hbWU6XG5cdFx0J01vZHVsZSBleHBvcnQgbXVzdCBoYXZlIGEgY29uc3RhbnQgbmFtZS4nLFxuXHRmb3JBc3luY05lZWRzQXN5bmM6XG5cdFx0YCR7a3coS2V5d29yZHMuRm9yQXN5bmMpfSBhcyBzdGF0ZW1lbnQgbXVzdCBiZSBpbnNpZGUgYW4gYXN5bmMgZnVuY3Rpb24uYCxcblx0bWlzcGxhY2VkQXdhaXQ6XG5cdFx0YENhbm5vdCAke2t3KEtleXdvcmRzLkF3YWl0KX0gb3V0c2lkZSBvZiBhc3luYyBmdW5jdGlvbi5gLFxuXHRtaXNwbGFjZWRCcmVhazpcblx0XHQnTm90IGluIGEgbG9vcC4nLFxuXHRtaXNwbGFjZWRTcHJlYWREbzpcblx0XHRgQ2FuIG5vdCBzcHJlYWQgaGVyZS4gRGlkIHlvdSBmb3JnZXQgdGhlIHNwYWNlIGFmdGVyICR7a3coS2V5d29yZHMuRG90Myl9P2AsXG5cdG1pc3BsYWNlZFNwcmVhZFZhbDpcblx0XHRgQ2FuIG9ubHkgc3ByZWFkIGluIGNhbGwsICR7a3coS2V5d29yZHMuTmV3KX0sIG9yICR7Y29kZSgnW10nKX0uYCxcblx0bWlzcGxhY2VkWWllbGQ6IGtpbmQgPT5cblx0XHRgQ2Fubm90ICR7a3coa2luZCl9IG91dHNpZGUgb2YgZ2VuZXJhdG9yIGZ1bmN0aW9uLmAsXG5cdG1pc3NpbmdMb2NhbDogbmFtZSA9PlxuXHRcdGBObyBzdWNoIGxvY2FsICR7Y29kZShuYW1lKX0uYCxcblx0bm9MYXp5Q2F0Y2g6XG5cdFx0J0NhdWdodCBlcnJvciBjYW4gbm90IGJlIGxhenkuJyxcblx0bm9MYXp5SXRlcmF0ZWU6XG5cdFx0J0l0ZXJhdGlvbiBlbGVtZW50IGNhbiBub3QgYmUgbGF6eS4nLFxuXHRvdmVycmlkZGVuQnVpbHRpbjogKG5hbWUsIGJ1aWx0aW5QYXRoKSA9PlxuXHRcdGBMb2NhbCAke2NvZGUobmFtZSl9IG92ZXJyaWRlcyBidWlsdGluIGZyb20gJHtjb2RlKGJ1aWx0aW5QYXRoKX0uYCxcblx0c3RhdGVtZW50QXNWYWx1ZTpcblx0XHQnVGhpcyBjYW4gb25seSBiZSB1c2VkIGFzIGEgc3RhdGVtZW50LCBidXQgYXBwZWFycyBpbiBleHByZXNzaW9uIGNvbnRleHQuJyxcblx0c3VwZXJGb3JiaWRkZW46XG5cdFx0YENsYXNzIGhhcyBubyBzdXBlcmNsYXNzLCBzbyAke2t3KEtleXdvcmRzLlN1cGVyKX0gaXMgbm90IGFsbG93ZWQuYCxcblx0c3VwZXJNdXN0QmVTdGF0ZW1lbnQ6XG5cdFx0YCR7a3coS2V5d29yZHMuU3VwZXIpfSBpbiBjb25zdHJ1Y3RvciBtdXN0IGFwcGVhciBhcyBhIHN0YXRlbWVudC4nYCxcblx0c3VwZXJOZWVkZWQ6XG5cdFx0YENvbnN0cnVjdG9yIG11c3QgY29udGFpbiAke2t3KEtleXdvcmRzLlN1cGVyKX1gLFxuXHRzdXBlck5lZWRzTWV0aG9kOlxuXHRcdGAke2t3KEtleXdvcmRzLlN1cGVyKX0gbXVzdCBiZSBpbiBhIG1ldGhvZC5gLFxuXHR1bnVzZWRMb2NhbDogbmFtZSA9PlxuXHRcdGBVbnVzZWQgbG9jYWwgdmFyaWFibGUgJHtjb2RlKG5hbWUpfS5gLFxuXHR1c2VsZXNzRXhjZXB0OlxuXHRcdGAke2t3KEtleXdvcmRzLkV4Y2VwdCl9IG11c3QgaGF2ZSAke2t3KEtleXdvcmRzLkNhdGNoKX0gb3IgJHtrdyhLZXl3b3Jkcy5GaW5hbGx5KX0uYCxcblx0dmFsdWVBc1N0YXRlbWVudDpcblx0XHQnVmFsdWUgYXBwZWFycyBpbiBzdGF0ZW1lbnQgY29udGV4dCwgc28gaXQgZG9lcyBub3RoaW5nLidcbn1cbiJdfQ==