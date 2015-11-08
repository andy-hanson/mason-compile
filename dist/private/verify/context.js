'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', '../MsAst', '../VerifyResults', './SK'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('../MsAst'), require('../VerifyResults'), require('./SK'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.MsAst, global.VerifyResults, global.SK);
		global.context = mod.exports;
	}
})(this, function (exports, _MsAst, _VerifyResults, _SK) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.name = exports.results = exports.method = exports.funKind = exports.pendingBlockLocals = exports.opLoop = exports.okToNotUse = exports.locals = undefined;
	exports.setup = setup;
	exports.tearDown = tearDown;
	exports.withInFunKind = withInFunKind;
	exports.withLoop = withLoop;
	exports.withMethod = withMethod;
	exports.withName = withName;
	exports.withIife = withIife;
	exports.withIifeIfVal = withIifeIfVal;
	exports.setPendingBlockLocals = setPendingBlockLocals;

	var _VerifyResults2 = _interopRequireDefault(_VerifyResults);

	var _SK2 = _interopRequireDefault(_SK);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	let locals = exports.locals = undefined;
	let okToNotUse = exports.okToNotUse = undefined;
	let opLoop = exports.opLoop = undefined;
	let pendingBlockLocals = exports.pendingBlockLocals = undefined;
	let funKind = exports.funKind = undefined;
	let method = exports.method = undefined;
	let results = exports.results = undefined;
	let name = exports.name = undefined;

	function setup() {
		exports.locals = locals = new Map();
		exports.pendingBlockLocals = pendingBlockLocals = [];
		exports.funKind = funKind = _MsAst.Funs.Plain;
		exports.okToNotUse = okToNotUse = new Set();
		exports.opLoop = opLoop = null;
		exports.method = method = null;
		exports.results = results = new _VerifyResults2.default();
	}

	function tearDown() {
		exports.locals = locals = exports.okToNotUse = okToNotUse = exports.opLoop = opLoop = exports.pendingBlockLocals = pendingBlockLocals = exports.method = method = exports.results = results = null;
	}

	function withInFunKind(newFunKind, action) {
		const oldFunKind = funKind;
		exports.funKind = funKind = newFunKind;
		action();
		exports.funKind = funKind = oldFunKind;
	}

	function withLoop(newLoop, action) {
		const oldLoop = opLoop;
		exports.opLoop = opLoop = newLoop;
		action();
		exports.opLoop = opLoop = oldLoop;
	}

	function withMethod(newMethod, action) {
		const oldMethod = method;
		exports.method = method = newMethod;
		action();
		exports.method = method = oldMethod;
	}

	function withName(newName, action) {
		const oldName = name;
		exports.name = name = newName;
		action();
		exports.name = name = oldName;
	}

	function withIife(action) {
		withLoop(null, action);
	}

	function withIifeIfVal(sk, action) {
		if (sk === _SK2.default.Val) withIife(action);else action();
	}

	function setPendingBlockLocals(val) {
		exports.pendingBlockLocals = pendingBlockLocals = val;
	}
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcml2YXRlL3ZlcmlmeS9jb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FvQ2dCLEtBQUssR0FBTCxLQUFLO1NBV0wsUUFBUSxHQUFSLFFBQVE7U0FJUixhQUFhLEdBQWIsYUFBYTtTQU9iLFFBQVEsR0FBUixRQUFRO1NBT1IsVUFBVSxHQUFWLFVBQVU7U0FPVixRQUFRLEdBQVIsUUFBUTtTQVFSLFFBQVEsR0FBUixRQUFRO1NBS1IsYUFBYSxHQUFiLGFBQWE7U0FRYixxQkFBcUIsR0FBckIscUJBQXFCOzs7Ozs7OztLQXhGMUIsTUFBTSxXQUFOLE1BQU07S0FFTixVQUFVLFdBQVYsVUFBVTtLQUNWLE1BQU0sV0FBTixNQUFNO0tBZU4sa0JBQWtCLFdBQWxCLGtCQUFrQjtLQUtsQixPQUFPLFdBQVAsT0FBTztLQUVQLE1BQU0sV0FBTixNQUFNO0tBRU4sT0FBTyxXQUFQLE9BQU87S0FFUCxJQUFJLFdBQUosSUFBSTs7VUFFQyxLQUFLO1VBL0JWLE1BQU0sR0FnQ2hCLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRTtVQWRSLGtCQUFrQixHQWU1QixrQkFBa0IsR0FBRyxFQUFFO1VBVmIsT0FBTyxHQVdqQixPQUFPLEdBQUcsT0F2Q0gsSUFBSSxDQXVDSSxLQUFLO1VBaENWLFVBQVUsR0FpQ3BCLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRTtVQWhDWixNQUFNLEdBaUNoQixNQUFNLEdBQUcsSUFBSTtVQVhILE1BQU0sR0FZaEIsTUFBTSxHQUFHLElBQUk7VUFWSCxPQUFPLEdBV2pCLE9BQU8sR0FBRyw2QkFBbUI7OztVQUlkLFFBQVE7VUExQ2IsTUFBTSxHQTJDaEIsTUFBTSxXQXpDSSxVQUFVLEdBeUNYLFVBQVUsV0F4Q1QsTUFBTSxHQXdDTSxNQUFNLFdBekJsQixrQkFBa0IsR0F5Qkcsa0JBQWtCLFdBbEJ2QyxNQUFNLEdBa0JvQyxNQUFNLFdBaEJoRCxPQUFPLEdBZ0I0QyxPQUFPLEdBQUcsSUFBSTs7O1VBRzVELGFBQWE7O1VBdkJsQixPQUFPLEdBeUJqQixPQUFPLEdBQUcsVUFBVTs7VUF6QlYsT0FBTyxHQTJCakIsT0FBTyxHQUFHLFVBQVU7OztVQUdMLFFBQVE7O1VBbERiLE1BQU0sR0FvRGhCLE1BQU0sR0FBRyxPQUFPOztVQXBETixNQUFNLEdBc0RoQixNQUFNLEdBQUcsT0FBTzs7O1VBR0QsVUFBVTs7VUFuQ2YsTUFBTSxHQXFDaEIsTUFBTSxHQUFHLFNBQVM7O1VBckNSLE1BQU0sR0F1Q2hCLE1BQU0sR0FBRyxTQUFTOzs7VUFHSCxRQUFROztVQXRDYixJQUFJLEdBd0NkLElBQUksR0FBRyxPQUFPOztVQXhDSixJQUFJLEdBMENkLElBQUksR0FBRyxPQUFPOzs7VUFJQyxRQUFROzs7O1VBS1IsYUFBYTs7OztVQVFiLHFCQUFxQjtVQXRFMUIsa0JBQWtCLEdBdUU1QixrQkFBa0IsR0FBRyxHQUFHIiwiZmlsZSI6ImNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Z1bnN9IGZyb20gJy4uL01zQXN0J1xuaW1wb3J0IFZlcmlmeVJlc3VsdHMgZnJvbSAnLi4vVmVyaWZ5UmVzdWx0cydcbmltcG9ydCBTSyBmcm9tICcuL1NLJ1xuXG4vKiogTWFwIGZyb20gbmFtZXMgdG8gTG9jYWxEZWNsYXJlcy4gKi9cbmV4cG9ydCBsZXQgbG9jYWxzXG4vKiogTG9jYWxzIHRoYXQgZG9uJ3QgaGF2ZSB0byBiZSBhY2Nlc3NlZC4gKi9cbmV4cG9ydCBsZXQgb2tUb05vdFVzZVxuZXhwb3J0IGxldCBvcExvb3Bcbi8qKlxuTG9jYWxzIGZvciB0aGlzIGJsb2NrLlxuVGhlc2UgYXJlIGFkZGVkIHRvIGxvY2FscyB3aGVuIGVudGVyaW5nIGEgRnVuY3Rpb24gb3IgbGF6eSBldmFsdWF0aW9uLlxuSW46XG5cdGEgPSB8XG5cdFx0YlxuXHRiID0gMVxuYGJgIHdpbGwgYmUgYSBwZW5kaW5nIGxvY2FsLlxuSG93ZXZlcjpcblx0YSA9IGJcblx0YiA9IDFcbndpbGwgZmFpbCB0byB2ZXJpZnksIGJlY2F1c2UgYGJgIGNvbWVzIGFmdGVyIGBhYCBhbmQgaXMgbm90IGFjY2Vzc2VkIGluc2lkZSBhIGZ1bmN0aW9uLlxuSXQgd291bGQgd29yayBmb3IgYH5hIGlzIGJgLCB0aG91Z2guXG4qL1xuZXhwb3J0IGxldCBwZW5kaW5nQmxvY2tMb2NhbHNcbi8qKlxuS2luZCBvZiBmdW5jdGlvbiB3ZSBhcmUgY3VycmVudGx5IGluLlxuKEZ1bnMuUGxhaW4gaWYgbm90IGluIGEgZnVuY3Rpb24uKVxuKi9cbmV4cG9ydCBsZXQgZnVuS2luZFxuLyoqIEN1cnJlbnQgbWV0aG9kIHdlIGFyZSBpbiwgb3IgYSBDb25zdHJ1Y3Rvciwgb3IgbnVsbC4gKi9cbmV4cG9ydCBsZXQgbWV0aG9kXG4vKiogQHR5cGUge1ZlcmlmeVJlc3VsdHN9ICovXG5leHBvcnQgbGV0IHJlc3VsdHNcbi8qKiBOYW1lIG9mIHRoZSBjbG9zZXN0IEFzc2lnblNpbmdsZS4gKi9cbmV4cG9ydCBsZXQgbmFtZVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG5cdGxvY2FscyA9IG5ldyBNYXAoKVxuXHRwZW5kaW5nQmxvY2tMb2NhbHMgPSBbXVxuXHRmdW5LaW5kID0gRnVucy5QbGFpblxuXHRva1RvTm90VXNlID0gbmV3IFNldCgpXG5cdG9wTG9vcCA9IG51bGxcblx0bWV0aG9kID0gbnVsbFxuXHRyZXN1bHRzID0gbmV3IFZlcmlmeVJlc3VsdHMoKVxufVxuXG4vLyBSZWxlYXNlIGZvciBnYXJiYWdlIGNvbGxlY3Rpb24uXG5leHBvcnQgZnVuY3Rpb24gdGVhckRvd24oKSB7XG5cdGxvY2FscyA9IG9rVG9Ob3RVc2UgPSBvcExvb3AgPSBwZW5kaW5nQmxvY2tMb2NhbHMgPSBtZXRob2QgPSByZXN1bHRzID0gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEluRnVuS2luZChuZXdGdW5LaW5kLCBhY3Rpb24pIHtcblx0Y29uc3Qgb2xkRnVuS2luZCA9IGZ1bktpbmRcblx0ZnVuS2luZCA9IG5ld0Z1bktpbmRcblx0YWN0aW9uKClcblx0ZnVuS2luZCA9IG9sZEZ1bktpbmRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMb29wKG5ld0xvb3AsIGFjdGlvbikge1xuXHRjb25zdCBvbGRMb29wID0gb3BMb29wXG5cdG9wTG9vcCA9IG5ld0xvb3Bcblx0YWN0aW9uKClcblx0b3BMb29wID0gb2xkTG9vcFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aE1ldGhvZChuZXdNZXRob2QsIGFjdGlvbikge1xuXHRjb25zdCBvbGRNZXRob2QgPSBtZXRob2Rcblx0bWV0aG9kID0gbmV3TWV0aG9kXG5cdGFjdGlvbigpXG5cdG1ldGhvZCA9IG9sZE1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aE5hbWUobmV3TmFtZSwgYWN0aW9uKSB7XG5cdGNvbnN0IG9sZE5hbWUgPSBuYW1lXG5cdG5hbWUgPSBuZXdOYW1lXG5cdGFjdGlvbigpXG5cdG5hbWUgPSBvbGROYW1lXG59XG5cbi8qKiBDYW4ndCBicmVhayBvdXQgb2YgbG9vcCBpbnNpZGUgb2YgSUlGRS4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoSWlmZShhY3Rpb24pIHtcblx0d2l0aExvb3AobnVsbCwgYWN0aW9uKVxufVxuXG4vKiogVGhlIHZhbHVlIGZvcm0gb2Ygc29tZSBleHByZXNzaW9ucyBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRS4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoSWlmZUlmVmFsKHNrLCBhY3Rpb24pIHtcblx0aWYgKHNrID09PSBTSy5WYWwpXG5cdFx0d2l0aElpZmUoYWN0aW9uKVxuXHRlbHNlXG5cdFx0YWN0aW9uKClcbn1cblxuLy8gVE9ETzpFUzYgU2hvdWxkbid0IG5lZWQgdGhpc1xuZXhwb3J0IGZ1bmN0aW9uIHNldFBlbmRpbmdCbG9ja0xvY2Fscyh2YWwpIHtcblx0cGVuZGluZ0Jsb2NrTG9jYWxzID0gdmFsXG59XG4iXX0=