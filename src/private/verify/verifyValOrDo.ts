import {caseOp, opEach, orThrow} from 'op/Op'
import {check, fail, warn} from '../context'
import {Await, Block, Call, Case, CasePart, Catch, Cond, Conditional, Constructor, Del, Except, For, ForAsync, Funs, LineContent, Pattern,
	SuperCall, Switch, SwitchPart, Throw, With, Yield, YieldTo} from '../MsAst'
import {Keywords} from '../Token'
import {isEmpty} from '../util'
import {funKind, method, results, withFun, withIifeIf, withIifeIfVal, withInSwitch} from './context'
import {plusLocals, verifyAndPlusLocal, verifyAndPlusLocals} from './locals'
import SK, {getBlockSK, markStatement} from './SK'
import {makeUseOptionalIfFocus, verifyEachValOrSpread, verifyNotLazy} from './util'
import {verifyBlockDo, verifyBlockSK} from './verifyBlock'
import verifyDo, {verifyOpDo} from './verifyDo'
import verifyExcept from './verifyExcept'
import verifyFor, {withVerifyIteratee} from './verifyFor'
import verifySK, {verifyEachSK, verifyOpSK} from './verifySK'
import verifyVal, {verifyEachVal, verifyOpVal} from './verifyVal'

//don't call directly, except through verifyVal or verifyDo
export default function verifyValOrDo(_: LineContent, sk: SK) {
	if (_ instanceof Await) {
		const {loc, value} = _
		//ignore SK
		check(funKind === Funs.Async, loc, _ => _.misplacedAwait)
		verifyVal(value)
	} else if (_ instanceof Call) {
		const {called, args} = _
		//Call can be either SK.Val or SK.Do
		verifyVal(called)
		verifyEachValOrSpread(args)
	} else if (_ instanceof Case) {
		const {opCased, parts, opElse} = _
		markStatement(_, sk)
		withIifeIfVal(sk, () => {
			const doIt = () => {
				for (const _ of parts)
					verifyCasePart(_, sk)
				opEach(opElse, _ => verifyBlockSK(_, sk))
			}
			caseOp(opCased,
				_ => {
					verifyDo(_)
					verifyAndPlusLocal(_.assignee, doIt)
				},
				doIt)
		})
	} else if (_ instanceof Cond) {
		const {test, ifTrue, ifFalse} = _
		//Could be a statement if both results are.
		verifyVal(test)
		verifySK(ifTrue, sk)
		verifySK(ifFalse, sk)
	} else if (_ instanceof Conditional) {
		const {test, result} = _
		markStatement(_, sk)
		verifyVal(test)
		withIifeIf(result instanceof Block && sk === SK.Val, () => {
			if (result instanceof Block)
				verifyBlockSK(result, sk)
			else
				verifySK(result, sk)
		})
	} else if (_ instanceof Del) {
		const {subbed, args} = _
		//DelSub can be either SK.Val or SK.Do
		verifyVal(subbed)
		verifyEachVal(args)
	} else if (_ instanceof Except)
		verifyExcept(_, sk)
	else if (_ instanceof For) {
		markStatement(_, sk)
		verifyFor(_)
	} else if (_ instanceof ForAsync) {
		const {loc, iteratee, block} = _
		markStatement(_, sk)
		check(sk !== SK.Do || funKind === Funs.Async, loc, _ => _.forAsyncNeedsAsync)
		withVerifyIteratee(iteratee, () => {
			withFun(Funs.Async, () => {
				// Default block to returning a value, but OK if it doesn't.
				// If a statement, statement, the compiled code will make a Promise
				// that resolves to an array full of `undefined`.
				verifyBlockSK(block, getBlockSK(block))
			})
		})
	} else if (_ instanceof SuperCall) {
		const {loc, args} = _
		const meth = orThrow(method, () => fail(loc, _ => _.superNeedsMethod))
		results.superCallToMethod.set(_, meth)

		if (meth instanceof Constructor) {
			check(sk === SK.Do, loc, _ => _.superMustBeStatement)
			results.constructorToSuper.set(meth, _)
		}

		verifyEachVal(args)
	} else if (_ instanceof Switch) {
		const {switched, parts, opElse} = _
		markStatement(_, sk)
		withIifeIfVal(sk, () => {
			withInSwitch(true, () => {
				verifyVal(switched)
				for (const _ of parts)
					verifySwitchPart(_, sk)
				opEach(opElse, _ => verifyBlockSK(_, sk))
			})
		})
	} else if (_ instanceof Throw) {
		verifyOpVal(_.opThrown)
	} else if (_ instanceof With) {
		const {value, declare, block} = _
		markStatement(_, sk)
		verifyVal(value)
		withIifeIfVal(sk, () => {
			if (sk === SK.Val)
				makeUseOptionalIfFocus(declare)
			verifyAndPlusLocal(declare, () => {
				verifyBlockDo(block)
			})
		})
	} else if (_ instanceof Yield) {
		const {loc, opValue} = _
		//todo: don't use Keywords, that should not be used by anything but lex/parse
		check(funKind === Funs.Generator, loc, _ => _.misplacedYield(Keywords.Yield))
		verifyOpVal(opValue)
	} else if (_ instanceof YieldTo) {
		const {loc, value} = _
		check(funKind === Funs.Generator, loc, _ => _.misplacedYield(Keywords.YieldTo))
		verifyVal(value)
	} else {
		//should have handled all types.
		throw new Error(_.constructor.name)
	}
}

function verifyCasePart({test, result}: CasePart, sk: SK): void {
	if (test instanceof Pattern) {
		verifyVal(test.type)
		verifyVal(test.patterned)
		verifyAndPlusLocals(test.locals, () => verifyBlockSK(result, sk))
	} else {
		verifyVal(test)
		verifyBlockSK(result, sk)
	}
}

function verifySwitchPart(_: SwitchPart, sk: SK) {
	const {values, result} = _
	markStatement(_, sk)
	verifyEachVal(values)
	verifyBlockSK(result, sk)
}
