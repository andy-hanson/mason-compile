'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', '../MsAst', '../Token', '../util', './parse*', './parseBlock', './parseFun', './parseMethodImpls', './tryTakeComment'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('../MsAst'), require('../Token'), require('../util'), require('./parse*'), require('./parseBlock'), require('./parseFun'), require('./parseMethodImpls'), require('./tryTakeComment'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.MsAst, global.Token, global.util, global.parse, global.parseBlock, global.parseFun, global.parseMethodImpls, global.tryTakeComment);
		global.parseClass = mod.exports;
	}
})(this, function (exports, _MsAst, _Token, _util, _parse, _parseBlock, _parseFun, _parseMethodImpls, _tryTakeComment3) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = parseClass;

	var _parseMethodImpls2 = _interopRequireDefault(_parseMethodImpls);

	var _tryTakeComment4 = _interopRequireDefault(_tryTakeComment3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	function parseClass(tokens) {
		var _beforeAndOpBlock = (0, _parseBlock.beforeAndOpBlock)(tokens);

		var _beforeAndOpBlock2 = _slicedToArray(_beforeAndOpBlock, 2);

		const before = _beforeAndOpBlock2[0];
		const opBlock = _beforeAndOpBlock2[1];

		var _parseClassHeader = parseClassHeader(before);

		const opSuperClass = _parseClassHeader.opSuperClass;
		const kinds = _parseClassHeader.kinds;
		let opComment = null,
		    opDo = null,
		    statics = [],
		    opConstructor = null,
		    methods = [];

		const finish = () => new _MsAst.Class(tokens.loc, opSuperClass, kinds, opComment, opDo, statics, opConstructor, methods);

		if (opBlock === null) return finish();

		var _tryTakeComment = (0, _tryTakeComment4.default)(opBlock);

		var _tryTakeComment2 = _slicedToArray(_tryTakeComment, 2);

		let opCom = _tryTakeComment2[0];
		let rest = _tryTakeComment2[1];
		opComment = opCom;
		if (rest.isEmpty()) return finish();
		const line1 = rest.headSlice();

		if ((0, _Token.isKeyword)(_Token.Keywords.Do, line1.head())) {
			const done = (0, _parseBlock.parseJustBlock)(_Token.Keywords.Do, line1.tail());
			opDo = new _MsAst.ClassKindDo(line1.loc, done);
			rest = rest.tail();
		}

		if (rest.isEmpty()) return finish();
		const line2 = rest.headSlice();

		if ((0, _Token.isKeyword)(_Token.Keywords.Static, line2.head())) {
			statics = (0, _parseMethodImpls.parseStatics)(line2.tail());
			rest = rest.tail();
		}

		if (rest.isEmpty()) return finish();
		const line3 = rest.headSlice();

		if ((0, _Token.isKeyword)(_Token.Keywords.Construct, line3.head())) {
			opConstructor = parseConstructor(line3.tail());
			rest = rest.tail();
		}

		methods = (0, _parseMethodImpls2.default)(rest);
		return finish();
	}

	function parseClassHeader(tokens) {
		var _ifElse = (0, _util.ifElse)(tokens.opSplitOnce(_ => (0, _Token.isKeyword)(_Token.Keywords.Kind, _)), _ref => {
			let before = _ref.before;
			let after = _ref.after;
			return [before, (0, _parse.parseExprParts)(after)];
		}, () => [tokens, []]);

		var _ifElse2 = _slicedToArray(_ifElse, 2);

		const extendedTokens = _ifElse2[0];
		const kinds = _ifElse2[1];
		const opSuperClass = (0, _parse.opParseExpr)(extendedTokens);
		return {
			opSuperClass,
			kinds
		};
	}

	function parseConstructor(tokens) {
		var _funArgsAndBlock = (0, _parseFun.funArgsAndBlock)(tokens, false, true);

		const args = _funArgsAndBlock.args;
		const memberArgs = _funArgsAndBlock.memberArgs;
		const opRestArg = _funArgsAndBlock.opRestArg;
		const block = _funArgsAndBlock.block;
		const fun = new _MsAst.Fun(tokens.loc, args, opRestArg, block, {
			isThisFun: true,
			isDo: true
		});
		return new _MsAst.Constructor(tokens.loc, fun, memberArgs);
	}
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcml2YXRlL3BhcnNlL3BhcnNlQ2xhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQVV3QixVQUFVOzs7Ozs7Ozs7O1VBQVYsVUFBVSIsImZpbGUiOiJwYXJzZUNsYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDbGFzcywgQ2xhc3NLaW5kRG8sIENvbnN0cnVjdG9yLCBGdW59IGZyb20gJy4uL01zQXN0J1xuaW1wb3J0IHtpc0tleXdvcmQsIEtleXdvcmRzfSBmcm9tICcuLi9Ub2tlbidcbmltcG9ydCB7aWZFbHNlfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHtvcFBhcnNlRXhwciwgcGFyc2VFeHByUGFydHN9IGZyb20gJy4vcGFyc2UqJ1xuaW1wb3J0IHtiZWZvcmVBbmRPcEJsb2NrLCBwYXJzZUp1c3RCbG9ja30gZnJvbSAnLi9wYXJzZUJsb2NrJ1xuaW1wb3J0IHtmdW5BcmdzQW5kQmxvY2t9IGZyb20gJy4vcGFyc2VGdW4nXG5pbXBvcnQgcGFyc2VNZXRob2RJbXBscywge3BhcnNlU3RhdGljc30gZnJvbSAnLi9wYXJzZU1ldGhvZEltcGxzJ1xuaW1wb3J0IHRyeVRha2VDb21tZW50IGZyb20gJy4vdHJ5VGFrZUNvbW1lbnQnXG5cbi8qKiBQYXJzZSBhIHtAbGluayBDbGFzc30uICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUNsYXNzKHRva2Vucykge1xuXHRjb25zdCBbYmVmb3JlLCBvcEJsb2NrXSA9IGJlZm9yZUFuZE9wQmxvY2sodG9rZW5zKVxuXHRjb25zdCB7b3BTdXBlckNsYXNzLCBraW5kc30gPSBwYXJzZUNsYXNzSGVhZGVyKGJlZm9yZSlcblxuXHRsZXQgb3BDb21tZW50ID0gbnVsbCwgb3BEbyA9IG51bGwsIHN0YXRpY3MgPSBbXSwgb3BDb25zdHJ1Y3RvciA9IG51bGwsIG1ldGhvZHMgPSBbXVxuXHRjb25zdCBmaW5pc2ggPSAoKSA9PiBuZXcgQ2xhc3ModG9rZW5zLmxvYyxcblx0XHRcdG9wU3VwZXJDbGFzcywga2luZHMsIG9wQ29tbWVudCwgb3BEbywgc3RhdGljcywgb3BDb25zdHJ1Y3RvciwgbWV0aG9kcylcblxuXHRpZiAob3BCbG9jayA9PT0gbnVsbClcblx0XHRyZXR1cm4gZmluaXNoKClcblxuXHRsZXQgW29wQ29tLCByZXN0XSA9IHRyeVRha2VDb21tZW50KG9wQmxvY2spXG5cdG9wQ29tbWVudCA9IG9wQ29tXG5cblx0aWYgKHJlc3QuaXNFbXB0eSgpKVxuXHRcdHJldHVybiBmaW5pc2goKVxuXG5cdGNvbnN0IGxpbmUxID0gcmVzdC5oZWFkU2xpY2UoKVxuXHRpZiAoaXNLZXl3b3JkKEtleXdvcmRzLkRvLCBsaW5lMS5oZWFkKCkpKSB7XG5cdFx0Y29uc3QgZG9uZSA9IHBhcnNlSnVzdEJsb2NrKEtleXdvcmRzLkRvLCBsaW5lMS50YWlsKCkpXG5cdFx0b3BEbyA9IG5ldyBDbGFzc0tpbmREbyhsaW5lMS5sb2MsIGRvbmUpXG5cdFx0cmVzdCA9IHJlc3QudGFpbCgpXG5cdH1cblxuXHRpZiAocmVzdC5pc0VtcHR5KCkpXG5cdFx0cmV0dXJuIGZpbmlzaCgpXG5cblx0Y29uc3QgbGluZTIgPSByZXN0LmhlYWRTbGljZSgpXG5cdGlmIChpc0tleXdvcmQoS2V5d29yZHMuU3RhdGljLCBsaW5lMi5oZWFkKCkpKSB7XG5cdFx0c3RhdGljcyA9IHBhcnNlU3RhdGljcyhsaW5lMi50YWlsKCkpXG5cdFx0cmVzdCA9IHJlc3QudGFpbCgpXG5cdH1cblxuXHRpZiAocmVzdC5pc0VtcHR5KCkpXG5cdFx0cmV0dXJuIGZpbmlzaCgpXG5cblx0Y29uc3QgbGluZTMgPSByZXN0LmhlYWRTbGljZSgpXG5cdGlmIChpc0tleXdvcmQoS2V5d29yZHMuQ29uc3RydWN0LCBsaW5lMy5oZWFkKCkpKSB7XG5cdFx0b3BDb25zdHJ1Y3RvciA9IHBhcnNlQ29uc3RydWN0b3IobGluZTMudGFpbCgpKVxuXHRcdHJlc3QgPSByZXN0LnRhaWwoKVxuXHR9XG5cdG1ldGhvZHMgPSBwYXJzZU1ldGhvZEltcGxzKHJlc3QpXG5cblx0cmV0dXJuIGZpbmlzaCgpXG59XG5cbmZ1bmN0aW9uIHBhcnNlQ2xhc3NIZWFkZXIodG9rZW5zKSB7XG5cdGNvbnN0IFtleHRlbmRlZFRva2Vucywga2luZHNdID1cblx0XHRpZkVsc2UodG9rZW5zLm9wU3BsaXRPbmNlKF8gPT4gaXNLZXl3b3JkKEtleXdvcmRzLktpbmQsIF8pKSxcblx0XHRcdCh7YmVmb3JlLCBhZnRlcn0pID0+IFtiZWZvcmUsIHBhcnNlRXhwclBhcnRzKGFmdGVyKV0sXG5cdFx0XHQoKSA9PiBbdG9rZW5zLCBbXV0pXG5cdGNvbnN0IG9wU3VwZXJDbGFzcyA9IG9wUGFyc2VFeHByKGV4dGVuZGVkVG9rZW5zKVxuXHRyZXR1cm4ge29wU3VwZXJDbGFzcywga2luZHN9XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ29uc3RydWN0b3IodG9rZW5zKSB7XG5cdGNvbnN0IHthcmdzLCBtZW1iZXJBcmdzLCBvcFJlc3RBcmcsIGJsb2NrfSA9IGZ1bkFyZ3NBbmRCbG9jayh0b2tlbnMsIGZhbHNlLCB0cnVlKVxuXHRjb25zdCBmdW4gPSBuZXcgRnVuKHRva2Vucy5sb2MsIGFyZ3MsIG9wUmVzdEFyZywgYmxvY2ssIHtpc1RoaXNGdW46IHRydWUsIGlzRG86IHRydWV9KVxuXHRyZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRva2Vucy5sb2MsIGZ1biwgbWVtYmVyQXJncylcbn1cbiJdfQ==