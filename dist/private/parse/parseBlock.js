var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports);if (v !== undefined) module.exports = v;
    } else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'op/Op', '../context', '../MsAst', '../Token', './checks', './parseLine', './tryTakeComment', './Slice'], factory);
    }
})(function (require, exports) {
    "use strict";

    var Op_1 = require('op/Op');
    var context_1 = require('../context');
    var MsAst_1 = require('../MsAst');
    var Token_1 = require('../Token');
    var checks_1 = require('./checks');
    var parseLine_1 = require('./parseLine');
    var tryTakeComment_1 = require('./tryTakeComment');
    var Slice_1 = require('./Slice');
    function parseBlock(lineTokens) {
        var _tryTakeComment_1$def = tryTakeComment_1.default(lineTokens);

        var _tryTakeComment_1$def2 = _slicedToArray(_tryTakeComment_1$def, 2);

        const opComment = _tryTakeComment_1$def2[0];
        const rest = _tryTakeComment_1$def2[1];

        return new MsAst_1.Block(lineTokens.loc, opComment, parseLine_1.parseLines(rest));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = parseBlock;
    function beforeAndBlock(tokens) {
        var _beforeAndOpBlock = beforeAndOpBlock(tokens);

        var _beforeAndOpBlock2 = _slicedToArray(_beforeAndOpBlock, 2);

        const before = _beforeAndOpBlock2[0];
        const opBlock = _beforeAndOpBlock2[1];

        const block = Op_1.orThrow(opBlock, () => context_1.fail(tokens.loc, _ => _.expectedBlock));
        return [before, block];
    }
    exports.beforeAndBlock = beforeAndBlock;
    function beforeAndOpBlock(tokens) {
        if (tokens.isEmpty()) return [tokens, null];else {
            const block = tokens.last();
            return block instanceof Token_1.GroupBlock ? [tokens.rtail(), Slice_1.Lines.of(block)] : [tokens, null];
        }
    }
    exports.beforeAndOpBlock = beforeAndOpBlock;
    function parseBlockWrap(tokens) {
        return new MsAst_1.BlockWrap(tokens.loc, parseBlock(tokens));
    }
    exports.parseBlockWrap = parseBlockWrap;
    function justBlock(keywordKind, tokens) {
        var _beforeAndBlock = beforeAndBlock(tokens);

        var _beforeAndBlock2 = _slicedToArray(_beforeAndBlock, 2);

        const before = _beforeAndBlock2[0];
        const block = _beforeAndBlock2[1];

        checks_1.checkEmpty(before, _ => _.unexpectedAfterKind(keywordKind));
        return block;
    }
    exports.justBlock = justBlock;
    function parseJustBlock(keywordKind, tokens) {
        return parseBlock(justBlock(keywordKind, tokens));
    }
    exports.parseJustBlock = parseJustBlock;
});
//# sourceMappingURL=parseBlock.js.map
