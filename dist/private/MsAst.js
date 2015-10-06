if (typeof define !== 'function') var define = require('amdefine')(module);define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	class MsAst {
		constructor(loc) {
			this.loc = loc;
		}

		toString() {
			const inspect = _ => _ === null ? 'null' : _ === undefined ? 'undefined' : _ instanceof Array ? `[\n\t${ _.map(_ => indent(_.toString())).join(',\n\t') }\n]` : typeof _ === 'string' ? JSON.stringify(_) : _.toString();

			const indent = str => str.replace(/\n/g, '\n\t');

			const type = this.constructor.name;
			const props = Object.keys(this).map(key => '\n\t' + `${ key }: ` + indent(inspect(this[key]))).join(',');
			return `${ type }(${ props })`;
		}
	}

	// LineContent
	// Valid part of a Block.
	exports.default = MsAst;

	class LineContent extends MsAst {}

	// These can only appear as lines in a Block.
	exports.LineContent = LineContent;

	class Do extends LineContent {}

	// These can appear in any expression.
	exports.Do = Do;

	class Val extends LineContent {}

	// Module
	exports.Val = Val;

	class Module extends MsAst {
		constructor(loc, opComment, // Opt[String]
		doImports, // Array[ImportDo]
		imports, // Array[Import]
		opImportGlobal, // Nullable[ImportGlobal]
		debugImports, // Array[Import]
		lines) {
			// Array[Do]
			super(loc);
			this.opComment = opComment;
			this.doImports = doImports;
			this.imports = imports;
			this.opImportGlobal = opImportGlobal;
			this.debugImports = debugImports;
			this.lines = lines;
		}
	}

	exports.Module = Module;

	class ModuleExport extends Do {
		constructor(loc, assign /* AssignSingle */) {
			super(loc);
			this.assign = assign;
		}
	}

	exports.ModuleExport = ModuleExport;

	class ModuleExportNamed extends ModuleExport {}

	exports.ModuleExportNamed = ModuleExportNamed;

	class ModuleExportDefault extends ModuleExport {}

	exports.ModuleExportDefault = ModuleExportDefault;

	class ImportDo extends MsAst {
		constructor(loc, path /* String */) {
			super(loc);
			this.path = path;
		}
	}

	exports.ImportDo = ImportDo;

	class Import extends MsAst {
		constructor(loc, path, // String
		imported, // Array[LocalDeclare]
		opImportDefault) {
			// Opt[LocalDeclare]
			super(loc);
			this.path = path;
			this.imported = imported;
			this.opImportDefault = opImportDefault;
		}
	}

	exports.Import = Import;

	class ImportGlobal extends MsAst {
		constructor(loc, imported, // Array[LocalDeclare]
		opImportDefault) {
			/* Opt[LocalDeclare] */
			super(loc);
			this.imported = imported;
			this.opImportDefault = opImportDefault;
		}
	}

	// Locals
	exports.ImportGlobal = ImportGlobal;
	const LD_Const = 0,
	      LD_Lazy = 1,
	      LD_Mutable = 2;
	exports.LD_Const = LD_Const;
	exports.LD_Lazy = LD_Lazy;
	exports.LD_Mutable = LD_Mutable;

	class LocalDeclare extends MsAst {
		static untyped(loc, name, kind) {
			return new LocalDeclare(loc, name, null, kind);
		}

		static plain(loc, name) {
			return new LocalDeclare(loc, name, null, LD_Const);
		}

		constructor(loc, name, /* String */opType, /* Opt[Val] */kind /* Number */) {
			super(loc);
			this.name = name;
			this.opType = opType;
			this.kind = kind;
		}

		isLazy() {
			return this.kind === LD_Lazy;
		}

		isMutable() {
			return this.kind === LD_Mutable;
		}
	}

	exports.LocalDeclare = LocalDeclare;

	class LocalDeclareBuilt extends LocalDeclare {
		constructor(loc) {
			super(loc, 'built', null, LD_Const);
		}
	}

	exports.LocalDeclareBuilt = LocalDeclareBuilt;

	class LocalDeclareFocus extends LocalDeclare {
		constructor(loc) {
			super(loc, '_', null, LD_Const);
		}
	}

	exports.LocalDeclareFocus = LocalDeclareFocus;

	class LocalDeclareName extends LocalDeclare {
		constructor(loc) {
			super(loc, 'name', null, LD_Const);
		}
	}

	exports.LocalDeclareName = LocalDeclareName;

	class LocalDeclareThis extends LocalDeclare {
		constructor(loc) {
			super(loc, 'this', null, LD_Const);
		}
	}

	exports.LocalDeclareThis = LocalDeclareThis;

	class LocalDeclareRes extends LocalDeclare {
		constructor(loc, opType) {
			super(loc, 'res', opType, LD_Const);
		}
	}

	exports.LocalDeclareRes = LocalDeclareRes;

	class LocalAccess extends Val {
		static focus(loc) {
			return new LocalAccess(loc, '_');
		}

		static this(loc) {
			return new LocalAccess(loc, 'this');
		}

		constructor(loc, name /* String */) {
			super(loc);
			this.name = name;
		}
	}

	exports.LocalAccess = LocalAccess;

	class LocalMutate extends Do {
		constructor(loc, name, /* String */value /* Val */) {
			super(loc);
			this.name = name;
			this.value = value;
		}
	}

	// Assign
	exports.LocalMutate = LocalMutate;

	class Assign extends Do {}

	exports.Assign = Assign;

	class AssignSingle extends Assign {
		static focus(loc, value) {
			return new AssignSingle(loc, new LocalDeclareFocus(loc), value);
		}

		constructor(loc, assignee, /* LocalDeclare */value /* Val */) {
			super(loc);
			this.assignee = assignee;
			this.value = value;
		}

		allAssignees() {
			return [this.assignee];
		}
	}

	exports.AssignSingle = AssignSingle;

	class AssignDestructure extends Assign {
		constructor(loc, assignees, /* Array[LocalDeclare] */value /* Val */) {
			super(loc);
			this.assignees = assignees;
			this.value = value;
		}

		allAssignees() {
			return this.assignees;
		}

		kind() {
			return this.assignees[0].kind;
		}
	}

	exports.AssignDestructure = AssignDestructure;
	const MS_New = 0,
	      MS_Mutate = 1,
	      MS_NewMutable = 2;
	exports.MS_New = MS_New;
	exports.MS_Mutate = MS_Mutate;
	exports.MS_NewMutable = MS_NewMutable;

	class MemberSet extends Do {
		constructor(loc, object, /* Val */name, /* String */kind, /* Number */value /* Val */) {
			super(loc);
			this.object = object;
			this.name = name;
			this.kind = kind;
			this.value = value;
		}
	}

	// Errors
	exports.MemberSet = MemberSet;

	class Throw extends Do {
		constructor(loc, opThrown /* Opt[Val] */) {
			super(loc);
			this.opThrown = opThrown;
		}
	}

	exports.Throw = Throw;

	class Assert extends Do {
		constructor(loc, negate, /* Boolean */condition, /* Val */opThrown /* Opt[Val] */) {
			super(loc);
			this.negate = negate;
			// condition treated specially if a Call.
			this.condition = condition;
			this.opThrown = opThrown;
		}
	}

	exports.Assert = Assert;

	class ExceptDo extends Do {
		constructor(loc, _try, /* BlockDo */_catch, /* Opt[Catch] */_finally /* Opt[BlockDo] */) {
			super(loc);
			this._try = _try;
			this._catch = _catch;
			this._finally = _finally;
		}
	}

	exports.ExceptDo = ExceptDo;

	class ExceptVal extends Val {
		constructor(loc, _try, // BlockVal
		_catch, // Opt[Catch]
		_finally) {
			// Opt[BlockDo]
			super(loc);
			this._try = _try;
			this._catch = _catch;
			this._finally = _finally;
		}
	}

	exports.ExceptVal = ExceptVal;

	class Catch extends MsAst {
		constructor(loc, caught, /* LocalDeclare */block /* BlockDo/BlockVal */) {
			super(loc);
			this.caught = caught;
			this.block = block;
		}
	}

	// Debug
	exports.Catch = Catch;

	class Debug extends Do {
		constructor(loc, lines /* Array[LineContent] */) {
			super(loc);
			this.lines = lines;
		}
	}

	// Block
	exports.Debug = Debug;

	class Block extends MsAst {
		constructor(loc, opComment /* Opt[String] */) {
			super(loc);
			this.opComment = opComment;
		}
	}

	exports.Block = Block;

	class BlockDo extends Block {
		constructor(loc, opComment, lines /* Array[LineContent] */) {
			super(loc, opComment);
			this.lines = lines;
		}
	}

	exports.BlockDo = BlockDo;

	class BlockVal extends Block {}

	exports.BlockVal = BlockVal;

	class BlockWithReturn extends BlockVal {
		constructor(loc, opComment, lines, /* Array[LineContent] */returned /* Val */) {
			super(loc, opComment);
			this.lines = lines;
			this.returned = returned;
		}
	}

	exports.BlockWithReturn = BlockWithReturn;

	class BlockValThrow extends BlockVal {
		constructor(loc, opComment, lines, /* Array[LineContent] */_throw /* Throw */) {
			super(loc, opComment);
			this.lines = lines;
			this.throw = _throw;
		}
	}

	// TODO: BlockBag, BlockMap, BlockObj => BlockBuild(kind, ...)
	exports.BlockValThrow = BlockValThrow;

	class BlockObj extends BlockVal {
		static of(loc, opComment, lines) {
			let opObjed = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
			let opName = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

			return new BlockObj(loc, opComment, new LocalDeclareBuilt(loc), lines, opObjed, opName);
		}

		constructor(loc, opComment, built, // LocalDeclareBuilt
		lines, // Array[Union[LineContent ObjEntry]]
		opObjed, // Opt[Val]
		opName) {
			// Opt[String]
			super(loc, opComment);
			this.built = built;
			this.lines = lines;
			this.opObjed = opObjed;
			this.opName = opName;
		}
	}

	exports.BlockObj = BlockObj;

	class ObjEntry extends Do {
		constructor(loc) {
			super(loc);
			this.opComment = null;
		}
	}

	exports.ObjEntry = ObjEntry;

	class ObjEntryAssign extends ObjEntry {
		constructor(loc, assign /* Assign */) {
			super(loc);
			this.assign = assign;
		}
	}

	exports.ObjEntryAssign = ObjEntryAssign;

	class ObjEntryComputed extends ObjEntry {
		static name(loc, value) {
			return new ObjEntryComputed(loc, Quote.forString(loc, 'name'), value);
		}

		constructor(loc, key, /* Val */value /* Val */) {
			super(loc);
			this.key = key;
			this.value = value;
		}
	}

	exports.ObjEntryComputed = ObjEntryComputed;

	class BlockBag extends BlockVal {
		static of(loc, opComment, lines) {
			return new BlockBag(loc, opComment, new LocalDeclareBuilt(loc), lines);
		}

		constructor(loc, opComment, built, // LocalDeclareBuilt
		lines) {
			// Union[LineContent BagEntry]
			super(loc, opComment);
			this.built = built;
			this.lines = lines;
		}
	}

	exports.BlockBag = BlockBag;

	class BagEntry extends Do {
		constructor(loc, value /* Val */) {
			super(loc);
			this.value = value;
		}
	}

	exports.BagEntry = BagEntry;

	class BagEntryMany extends Do {
		constructor(loc, value /* Val */) {
			super(loc);
			this.value = value;
		}
	}

	exports.BagEntryMany = BagEntryMany;

	class BlockMap extends BlockVal {
		static of(loc, opComment, lines) {
			return new BlockMap(loc, opComment, new LocalDeclareBuilt(loc), lines);
		}

		constructor(loc, opComment, built, // LocalDeclareBuilt
		lines) {
			// Union[LineContent MapEntry]
			super(loc, opComment);
			this.built = built;
			this.lines = lines;
		}
	}

	exports.BlockMap = BlockMap;

	class MapEntry extends Do {
		constructor(loc, key, /* Val */val /* Val */) {
			super(loc);
			this.key = key;
			this.val = val;
		}
	}

	// Conditionals
	exports.MapEntry = MapEntry;

	class ConditionalDo extends Do {
		constructor(loc, test, /* Val */result, /* BlockDo */isUnless /* Boolean */) {
			super(loc);
			this.test = test;
			this.result = result;
			this.isUnless = isUnless;
		}
	}

	exports.ConditionalDo = ConditionalDo;

	class ConditionalVal extends Val {
		constructor(loc, test, /* Val */result, /* BlockVal */isUnless /* Boolean */) {
			super(loc);
			this.test = test;
			this.result = result;
			this.isUnless = isUnless;
		}
	}

	exports.ConditionalVal = ConditionalVal;

	class Cond extends Val {
		constructor(loc, test, /* Val */ifTrue, /* Val */ifFalse /* Val */) {
			super(loc);
			this.test = test;
			this.ifTrue = ifTrue;
			this.ifFalse = ifFalse;
		}
	}

	// Fun
	exports.Cond = Cond;

	class Fun extends Val {
		constructor(loc, opDeclareThis, // Opt[LocalDeclareThis]
		isGenerator, // Boolean
		args, // Array[LocalDeclare]
		opRestArg, // Opt[LocalDeclare]
		block) {
			let opIn = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];
			let opDeclareRes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];
			let opOut = arguments.length <= 8 || arguments[8] === undefined ? null : arguments[8];
			// Opt[Debug]) {
			super(loc);
			this.opDeclareThis = opDeclareThis;
			this.isGenerator = isGenerator;
			this.args = args;
			this.opRestArg = opRestArg;
			this.block = block;
			this.opIn = opIn;
			this.opDeclareRes = opDeclareRes;
			this.opOut = opOut;
		}
	}

	// Generator
	exports.Fun = Fun;

	class Yield extends Val {
		constructor(loc) /* Opt[Val] */{
			let opYielded = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			super(loc);
			this.opYielded = opYielded;
		}
	}

	exports.Yield = Yield;

	class YieldTo extends Val {
		constructor(loc, yieldedTo /* Val */) {
			super(loc);
			this.yieldedTo = yieldedTo;
		}
	}

	// Class
	exports.YieldTo = YieldTo;

	class Class extends Val {
		constructor(loc, opSuperClass, // Opt[Val]
		opComment, opDo, // Opt[ClassDo],
		statics, // Array[MethodImplLike]
		opConstructor, // Opt[Constructor]
		methods) {
			// Array[MethodImplLike]
			super(loc);
			this.opSuperClass = opSuperClass;
			this.opComment = opComment;
			this.opDo = opDo;
			this.statics = statics;
			this.opConstructor = opConstructor;
			this.methods = methods;
		}
	}

	exports.Class = Class;

	class Constructor extends MsAst {
		constructor(loc, fun, /* Fun*/memberArgs /* Array[LocalDeclare] */) {
			super(loc);
			this.fun = fun;
			this.memberArgs = memberArgs;
		}
	}

	exports.Constructor = Constructor;

	class MethodImplLike extends MsAst {
		constructor(loc, symbol /* Union[String Val] */) {
			super(loc);
			this.symbol = symbol;
		}
	}

	exports.MethodImplLike = MethodImplLike;

	class MethodImpl extends MethodImplLike {
		constructor(loc, symbol, fun /* Fun */) {
			super(loc, symbol);
			this.fun = fun;
		}
	}

	exports.MethodImpl = MethodImpl;

	class MethodGetter extends MethodImplLike {
		constructor(loc, symbol, block /* BlockVal */) {
			super(loc, symbol);
			this.block = block;
			this.declareThis = new LocalDeclareThis(loc);
		}
	}

	exports.MethodGetter = MethodGetter;

	class MethodSetter extends MethodImplLike {
		constructor(loc, symbol, block /* BlockDo */) {
			super(loc, symbol);
			this.block = block;
			this.declareThis = new LocalDeclareThis(loc);
			this.declareFocus = new LocalDeclareFocus(loc);
		}
	}

	exports.MethodSetter = MethodSetter;

	class ClassDo extends MsAst {
		constructor(loc, declareFocus, /* LocalDeclareFocus */block /* BlockDo */) {
			super(loc);
			this.declareFocus = declareFocus;
			this.block = block;
		}
	}

	exports.ClassDo = ClassDo;

	class SuperCall extends Val {
		constructor(loc, args /* Array[Union[Val Splat]] */) {
			super(loc);
			this.args = args;
		}
	}

	exports.SuperCall = SuperCall;

	class SuperCallDo extends Do {
		constructor(loc, args /* Array[Union[Val Splat]] */) {
			super(loc);
			this.args = args;
		}
	}

	exports.SuperCallDo = SuperCallDo;

	class SuperMember extends Val {
		constructor(loc, name /* String */) {
			super(loc);
			this.name = name;
		}
	}

	// Calls
	exports.SuperMember = SuperMember;

	class Call extends Val {
		static contains(loc, testType, tested) {
			return new Call(loc, new SpecialVal(loc, SV_Contains), [testType, tested]);
		}

		static sub(loc, args) {
			return new Call(loc, new SpecialVal(loc, SV_Sub), args);
		}

		constructor(loc, called, /* Val */args /* Array[Union[Val Splat]] */) {
			super(loc);
			this.called = called;
			this.args = args;
		}
	}

	exports.Call = Call;

	class New extends Val {
		constructor(loc, type, /* Val */args /* Union[Val Splat] */) {
			super(loc);
			this.type = type;
			this.args = args;
		}
	}

	exports.New = New;

	class Splat extends MsAst {
		constructor(loc, splatted /* Val */) {
			super(loc);
			this.splatted = splatted;
		}
	}

	exports.Splat = Splat;

	class Lazy extends Val {
		constructor(loc, value /* Val */) {
			super(loc);
			this.value = value;
		}
	}

	// Case
	exports.Lazy = Lazy;

	class CaseDo extends Do {
		constructor(loc, opCased, // Opt[AssignSingle]
		parts, // Array[CaseDoPart]
		opElse) {
			// Opt[BlockDo]
			super(loc);
			this.opCased = opCased;
			this.parts = parts;
			this.opElse = opElse;
		}
	}

	exports.CaseDo = CaseDo;

	class CaseVal extends Val {
		constructor(loc, opCased, // Opt[AssignSingle]
		parts, // Array[CaseValPart]
		opElse) {
			// Opt[BlockVal]
			super(loc);
			this.opCased = opCased;
			this.parts = parts;
			this.opElse = opElse;
		}
	}

	exports.CaseVal = CaseVal;

	class CaseDoPart extends MsAst {
		constructor(loc, test, /* Union[Val Pattern] */result /* BlockDo */) {
			super(loc);
			this.test = test;
			this.result = result;
		}
	}

	exports.CaseDoPart = CaseDoPart;

	class CaseValPart extends MsAst {
		constructor(loc, test, /* Union[Val Pattern] */result /* BlockVal */) {
			super(loc);
			this.test = test;
			this.result = result;
		}
	}

	exports.CaseValPart = CaseValPart;

	class Pattern extends MsAst {
		constructor(loc, type, // Val
		locals, // Array[LocalDeclare]
		patterned) {
			// LocalAccess
			super(loc);
			this.type = type;
			this.locals = locals;
			this.patterned = patterned;
		}
	}

	// Switch
	exports.Pattern = Pattern;

	class SwitchDo extends Do {
		constructor(loc, switched, // Val
		parts, // Array[SwitchDoPart]
		opElse) {
			// Opt[BlockDo]
			super(loc);
			this.switched = switched;
			this.parts = parts;
			this.opElse = opElse;
		}
	}

	exports.SwitchDo = SwitchDo;

	class SwitchVal extends Val {
		constructor(loc, switched, // Val
		parts, // Array[SwitchValPart]
		opElse) {
			// Opt[BlockVal]
			super(loc);
			this.switched = switched;
			this.parts = parts;
			this.opElse = opElse;
		}
	}

	exports.SwitchVal = SwitchVal;

	class SwitchDoPart extends MsAst {
		constructor(loc, values, /* Array[Val] */result /* BlockDo */) {
			super(loc);
			this.values = values;
			this.result = result;
		}
	}

	exports.SwitchDoPart = SwitchDoPart;

	class SwitchValPart extends MsAst {
		constructor(loc, values, /* Array[Val] */result /* BlockVal */) {
			super(loc);
			this.values = values;
			this.result = result;
		}
	}

	// For
	exports.SwitchValPart = SwitchValPart;

	class ForDo extends Do {
		constructor(loc, opIteratee, /* Opt[Iteratee] */block /* BlockDo */) {
			super(loc);
			this.opIteratee = opIteratee;
			this.block = block;
		}
	}

	exports.ForDo = ForDo;

	class ForVal extends Val {
		constructor(loc, opIteratee, /* Opt[Iteratee] */block /* BlockDo */) {
			super(loc);
			this.opIteratee = opIteratee;
			this.block = block;
		}
	}

	exports.ForVal = ForVal;

	class ForBag extends Val {
		static of(loc, opIteratee, block) {
			return new ForBag(loc, new LocalDeclareBuilt(loc), opIteratee, block);
		}

		constructor(loc, built, // LocalDeclareBuilt
		opIteratee, // Opt[Iteratee]
		block) {
			// BlockDo
			super(loc);
			this.built = built;
			this.opIteratee = opIteratee;
			this.block = block;
		}
	}

	exports.ForBag = ForBag;

	class Iteratee extends MsAst {
		constructor(loc, element, /* LocalDeclare */bag /* Val */) {
			super(loc);
			this.element = element;
			this.bag = bag;
		}
	}

	exports.Iteratee = Iteratee;

	class Break extends Do {}

	exports.Break = Break;

	class BreakWithVal extends Do {
		constructor(loc, value) {
			super(loc);
			this.value = value;
		}
	}

	// Misc Vals
	exports.BreakWithVal = BreakWithVal;

	class BlockWrap extends Val {
		constructor(loc, block /* BlockVal */) {
			super(loc);
			this.block = block;
		}
	}

	exports.BlockWrap = BlockWrap;

	class BagSimple extends Val {
		constructor(loc, parts /* Array[Val] */) {
			super(loc);
			this.parts = parts;
		}
	}

	exports.BagSimple = BagSimple;

	class ObjSimple extends Val {
		constructor(loc, pairs /* Array[ObjPair] */) {
			super(loc);
			this.pairs = pairs;
		}
	}

	exports.ObjSimple = ObjSimple;

	class ObjPair extends MsAst {
		constructor(loc, key, /* String */value /* Val */) {
			super(loc);
			this.key = key;
			this.value = value;
		}
	}

	exports.ObjPair = ObjPair;
	const L_And = 0,
	      L_Or = 1;
	exports.L_And = L_And;
	exports.L_Or = L_Or;

	class Logic extends Val {
		constructor(loc, kind, /* Number */args /* Array[Val] */) {
			super(loc);
			this.kind = kind;
			this.args = args;
		}
	}

	exports.Logic = Logic;

	class Not extends Val {
		constructor(loc, arg /* Val */) {
			super(loc);
			this.arg = arg;
		}
	}

	// This is both a Token and MsAst.
	// Store the value as a String so we can distinguish `0xf` from `15`.
	exports.Not = Not;

	class NumberLiteral extends Val {
		constructor(loc, value /* String */) {
			super(loc);
			this.value = value;
		}

		// Tokens need toString.
		toString() {
			return this.value.toString();
		}
	}

	exports.NumberLiteral = NumberLiteral;

	class Member extends Val {
		constructor(loc, object, /* Val */name /* String */) {
			super(loc);
			this.object = object;
			this.name = name;
		}
	}

	exports.Member = Member;

	class Quote extends Val {
		static forString(loc, str) {
			return new Quote(loc, [str]);
		}

		// parts are Strings interleaved with Vals.
		// part Strings are raw values, meaning "\n" is two characters.
		// Since "\{" is special to Mason, that's only one character.
		constructor(loc, parts /* Array[Union[String Val]] */) {
			super(loc);
			this.parts = parts;
		}
	}

	exports.Quote = Quote;

	class QuoteTemplate extends Val {
		constructor(loc, tag, /* Val */quote /* Quote */) {
			super(loc);
			this.tag = tag;
			this.quote = quote;
		}
	}

	exports.QuoteTemplate = QuoteTemplate;

	class With extends Val {
		constructor(loc, declare, /* LocalDeclare */value, /* Val */block /* BlockDo */) {
			super(loc);
			this.declare = declare;
			this.value = value;
			this.block = block;
		}
	}

	// Special
	exports.With = With;
	const SD_Debugger = 0;
	exports.SD_Debugger = SD_Debugger;

	class SpecialDo extends Do {
		constructor(loc, kind /* Number */) {
			super(loc);
			this.kind = kind;
		}
	}

	exports.SpecialDo = SpecialDo;
	const SV_Contains = 0,
	      SV_False = 1,
	      SV_Null = 2,
	      SV_Sub = 3,
	      SV_True = 4,
	      SV_Undefined = 5,
	      SV_Name = 6;
	exports.SV_Contains = SV_Contains;
	exports.SV_False = SV_False;
	exports.SV_Null = SV_Null;
	exports.SV_Sub = SV_Sub;
	exports.SV_True = SV_True;
	exports.SV_Undefined = SV_Undefined;
	exports.SV_Name = SV_Name;

	class SpecialVal extends Val {
		constructor(loc, kind /* Number */) {
			super(loc);
			this.kind = kind;
		}
	}

	exports.SpecialVal = SpecialVal;

	class Ignore extends Do {
		constructor(loc, ignored /* Array[String] */) {
			super(loc);
			this.ignored = ignored;
		}
	}

	exports.Ignore = Ignore;
});
// Block
// Opt[Debug]
// Opt[LocalDeclareRes]
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1zQXN0LmpzIiwicHJpdmF0ZS9Nc0FzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FlLE9BQU0sS0FBSyxDQUFDO0FBQzFCLGFBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDaEIsT0FBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7R0FDZDs7QUFFRCxVQUFRLEdBQUc7QUFDVixTQUFNLE9BQU8sR0FBRyxDQUFDLElBQ2hCLENBQUMsS0FBSyxJQUFJLEdBQ1QsTUFBTSxHQUNOLENBQUMsS0FBSyxTQUFTLEdBQ2YsV0FBVyxHQUNYLENBQUMsWUFBWSxLQUFLLEdBQ2xCLENBQUMsS0FBSyxHQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLENBQUMsR0FDM0QsT0FBTyxDQUFDLEtBQUssUUFBUSxHQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUNqQixDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7O0FBRWQsU0FBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBOztBQUVoRCxTQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQTtBQUNsQyxTQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQ3RDLE1BQU0sR0FBRyxDQUFDLEdBQUUsR0FBRyxFQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUM1RCxVQUFPLENBQUMsR0FBRSxJQUFJLEVBQUMsQ0FBQyxHQUFFLEtB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LElBQUksZUFBZTtBQUNuQyxRQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDVixPQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtHQUNoQjtFQUNEOzs7O0FBRU0sT0FBTSxNQUFNLFNBQVMsRUFBRSxDQUFDO0FBQzlCLGFBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxzQkFBc0I7QUFDN0MsUUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ1YsT0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7R0FDdEI7RUFDRCIsImZpbGUiOiJwcml2YXRlL01zQXN0LmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNc0FzdCB7XG5cdGNvbnN0cnVjdG9yKGxvYykge1xuXHRcdHRoaXMubG9jID0gbG9jXG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHRjb25zdCBpbnNwZWN0ID0gXyA9PlxuXHRcdFx0XyA9PT0gbnVsbCA/XG5cdFx0XHRcdCdudWxsJyA6XG5cdFx0XHRcdF8gPT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdCd1bmRlZmluZWQnIDpcblx0XHRcdFx0XyBpbnN0YW5jZW9mIEFycmF5ID9cblx0XHRcdFx0YFtcXG5cXHQke18ubWFwKF8gPT4gaW5kZW50KF8udG9TdHJpbmcoKSkpLmpvaW4oJyxcXG5cXHQnKX1cXG5dYCA6XG5cdFx0XHRcdHR5cGVvZiBfID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KF8pIDpcblx0XHRcdFx0Xy50b1N0cmluZygpXG5cblx0XHRjb25zdCBpbmRlbnQgPSBzdHIgPT4gc3RyLnJlcGxhY2UoL1xcbi9nLCAnXFxuXFx0JylcblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWVcblx0XHRjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKHRoaXMpLm1hcChrZXkgPT5cblx0XHRcdCdcXG5cXHQnICsgYCR7a2V5fTogYCArIGluZGVudChpbnNwZWN0KHRoaXNba2V5XSkpKS5qb2luKCcsJylcblx0XHRyZXR1cm4gYCR7dHlwZX0oJHtwcm9wc30pYFxuXHR9XG59XG5cbi8vIExpbmVDb250ZW50XG5cdC8vIFZhbGlkIHBhcnQgb2YgYSBCbG9jay5cblx0ZXhwb3J0IGNsYXNzIExpbmVDb250ZW50IGV4dGVuZHMgTXNBc3QgeyB9XG5cblx0Ly8gVGhlc2UgY2FuIG9ubHkgYXBwZWFyIGFzIGxpbmVzIGluIGEgQmxvY2suXG5cdGV4cG9ydCBjbGFzcyBEbyBleHRlbmRzIExpbmVDb250ZW50IHsgfVxuXG5cdC8vIFRoZXNlIGNhbiBhcHBlYXIgaW4gYW55IGV4cHJlc3Npb24uXG5cdGV4cG9ydCBjbGFzcyBWYWwgZXh0ZW5kcyBMaW5lQ29udGVudCB7IH1cblxuLy8gTW9kdWxlXG5cdGV4cG9ydCBjbGFzcyBNb2R1bGUgZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLFxuXHRcdFx0b3BDb21tZW50LCAvLyBPcHRbU3RyaW5nXVxuXHRcdFx0ZG9JbXBvcnRzLCAvLyBBcnJheVtJbXBvcnREb11cblx0XHRcdGltcG9ydHMsIC8vIEFycmF5W0ltcG9ydF1cblx0XHRcdG9wSW1wb3J0R2xvYmFsLCAvLyBOdWxsYWJsZVtJbXBvcnRHbG9iYWxdXG5cdFx0XHRkZWJ1Z0ltcG9ydHMsIC8vIEFycmF5W0ltcG9ydF1cblx0XHRcdGxpbmVzKSB7IC8vIEFycmF5W0RvXVxuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5vcENvbW1lbnQgPSBvcENvbW1lbnRcblx0XHRcdHRoaXMuZG9JbXBvcnRzID0gZG9JbXBvcnRzXG5cdFx0XHR0aGlzLmltcG9ydHMgPSBpbXBvcnRzXG5cdFx0XHR0aGlzLm9wSW1wb3J0R2xvYmFsID0gb3BJbXBvcnRHbG9iYWxcblx0XHRcdHRoaXMuZGVidWdJbXBvcnRzID0gZGVidWdJbXBvcnRzXG5cdFx0XHR0aGlzLmxpbmVzID0gbGluZXNcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTW9kdWxlRXhwb3J0IGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgYXNzaWduIC8qIEFzc2lnblNpbmdsZSAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5hc3NpZ24gPSBhc3NpZ25cblx0XHR9XG5cdH1cblx0ZXhwb3J0IGNsYXNzIE1vZHVsZUV4cG9ydE5hbWVkIGV4dGVuZHMgTW9kdWxlRXhwb3J0IHsgfVxuXHRleHBvcnQgY2xhc3MgTW9kdWxlRXhwb3J0RGVmYXVsdCBleHRlbmRzIE1vZHVsZUV4cG9ydCB7IH1cblxuXHRleHBvcnQgY2xhc3MgSW1wb3J0RG8gZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBwYXRoIC8qIFN0cmluZyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5wYXRoID0gcGF0aFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLFxuXHRcdFx0cGF0aCwgLy8gU3RyaW5nXG5cdFx0XHRpbXBvcnRlZCwgLy8gQXJyYXlbTG9jYWxEZWNsYXJlXVxuXHRcdFx0b3BJbXBvcnREZWZhdWx0KSB7IC8vIE9wdFtMb2NhbERlY2xhcmVdXG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnBhdGggPSBwYXRoXG5cdFx0XHR0aGlzLmltcG9ydGVkID0gaW1wb3J0ZWRcblx0XHRcdHRoaXMub3BJbXBvcnREZWZhdWx0ID0gb3BJbXBvcnREZWZhdWx0XG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEltcG9ydEdsb2JhbCBleHRlbmRzIE1zQXN0IHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsXG5cdFx0XHRpbXBvcnRlZCwgLy8gQXJyYXlbTG9jYWxEZWNsYXJlXVxuXHRcdFx0b3BJbXBvcnREZWZhdWx0KSB7IC8qIE9wdFtMb2NhbERlY2xhcmVdICovXG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmltcG9ydGVkID0gaW1wb3J0ZWRcblx0XHRcdHRoaXMub3BJbXBvcnREZWZhdWx0ID0gb3BJbXBvcnREZWZhdWx0XG5cdFx0fVxuXHR9XG5cbi8vIExvY2Fsc1xuXHRleHBvcnQgY29uc3Rcblx0XHRMRF9Db25zdCA9IDAsXG5cdFx0TERfTGF6eSA9IDEsXG5cdFx0TERfTXV0YWJsZSA9IDJcblx0ZXhwb3J0IGNsYXNzIExvY2FsRGVjbGFyZSBleHRlbmRzIE1zQXN0IHtcblx0XHRzdGF0aWMgdW50eXBlZChsb2MsIG5hbWUsIGtpbmQpIHtcblx0XHRcdHJldHVybiBuZXcgTG9jYWxEZWNsYXJlKGxvYywgbmFtZSwgbnVsbCwga2luZClcblx0XHR9XG5cblx0XHRzdGF0aWMgcGxhaW4obG9jLCBuYW1lKSB7XG5cdFx0XHRyZXR1cm4gbmV3IExvY2FsRGVjbGFyZShsb2MsIG5hbWUsIG51bGwsIExEX0NvbnN0KVxuXHRcdH1cblxuXHRcdGNvbnN0cnVjdG9yKGxvYywgbmFtZSAvKiBTdHJpbmcgKi8sIG9wVHlwZSAvKiBPcHRbVmFsXSAqLywga2luZCAvKiBOdW1iZXIgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMubmFtZSA9IG5hbWVcblx0XHRcdHRoaXMub3BUeXBlID0gb3BUeXBlXG5cdFx0XHR0aGlzLmtpbmQgPSBraW5kXG5cdFx0fVxuXG5cdFx0aXNMYXp5KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMua2luZCA9PT0gTERfTGF6eVxuXHRcdH1cblxuXHRcdGlzTXV0YWJsZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLmtpbmQgPT09IExEX011dGFibGVcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTG9jYWxEZWNsYXJlQnVpbHQgZXh0ZW5kcyBMb2NhbERlY2xhcmUge1xuXHRcdGNvbnN0cnVjdG9yKGxvYykge1xuXHRcdFx0c3VwZXIobG9jLCAnYnVpbHQnLCBudWxsLCBMRF9Db25zdClcblx0XHR9XG5cdH1cblx0ZXhwb3J0IGNsYXNzIExvY2FsRGVjbGFyZUZvY3VzIGV4dGVuZHMgTG9jYWxEZWNsYXJlIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MpIHtcblx0XHRcdHN1cGVyKGxvYywgJ18nLCBudWxsLCBMRF9Db25zdClcblx0XHR9XG5cdH1cblx0ZXhwb3J0IGNsYXNzIExvY2FsRGVjbGFyZU5hbWUgZXh0ZW5kcyBMb2NhbERlY2xhcmUge1xuXHRcdGNvbnN0cnVjdG9yKGxvYykge1xuXHRcdFx0c3VwZXIobG9jLCAnbmFtZScsIG51bGwsIExEX0NvbnN0KVxuXHRcdH1cblx0fVxuXHRleHBvcnQgY2xhc3MgTG9jYWxEZWNsYXJlVGhpcyBleHRlbmRzIExvY2FsRGVjbGFyZSB7XG5cdFx0Y29uc3RydWN0b3IobG9jKSB7XG5cdFx0XHRzdXBlcihsb2MsICd0aGlzJywgbnVsbCwgTERfQ29uc3QpXG5cdFx0fVxuXHR9XG5cdGV4cG9ydCBjbGFzcyBMb2NhbERlY2xhcmVSZXMgZXh0ZW5kcyBMb2NhbERlY2xhcmUge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgb3BUeXBlKSB7XG5cdFx0XHRzdXBlcihsb2MsICdyZXMnLCBvcFR5cGUsIExEX0NvbnN0KVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBMb2NhbEFjY2VzcyBleHRlbmRzIFZhbCB7XG5cdFx0c3RhdGljIGZvY3VzKGxvYykge1xuXHRcdFx0cmV0dXJuIG5ldyBMb2NhbEFjY2Vzcyhsb2MsICdfJylcblx0XHR9XG5cblx0XHRzdGF0aWMgdGhpcyhsb2MpIHtcblx0XHRcdHJldHVybiBuZXcgTG9jYWxBY2Nlc3MobG9jLCAndGhpcycpXG5cdFx0fVxuXG5cdFx0Y29uc3RydWN0b3IobG9jLCBuYW1lIC8qIFN0cmluZyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5uYW1lID0gbmFtZVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBMb2NhbE11dGF0ZSBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG5hbWUgLyogU3RyaW5nICovLCB2YWx1ZSAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMubmFtZSA9IG5hbWVcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZVxuXHRcdH1cblx0fVxuXG4vLyBBc3NpZ25cblx0ZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIERvIHsgfVxuXG5cdGV4cG9ydCBjbGFzcyBBc3NpZ25TaW5nbGUgZXh0ZW5kcyBBc3NpZ24ge1xuXHRcdHN0YXRpYyBmb2N1cyhsb2MsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEFzc2lnblNpbmdsZShsb2MsIG5ldyBMb2NhbERlY2xhcmVGb2N1cyhsb2MpLCB2YWx1ZSlcblx0XHR9XG5cblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGFzc2lnbmVlIC8qIExvY2FsRGVjbGFyZSAqLywgdmFsdWUgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmFzc2lnbmVlID0gYXNzaWduZWVcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZVxuXHRcdH1cblxuXHRcdGFsbEFzc2lnbmVlcygpIHsgcmV0dXJuIFt0aGlzLmFzc2lnbmVlXSB9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQXNzaWduRGVzdHJ1Y3R1cmUgZXh0ZW5kcyBBc3NpZ24ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgYXNzaWduZWVzIC8qIEFycmF5W0xvY2FsRGVjbGFyZV0gKi8sIHZhbHVlIC8qIFZhbCAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5hc3NpZ25lZXMgPSBhc3NpZ25lZXNcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZVxuXHRcdH1cblxuXHRcdGFsbEFzc2lnbmVlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmFzc2lnbmVlc1xuXHRcdH1cblxuXHRcdGtpbmQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hc3NpZ25lZXNbMF0ua2luZFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjb25zdFxuXHRcdE1TX05ldyA9IDAsXG5cdFx0TVNfTXV0YXRlID0gMSxcblx0XHRNU19OZXdNdXRhYmxlID0gMlxuXHRleHBvcnQgY2xhc3MgTWVtYmVyU2V0IGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgb2JqZWN0IC8qIFZhbCAqLywgbmFtZSAvKiBTdHJpbmcgKi8sIGtpbmQgLyogTnVtYmVyICovLCB2YWx1ZSAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMub2JqZWN0ID0gb2JqZWN0XG5cdFx0XHR0aGlzLm5hbWUgPSBuYW1lXG5cdFx0XHR0aGlzLmtpbmQgPSBraW5kXG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuLy8gRXJyb3JzXG5cdGV4cG9ydCBjbGFzcyBUaHJvdyBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9wVGhyb3duLyogT3B0W1ZhbF0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMub3BUaHJvd24gPSBvcFRocm93blxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBBc3NlcnQgZXh0ZW5kcyBEbyB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBuZWdhdGUgLyogQm9vbGVhbiAqLywgY29uZGl0aW9uIC8qIFZhbCAqLywgb3BUaHJvd24gLyogT3B0W1ZhbF0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMubmVnYXRlID0gbmVnYXRlXG5cdFx0XHQvLyBjb25kaXRpb24gdHJlYXRlZCBzcGVjaWFsbHkgaWYgYSBDYWxsLlxuXHRcdFx0dGhpcy5jb25kaXRpb24gPSBjb25kaXRpb25cblx0XHRcdHRoaXMub3BUaHJvd24gPSBvcFRocm93blxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBFeGNlcHREbyBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIF90cnkgLyogQmxvY2tEbyAqLywgX2NhdGNoIC8qIE9wdFtDYXRjaF0gKi8sIF9maW5hbGx5IC8qIE9wdFtCbG9ja0RvXSAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5fdHJ5ID0gX3RyeVxuXHRcdFx0dGhpcy5fY2F0Y2ggPSBfY2F0Y2hcblx0XHRcdHRoaXMuX2ZpbmFsbHkgPSBfZmluYWxseVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBFeGNlcHRWYWwgZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYyxcblx0XHRcdF90cnksIC8vIEJsb2NrVmFsXG5cdFx0XHRfY2F0Y2gsIC8vIE9wdFtDYXRjaF1cblx0XHRcdF9maW5hbGx5KSB7IC8vIE9wdFtCbG9ja0RvXVxuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5fdHJ5ID0gX3RyeVxuXHRcdFx0dGhpcy5fY2F0Y2ggPSBfY2F0Y2hcblx0XHRcdHRoaXMuX2ZpbmFsbHkgPSBfZmluYWxseVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBDYXRjaCBleHRlbmRzIE1zQXN0IHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGNhdWdodCAvKiBMb2NhbERlY2xhcmUgKi8sIGJsb2NrIC8qIEJsb2NrRG8vQmxvY2tWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuY2F1Z2h0ID0gY2F1Z2h0XG5cdFx0XHR0aGlzLmJsb2NrID0gYmxvY2tcblx0XHR9XG5cdH1cblxuLy8gRGVidWdcblx0ZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgbGluZXMgLyogQXJyYXlbTGluZUNvbnRlbnRdICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmxpbmVzID0gbGluZXNcblx0XHR9XG5cdH1cblxuLy8gQmxvY2tcblx0ZXhwb3J0IGNsYXNzIEJsb2NrIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgb3BDb21tZW50IC8qIE9wdFtTdHJpbmddICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLm9wQ29tbWVudCA9IG9wQ29tbWVudFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBCbG9ja0RvIGV4dGVuZHMgQmxvY2sge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgb3BDb21tZW50LCBsaW5lcyAvKiBBcnJheVtMaW5lQ29udGVudF0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYywgb3BDb21tZW50KVxuXHRcdFx0dGhpcy5saW5lcyA9IGxpbmVzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEJsb2NrVmFsIGV4dGVuZHMgQmxvY2sgeyB9XG5cblx0ZXhwb3J0IGNsYXNzIEJsb2NrV2l0aFJldHVybiBleHRlbmRzIEJsb2NrVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9wQ29tbWVudCwgbGluZXMgLyogQXJyYXlbTGluZUNvbnRlbnRdICovLCByZXR1cm5lZCAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYywgb3BDb21tZW50KVxuXHRcdFx0dGhpcy5saW5lcyA9IGxpbmVzXG5cdFx0XHR0aGlzLnJldHVybmVkID0gcmV0dXJuZWRcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQmxvY2tWYWxUaHJvdyBleHRlbmRzIEJsb2NrVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9wQ29tbWVudCwgbGluZXMgLyogQXJyYXlbTGluZUNvbnRlbnRdICovLCBfdGhyb3cgLyogVGhyb3cgKi8pIHtcblx0XHRcdHN1cGVyKGxvYywgb3BDb21tZW50KVxuXHRcdFx0dGhpcy5saW5lcyA9IGxpbmVzXG5cdFx0XHR0aGlzLnRocm93ID0gX3Rocm93XG5cdFx0fVxuXHR9XG5cblx0Ly8gVE9ETzogQmxvY2tCYWcsIEJsb2NrTWFwLCBCbG9ja09iaiA9PiBCbG9ja0J1aWxkKGtpbmQsIC4uLilcblx0ZXhwb3J0IGNsYXNzIEJsb2NrT2JqIGV4dGVuZHMgQmxvY2tWYWwge1xuXHRcdHN0YXRpYyBvZihsb2MsIG9wQ29tbWVudCwgbGluZXMsIG9wT2JqZWQ9bnVsbCwgb3BOYW1lPW51bGwpIHtcblx0XHRcdHJldHVybiBuZXcgQmxvY2tPYmoobG9jLCBvcENvbW1lbnQsIG5ldyBMb2NhbERlY2xhcmVCdWlsdChsb2MpLCBsaW5lcywgb3BPYmplZCwgb3BOYW1lKVxuXHRcdH1cblxuXHRcdGNvbnN0cnVjdG9yKFxuXHRcdFx0bG9jLFxuXHRcdFx0b3BDb21tZW50LFxuXHRcdFx0YnVpbHQsIC8vIExvY2FsRGVjbGFyZUJ1aWx0XG5cdFx0XHRsaW5lcywgLy8gQXJyYXlbVW5pb25bTGluZUNvbnRlbnQgT2JqRW50cnldXVxuXHRcdFx0b3BPYmplZCwgLy8gT3B0W1ZhbF1cblx0XHRcdG9wTmFtZSkgeyAvLyBPcHRbU3RyaW5nXVxuXHRcdFx0c3VwZXIobG9jLCBvcENvbW1lbnQpXG5cdFx0XHR0aGlzLmJ1aWx0ID0gYnVpbHRcblx0XHRcdHRoaXMubGluZXMgPSBsaW5lc1xuXHRcdFx0dGhpcy5vcE9iamVkID0gb3BPYmplZFxuXHRcdFx0dGhpcy5vcE5hbWUgPSBvcE5hbWVcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgT2JqRW50cnkgZXh0ZW5kcyBEbyB7XG5cdFx0Y29uc3RydWN0b3IobG9jKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLm9wQ29tbWVudCA9IG51bGxcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgT2JqRW50cnlBc3NpZ24gZXh0ZW5kcyBPYmpFbnRyeSB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBhc3NpZ24gLyogQXNzaWduICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmFzc2lnbiA9IGFzc2lnblxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBPYmpFbnRyeUNvbXB1dGVkIGV4dGVuZHMgT2JqRW50cnkge1xuXHRcdHN0YXRpYyBuYW1lKGxvYywgdmFsdWUpIHtcblx0XHRcdHJldHVybiBuZXcgT2JqRW50cnlDb21wdXRlZChsb2MsIFF1b3RlLmZvclN0cmluZyhsb2MsICduYW1lJyksIHZhbHVlKVxuXHRcdH1cblxuXHRcdGNvbnN0cnVjdG9yKGxvYywga2V5IC8qIFZhbCAqLywgdmFsdWUgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmtleSA9IGtleVxuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEJsb2NrQmFnIGV4dGVuZHMgQmxvY2tWYWwge1xuXHRcdHN0YXRpYyBvZihsb2MsIG9wQ29tbWVudCwgbGluZXMpIHtcblx0XHRcdHJldHVybiBuZXcgQmxvY2tCYWcobG9jLCBvcENvbW1lbnQsIG5ldyBMb2NhbERlY2xhcmVCdWlsdChsb2MpLCBsaW5lcylcblx0XHR9XG5cblx0XHRjb25zdHJ1Y3Rvcihcblx0XHRcdGxvYyxcblx0XHRcdG9wQ29tbWVudCxcblx0XHRcdGJ1aWx0LCAvLyBMb2NhbERlY2xhcmVCdWlsdFxuXHRcdFx0bGluZXMpIHsgLy8gVW5pb25bTGluZUNvbnRlbnQgQmFnRW50cnldXG5cdFx0XHRzdXBlcihsb2MsIG9wQ29tbWVudClcblx0XHRcdHRoaXMuYnVpbHQgPSBidWlsdFxuXHRcdFx0dGhpcy5saW5lcyA9IGxpbmVzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEJhZ0VudHJ5IGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgdmFsdWUgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQmFnRW50cnlNYW55IGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgdmFsdWUgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQmxvY2tNYXAgZXh0ZW5kcyBCbG9ja1ZhbCB7XG5cdFx0c3RhdGljIG9mKGxvYywgb3BDb21tZW50LCBsaW5lcykge1xuXHRcdFx0cmV0dXJuIG5ldyBCbG9ja01hcChsb2MsIG9wQ29tbWVudCwgbmV3IExvY2FsRGVjbGFyZUJ1aWx0KGxvYyksIGxpbmVzKVxuXHRcdH1cblxuXHRcdGNvbnN0cnVjdG9yKFxuXHRcdFx0bG9jLFxuXHRcdFx0b3BDb21tZW50LFxuXHRcdFx0YnVpbHQsIC8vIExvY2FsRGVjbGFyZUJ1aWx0XG5cdFx0XHRsaW5lcykgeyAvLyBVbmlvbltMaW5lQ29udGVudCBNYXBFbnRyeV1cblx0XHRcdHN1cGVyKGxvYywgb3BDb21tZW50KVxuXHRcdFx0dGhpcy5idWlsdCA9IGJ1aWx0XG5cdFx0XHR0aGlzLmxpbmVzID0gbGluZXNcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTWFwRW50cnkgZXh0ZW5kcyBEbyB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBrZXkgLyogVmFsICovLCB2YWwgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmtleSA9IGtleVxuXHRcdFx0dGhpcy52YWwgPSB2YWxcblx0XHR9XG5cdH1cblxuLy8gQ29uZGl0aW9uYWxzXG5cdGV4cG9ydCBjbGFzcyBDb25kaXRpb25hbERvIGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgdGVzdCAvKiBWYWwgKi8sIHJlc3VsdCAvKiBCbG9ja0RvICovLCBpc1VubGVzcyAvKiBCb29sZWFuICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnRlc3QgPSB0ZXN0XG5cdFx0XHR0aGlzLnJlc3VsdCA9IHJlc3VsdFxuXHRcdFx0dGhpcy5pc1VubGVzcyA9IGlzVW5sZXNzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIENvbmRpdGlvbmFsVmFsIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHRlc3QgLyogVmFsICovLCByZXN1bHQgLyogQmxvY2tWYWwgKi8sIGlzVW5sZXNzIC8qIEJvb2xlYW4gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMudGVzdCA9IHRlc3Rcblx0XHRcdHRoaXMucmVzdWx0ID0gcmVzdWx0XG5cdFx0XHR0aGlzLmlzVW5sZXNzID0gaXNVbmxlc3Ncblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQ29uZCBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCB0ZXN0IC8qIFZhbCAqLywgaWZUcnVlIC8qIFZhbCAqLywgaWZGYWxzZSAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMudGVzdCA9IHRlc3Rcblx0XHRcdHRoaXMuaWZUcnVlID0gaWZUcnVlXG5cdFx0XHR0aGlzLmlmRmFsc2UgPSBpZkZhbHNlXG5cdFx0fVxuXHR9XG5cbi8vIEZ1blxuXHRleHBvcnQgY2xhc3MgRnVuIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsXG5cdFx0XHRvcERlY2xhcmVUaGlzLCAvLyBPcHRbTG9jYWxEZWNsYXJlVGhpc11cblx0XHRcdGlzR2VuZXJhdG9yLCAvLyBCb29sZWFuXG5cdFx0XHRhcmdzLCAvLyBBcnJheVtMb2NhbERlY2xhcmVdXG5cdFx0XHRvcFJlc3RBcmcsIC8vIE9wdFtMb2NhbERlY2xhcmVdXG5cdFx0XHRibG9jaywgLy8gQmxvY2tcblx0XHRcdG9wSW49bnVsbCwgLy8gT3B0W0RlYnVnXVxuXHRcdFx0b3BEZWNsYXJlUmVzPW51bGwsIC8vIE9wdFtMb2NhbERlY2xhcmVSZXNdXG5cdFx0XHRvcE91dD1udWxsKSB7IC8vIE9wdFtEZWJ1Z10pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMub3BEZWNsYXJlVGhpcyA9IG9wRGVjbGFyZVRoaXNcblx0XHRcdHRoaXMuaXNHZW5lcmF0b3IgPSBpc0dlbmVyYXRvclxuXHRcdFx0dGhpcy5hcmdzID0gYXJnc1xuXHRcdFx0dGhpcy5vcFJlc3RBcmcgPSBvcFJlc3RBcmdcblx0XHRcdHRoaXMuYmxvY2sgPSBibG9ja1xuXHRcdFx0dGhpcy5vcEluID0gb3BJblxuXHRcdFx0dGhpcy5vcERlY2xhcmVSZXMgPSBvcERlY2xhcmVSZXNcblx0XHRcdHRoaXMub3BPdXQgPSBvcE91dFxuXHRcdH1cblx0fVxuXG4vLyBHZW5lcmF0b3Jcblx0ZXhwb3J0IGNsYXNzIFlpZWxkIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9wWWllbGRlZD1udWxsIC8qIE9wdFtWYWxdICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLm9wWWllbGRlZCA9IG9wWWllbGRlZFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBZaWVsZFRvIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHlpZWxkZWRUbyAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMueWllbGRlZFRvID0geWllbGRlZFRvXG5cdFx0fVxuXHR9XG5cbi8vIENsYXNzXG5cdGV4cG9ydCBjbGFzcyBDbGFzcyBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLFxuXHRcdFx0b3BTdXBlckNsYXNzLCAvLyBPcHRbVmFsXVxuXHRcdFx0b3BDb21tZW50LFxuXHRcdFx0b3BEbywgLy8gT3B0W0NsYXNzRG9dLFxuXHRcdFx0c3RhdGljcywgLy8gQXJyYXlbTWV0aG9kSW1wbExpa2VdXG5cdFx0XHRvcENvbnN0cnVjdG9yLCAvLyBPcHRbQ29uc3RydWN0b3JdXG5cdFx0XHRtZXRob2RzKSB7IC8vIEFycmF5W01ldGhvZEltcGxMaWtlXVxuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5vcFN1cGVyQ2xhc3MgPSBvcFN1cGVyQ2xhc3Ncblx0XHRcdHRoaXMub3BDb21tZW50ID0gb3BDb21tZW50XG5cdFx0XHR0aGlzLm9wRG8gPSBvcERvXG5cdFx0XHR0aGlzLnN0YXRpY3MgPSBzdGF0aWNzXG5cdFx0XHR0aGlzLm9wQ29uc3RydWN0b3IgPSBvcENvbnN0cnVjdG9yXG5cdFx0XHR0aGlzLm1ldGhvZHMgPSBtZXRob2RzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIENvbnN0cnVjdG9yIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgZnVuIC8qIEZ1biovLCBtZW1iZXJBcmdzIC8qIEFycmF5W0xvY2FsRGVjbGFyZV0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuZnVuID0gZnVuXG5cdFx0XHR0aGlzLm1lbWJlckFyZ3MgPSBtZW1iZXJBcmdzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIE1ldGhvZEltcGxMaWtlIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgc3ltYm9sIC8qIFVuaW9uW1N0cmluZyBWYWxdICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnN5bWJvbCA9IHN5bWJvbFxuXHRcdH1cblx0fVxuXHRleHBvcnQgY2xhc3MgTWV0aG9kSW1wbCBleHRlbmRzIE1ldGhvZEltcGxMaWtlIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHN5bWJvbCwgZnVuIC8qIEZ1biAqLykge1xuXHRcdFx0c3VwZXIobG9jLCBzeW1ib2wpXG5cdFx0XHR0aGlzLmZ1biA9IGZ1blxuXHRcdH1cblx0fVxuXHRleHBvcnQgY2xhc3MgTWV0aG9kR2V0dGVyIGV4dGVuZHMgTWV0aG9kSW1wbExpa2Uge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgc3ltYm9sLCBibG9jayAvKiBCbG9ja1ZhbCAqLykge1xuXHRcdFx0c3VwZXIobG9jLCBzeW1ib2wpXG5cdFx0XHR0aGlzLmJsb2NrID0gYmxvY2tcblx0XHRcdHRoaXMuZGVjbGFyZVRoaXMgPSBuZXcgTG9jYWxEZWNsYXJlVGhpcyhsb2MpXG5cdFx0fVxuXHR9XG5cdGV4cG9ydCBjbGFzcyBNZXRob2RTZXR0ZXIgZXh0ZW5kcyBNZXRob2RJbXBsTGlrZSB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBzeW1ib2wsIGJsb2NrIC8qIEJsb2NrRG8gKi8pIHtcblx0XHRcdHN1cGVyKGxvYywgc3ltYm9sKVxuXHRcdFx0dGhpcy5ibG9jayA9IGJsb2NrXG5cdFx0XHR0aGlzLmRlY2xhcmVUaGlzID0gbmV3IExvY2FsRGVjbGFyZVRoaXMobG9jKVxuXHRcdFx0dGhpcy5kZWNsYXJlRm9jdXMgPSBuZXcgTG9jYWxEZWNsYXJlRm9jdXMobG9jKVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBDbGFzc0RvIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgZGVjbGFyZUZvY3VzIC8qIExvY2FsRGVjbGFyZUZvY3VzICovLCBibG9jayAvKiBCbG9ja0RvICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmRlY2xhcmVGb2N1cyA9IGRlY2xhcmVGb2N1c1xuXHRcdFx0dGhpcy5ibG9jayA9IGJsb2NrXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFN1cGVyQ2FsbCBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBhcmdzIC8qIEFycmF5W1VuaW9uW1ZhbCBTcGxhdF1dICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmFyZ3MgPSBhcmdzXG5cdFx0fVxuXHR9XG5cdGV4cG9ydCBjbGFzcyBTdXBlckNhbGxEbyBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGFyZ3MgLyogQXJyYXlbVW5pb25bVmFsIFNwbGF0XV0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuYXJncyA9IGFyZ3Ncblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgU3VwZXJNZW1iZXIgZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgbmFtZSAvKiBTdHJpbmcgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMubmFtZSA9IG5hbWVcblx0XHR9XG5cdH1cblxuLy8gQ2FsbHNcblx0ZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBWYWwge1xuXHRcdHN0YXRpYyBjb250YWlucyhsb2MsIHRlc3RUeXBlLCB0ZXN0ZWQpIHtcblx0XHRcdHJldHVybiBuZXcgQ2FsbChsb2MsIG5ldyBTcGVjaWFsVmFsKGxvYywgU1ZfQ29udGFpbnMpLCBbdGVzdFR5cGUsIHRlc3RlZF0pXG5cdFx0fVxuXG5cdFx0c3RhdGljIHN1Yihsb2MsIGFyZ3MpIHtcblx0XHRcdHJldHVybiBuZXcgQ2FsbChsb2MsIG5ldyBTcGVjaWFsVmFsKGxvYywgU1ZfU3ViKSwgYXJncylcblx0XHR9XG5cblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGNhbGxlZCAvKiBWYWwgKi8sIGFyZ3MgLyogQXJyYXlbVW5pb25bVmFsIFNwbGF0XV0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuY2FsbGVkID0gY2FsbGVkXG5cdFx0XHR0aGlzLmFyZ3MgPSBhcmdzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCB0eXBlIC8qIFZhbCAqLywgYXJncyAvKiBVbmlvbltWYWwgU3BsYXRdICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnR5cGUgPSB0eXBlXG5cdFx0XHR0aGlzLmFyZ3MgPSBhcmdzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFNwbGF0IGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgc3BsYXR0ZWQgLyogVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnNwbGF0dGVkID0gc3BsYXR0ZWRcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTGF6eSBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCB2YWx1ZSAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZVxuXHRcdH1cblx0fVxuXG4vLyBDYXNlXG5cdGV4cG9ydCBjbGFzcyBDYXNlRG8gZXh0ZW5kcyBEbyB7XG5cdFx0Y29uc3RydWN0b3IobG9jLFxuXHRcdFx0b3BDYXNlZCwgLy8gT3B0W0Fzc2lnblNpbmdsZV1cblx0XHRcdHBhcnRzLCAvLyBBcnJheVtDYXNlRG9QYXJ0XVxuXHRcdFx0b3BFbHNlKSB7IC8vIE9wdFtCbG9ja0RvXVxuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5vcENhc2VkID0gb3BDYXNlZFxuXHRcdFx0dGhpcy5wYXJ0cyA9IHBhcnRzXG5cdFx0XHR0aGlzLm9wRWxzZSA9IG9wRWxzZVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBDYXNlVmFsIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsXG5cdFx0XHRvcENhc2VkLCAvLyBPcHRbQXNzaWduU2luZ2xlXVxuXHRcdFx0cGFydHMsIC8vIEFycmF5W0Nhc2VWYWxQYXJ0XVxuXHRcdFx0b3BFbHNlKSB7IC8vIE9wdFtCbG9ja1ZhbF1cblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMub3BDYXNlZCA9IG9wQ2FzZWRcblx0XHRcdHRoaXMucGFydHMgPSBwYXJ0c1xuXHRcdFx0dGhpcy5vcEVsc2UgPSBvcEVsc2Vcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQ2FzZURvUGFydCBleHRlbmRzIE1zQXN0IHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHRlc3QgLyogVW5pb25bVmFsIFBhdHRlcm5dICovLCByZXN1bHQgLyogQmxvY2tEbyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy50ZXN0ID0gdGVzdFxuXHRcdFx0dGhpcy5yZXN1bHQgPSByZXN1bHRcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgQ2FzZVZhbFBhcnQgZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCB0ZXN0IC8qIFVuaW9uW1ZhbCBQYXR0ZXJuXSAqLywgcmVzdWx0IC8qIEJsb2NrVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnRlc3QgPSB0ZXN0XG5cdFx0XHR0aGlzLnJlc3VsdCA9IHJlc3VsdFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBQYXR0ZXJuIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYyxcblx0XHRcdHR5cGUsIC8vIFZhbFxuXHRcdFx0bG9jYWxzLCAvLyBBcnJheVtMb2NhbERlY2xhcmVdXG5cdFx0XHRwYXR0ZXJuZWQpIHsgLy8gTG9jYWxBY2Nlc3Ncblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMudHlwZSA9IHR5cGVcblx0XHRcdHRoaXMubG9jYWxzID0gbG9jYWxzXG5cdFx0XHR0aGlzLnBhdHRlcm5lZCA9IHBhdHRlcm5lZFxuXHRcdH1cblx0fVxuXG4vLyBTd2l0Y2hcblx0ZXhwb3J0IGNsYXNzIFN3aXRjaERvIGV4dGVuZHMgRG8ge1xuXHRcdGNvbnN0cnVjdG9yKGxvYyxcblx0XHRcdHN3aXRjaGVkLCAvLyBWYWxcblx0XHRcdHBhcnRzLCAvLyBBcnJheVtTd2l0Y2hEb1BhcnRdXG5cdFx0XHRvcEVsc2UpIHsgLy8gT3B0W0Jsb2NrRG9dXG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnN3aXRjaGVkID0gc3dpdGNoZWRcblx0XHRcdHRoaXMucGFydHMgPSAgcGFydHNcblx0XHRcdHRoaXMub3BFbHNlID0gb3BFbHNlXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFN3aXRjaFZhbCBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLFxuXHRcdFx0c3dpdGNoZWQsIC8vIFZhbFxuXHRcdFx0cGFydHMsIC8vIEFycmF5W1N3aXRjaFZhbFBhcnRdXG5cdFx0XHRvcEVsc2UpIHsgLy8gT3B0W0Jsb2NrVmFsXVxuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5zd2l0Y2hlZCA9IHN3aXRjaGVkXG5cdFx0XHR0aGlzLnBhcnRzID0gcGFydHNcblx0XHRcdHRoaXMub3BFbHNlID0gb3BFbHNlXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFN3aXRjaERvUGFydCBleHRlbmRzIE1zQXN0IHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHZhbHVlcyAvKiBBcnJheVtWYWxdICovLCByZXN1bHQgLyogQmxvY2tEbyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy52YWx1ZXMgPSB2YWx1ZXNcblx0XHRcdHRoaXMucmVzdWx0ID0gcmVzdWx0XG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFN3aXRjaFZhbFBhcnQgZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCB2YWx1ZXMgLyogQXJyYXlbVmFsXSAqLywgcmVzdWx0IC8qIEJsb2NrVmFsICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnZhbHVlcyA9IHZhbHVlc1xuXHRcdFx0dGhpcy5yZXN1bHQgPSByZXN1bHRcblx0XHR9XG5cdH1cblxuLy8gRm9yXG5cdGV4cG9ydCBjbGFzcyBGb3JEbyBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9wSXRlcmF0ZWUgLyogT3B0W0l0ZXJhdGVlXSAqLywgYmxvY2sgLyogQmxvY2tEbyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5vcEl0ZXJhdGVlID0gb3BJdGVyYXRlZVxuXHRcdFx0dGhpcy5ibG9jayA9IGJsb2NrXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZvclZhbCBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBvcEl0ZXJhdGVlIC8qIE9wdFtJdGVyYXRlZV0gKi8sIGJsb2NrIC8qIEJsb2NrRG8gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMub3BJdGVyYXRlZSA9IG9wSXRlcmF0ZWVcblx0XHRcdHRoaXMuYmxvY2sgPSBibG9ja1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBGb3JCYWcgZXh0ZW5kcyBWYWwge1xuXHRcdHN0YXRpYyBvZihsb2MsIG9wSXRlcmF0ZWUsIGJsb2NrKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEZvckJhZyhsb2MsIG5ldyBMb2NhbERlY2xhcmVCdWlsdChsb2MpLCBvcEl0ZXJhdGVlLCBibG9jaylcblx0XHR9XG5cblx0XHRjb25zdHJ1Y3Rvcihsb2MsXG5cdFx0XHRidWlsdCwgLy8gTG9jYWxEZWNsYXJlQnVpbHRcblx0XHRcdG9wSXRlcmF0ZWUsIC8vIE9wdFtJdGVyYXRlZV1cblx0XHRcdGJsb2NrKSB7IC8vIEJsb2NrRG9cblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuYnVpbHQgPSBidWlsdFxuXHRcdFx0dGhpcy5vcEl0ZXJhdGVlID0gb3BJdGVyYXRlZVxuXHRcdFx0dGhpcy5ibG9jayA9IGJsb2NrXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEl0ZXJhdGVlIGV4dGVuZHMgTXNBc3Qge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgZWxlbWVudCAvKiBMb2NhbERlY2xhcmUgKi8sIGJhZyAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcblx0XHRcdHRoaXMuYmFnID0gYmFnXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEJyZWFrIGV4dGVuZHMgRG8geyB9XG5cblx0ZXhwb3J0IGNsYXNzIEJyZWFrV2l0aFZhbCBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHZhbHVlKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuLy8gTWlzYyBWYWxzXG5cdGV4cG9ydCBjbGFzcyBCbG9ja1dyYXAgZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgYmxvY2sgLyogQmxvY2tWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuYmxvY2sgPSBibG9ja1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBCYWdTaW1wbGUgZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgcGFydHMgLyogQXJyYXlbVmFsXSAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5wYXJ0cyA9IHBhcnRzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIE9ialNpbXBsZSBleHRlbmRzIFZhbCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBwYWlycyAvKiBBcnJheVtPYmpQYWlyXSAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5wYWlycyA9IHBhaXJzXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIE9ialBhaXIgZXh0ZW5kcyBNc0FzdCB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBrZXkgLyogU3RyaW5nICovLCB2YWx1ZSAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMua2V5ID0ga2V5XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY29uc3Rcblx0XHRMX0FuZCA9IDAsXG5cdFx0TF9PciA9IDFcblx0ZXhwb3J0IGNsYXNzIExvZ2ljIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGtpbmQgLyogTnVtYmVyICovLCBhcmdzIC8qIEFycmF5W1ZhbF0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMua2luZCA9IGtpbmRcblx0XHRcdHRoaXMuYXJncyA9IGFyZ3Ncblx0XHR9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTm90IGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGFyZyAvKiBWYWwgKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMuYXJnID0gYXJnXG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhpcyBpcyBib3RoIGEgVG9rZW4gYW5kIE1zQXN0LlxuXHQvLyBTdG9yZSB0aGUgdmFsdWUgYXMgYSBTdHJpbmcgc28gd2UgY2FuIGRpc3Rpbmd1aXNoIGAweGZgIGZyb20gYDE1YC5cblx0ZXhwb3J0IGNsYXNzIE51bWJlckxpdGVyYWwgZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgdmFsdWUgLyogU3RyaW5nICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWVcblx0XHR9XG5cblx0XHQvLyBUb2tlbnMgbmVlZCB0b1N0cmluZy5cblx0XHR0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKSB9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTWVtYmVyIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIG9iamVjdCAvKiBWYWwgKi8sIG5hbWUgLyogU3RyaW5nICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLm9iamVjdCA9IG9iamVjdFxuXHRcdFx0dGhpcy5uYW1lID0gbmFtZVxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBRdW90ZSBleHRlbmRzIFZhbCB7XG5cdFx0c3RhdGljIGZvclN0cmluZyhsb2MsIHN0cikge1xuXHRcdFx0cmV0dXJuIG5ldyBRdW90ZShsb2MsIFtzdHJdKVxuXHRcdH1cblxuXHRcdC8vIHBhcnRzIGFyZSBTdHJpbmdzIGludGVybGVhdmVkIHdpdGggVmFscy5cblx0XHQvLyBwYXJ0IFN0cmluZ3MgYXJlIHJhdyB2YWx1ZXMsIG1lYW5pbmcgXCJcXG5cIiBpcyB0d28gY2hhcmFjdGVycy5cblx0XHQvLyBTaW5jZSBcIlxce1wiIGlzIHNwZWNpYWwgdG8gTWFzb24sIHRoYXQncyBvbmx5IG9uZSBjaGFyYWN0ZXIuXG5cdFx0Y29uc3RydWN0b3IobG9jLCBwYXJ0cyAvKiBBcnJheVtVbmlvbltTdHJpbmcgVmFsXV0gKi8pIHtcblx0XHRcdHN1cGVyKGxvYylcblx0XHRcdHRoaXMucGFydHMgPSBwYXJ0c1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBRdW90ZVRlbXBsYXRlIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIHRhZyAvKiBWYWwgKi8sIHF1b3RlIC8qIFF1b3RlICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLnRhZyA9IHRhZ1xuXHRcdFx0dGhpcy5xdW90ZSA9IHF1b3RlXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFdpdGggZXh0ZW5kcyBWYWwge1xuXHRcdGNvbnN0cnVjdG9yKGxvYywgZGVjbGFyZSAvKiBMb2NhbERlY2xhcmUgKi8sIHZhbHVlIC8qIFZhbCAqLywgYmxvY2sgLyogQmxvY2tEbyAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5kZWNsYXJlID0gZGVjbGFyZVxuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlXG5cdFx0XHR0aGlzLmJsb2NrID0gYmxvY2tcblx0XHR9XG5cdH1cblxuLy8gU3BlY2lhbFxuXHRleHBvcnQgY29uc3QgU0RfRGVidWdnZXIgPSAwXG5cdGV4cG9ydCBjbGFzcyBTcGVjaWFsRG8gZXh0ZW5kcyBEbyB7XG5cdFx0Y29uc3RydWN0b3IobG9jLCBraW5kIC8qIE51bWJlciAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5raW5kID0ga2luZFxuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBjb25zdFxuXHRcdFNWX0NvbnRhaW5zID0gMCxcblx0XHRTVl9GYWxzZSA9IDEsXG5cdFx0U1ZfTnVsbCA9IDIsXG5cdFx0U1ZfU3ViID0gMyxcblx0XHRTVl9UcnVlID0gNCxcblx0XHRTVl9VbmRlZmluZWQgPSA1LFxuXHRcdFNWX05hbWUgPSA2XG5cdGV4cG9ydCBjbGFzcyBTcGVjaWFsVmFsIGV4dGVuZHMgVmFsIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGtpbmQgLyogTnVtYmVyICovKSB7XG5cdFx0XHRzdXBlcihsb2MpXG5cdFx0XHR0aGlzLmtpbmQgPSBraW5kXG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIElnbm9yZSBleHRlbmRzIERvIHtcblx0XHRjb25zdHJ1Y3Rvcihsb2MsIGlnbm9yZWQgLyogQXJyYXlbU3RyaW5nXSAqLykge1xuXHRcdFx0c3VwZXIobG9jKVxuXHRcdFx0dGhpcy5pZ25vcmVkID0gaWdub3JlZFxuXHRcdH1cblx0fVxuIl0sInNvdXJjZVJvb3QiOiIvc3JjIn0=
