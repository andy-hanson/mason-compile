import Loc, { Pos, StartLine, StartPos, StartColumn, singleCharLoc } from 'esast/dist/Loc'
import { code } from '../CompileError'
import { NumberLiteral } from '../MsAst'
import { NonNameCharacters } from './language'
import { DotName, Group, G_Block, G_Bracket, G_Line, G_Parenthesis, G_Space, G_Quote,
	isKeyword, Keyword, KW_AssignMutable, KW_Ellipsis, KW_Focus, KW_Fun, KW_FunDo, KW_FunGen,
	KW_FunGenDo, KW_FunThis, KW_FunThisDo, KW_FunThisGen, KW_FunThisGenDo, KW_Lazy, KW_LocalMutate,
	KW_ObjAssign, KW_Region, KW_Type, Name, opKeywordKindFromName, showGroupKind } from './Token'
import { assert, isEmpty, last } from './util'

/*
This produces the Token tree (see Token.js).
*/
export default (context, sourceString) => {
	// Lexing algorithm requires trailing newline to close any blocks.
	// Use a null-terminated string because it's faster than checking whether index === length.
	sourceString = sourceString + '\n\0'

	// --------------------------------------------------------------------------------------------
	// GROUPING
	// --------------------------------------------------------------------------------------------
	// We only ever write to the innermost Group;
	// when we close that Group we add it to the enclosing Group and continue with that one.
	// Note that `curGroup` is conceptually the top of the stack, but is not stored in `stack`.
	const groupStack = [ ]
	let curGroup
	const
		addToCurrentGroup = token =>
			curGroup.subTokens.push(token),

		// Pause writing to curGroup in favor of writing to a sub-group.
		// When the sub-group finishes we will pop the stack and resume writing to its parent.
		openGroup = (openPos, groupKind) => {
			groupStack.push(curGroup)
			// Contents will be added to by `o`.
			// curGroup.loc.end will be written to when closing it.
			curGroup = Group(Loc(openPos, null), [ ], groupKind)
		},

		// A group ending may close mutliple groups.
		// For example, in `log! (+ 1 1`, the G_Line will also close a G_Parenthesis.
		closeGroups = (closePos, closeKind) => {
			// curGroup is different each time we go through the loop
			// because _closeSingleGroup brings us to an enclosing group.
			while (curGroup.kind !== closeKind) {
				const curKind = curGroup.kind
				// A line can close a parenthesis, but a parenthesis can't close a line!
				context.check(
					curKind === G_Parenthesis || curKind === G_Bracket || curKind === G_Space,
					closePos, () =>
					`Trying to close ${showGroupKind(closeKind)}, ` +
					`but last opened was ${showGroupKind(curKind)}`)
				_closeSingleGroup(closePos, curGroup.kind)
			}
			_closeSingleGroup(closePos, closeKind)
		},

		_closeSingleGroup = (closePos, closeKind) => {
			let justClosed = curGroup
			curGroup = groupStack.pop()
			justClosed.loc.end = closePos
			switch (closeKind) {
				case G_Space: {
					const size = justClosed.subTokens.length
					if (size !== 0)
						// Spaced should always have at least two elements.
						addToCurrentGroup(size === 1 ? justClosed.subTokens[0] : justClosed)
					break
				}
				case G_Line:
					// Line must have content.
					// This can happen if there was just a comment.
					if (!isEmpty(justClosed.subTokens))
						addToCurrentGroup(justClosed)
					break
				case G_Block:
					context.check(!isEmpty(justClosed.subTokens), closePos, 'Empty block.')
					addToCurrentGroup(justClosed)
					break
				default:
					addToCurrentGroup(justClosed)
			}
		},

		openParenthesis = loc => {
			openGroup(loc.start, G_Parenthesis)
			openGroup(loc.end, G_Space)
		},

		openBracket = loc => {
			openGroup(loc.start, G_Bracket)
			openGroup(loc.end, G_Space)
		},

		// When starting a new line, a spaced group is created implicitly.
		openLine = pos => {
			openGroup(pos, G_Line)
			openGroup(pos, G_Space)
		},

		closeLine = pos => {
			closeGroups(pos, G_Space)
			closeGroups(pos, G_Line)
		},

		// When encountering a space, it both closes and opens a spaced group.
		space = loc => {
			closeGroups(loc.start, G_Space)
			openGroup(loc.end, G_Space)
		}

	// --------------------------------------------------------------------------------------------
	// ITERATING THROUGH SOURCESTRING
	// --------------------------------------------------------------------------------------------
	/*
	These are kept up-to-date as we iterate through sourceString.
	Every access to index has corresponding changes to line and/or column.
	This also explains why there are different functions for newlines vs other characters.
	*/
	let index = 0, line = StartLine, column = StartColumn

	/*
	NOTE: We use character *codes* for everything.
	Characters are of type Number and not just Strings of length one.
	*/
	const
		pos = () => Pos(line, column),

		peek = () => sourceString.charCodeAt(index),
		peekNext = () => sourceString.charCodeAt(index + 1),

		// May eat a Newline.
		// If that happens, line and column will temporarily be wrong,
		// but we handle it in that special case (rather than checking for Newline every time).
		eat = () => {
			const char = sourceString.charCodeAt(index)
			index = index + 1
			column = column + 1
			return char
		},
		skip = eat,

		// charToEat must not be Newline.
		tryEat = charToEat => {
			const canEat = peek() === charToEat
			if (canEat) {
				index = index + 1
				column = column + 1
			}
			return canEat
		},

		mustEat = (charToEat, precededBy) => {
			const canEat = tryEat(charToEat)
			context.check(canEat, pos, () =>
				`${code(precededBy)} must be followed by ${showChar(charToEat)}`)
		},

		tryEatNewline = () => {
			const canEat = peek() === Newline
			if (canEat) {
				index = index + 1
				line = line + 1
				column = StartColumn
			}
			return canEat
		},

		// Caller must ensure that backing up nCharsToBackUp characters brings us to oldPos.
		stepBackMany = (oldPos, nCharsToBackUp) => {
			index = index - nCharsToBackUp
			line = oldPos.line
			column = oldPos.column
		},

		// For takeWhile, takeWhileWithPrev, and skipWhileEquals,
		// characterPredicate must *not* accept Newline.
		// Otherwise there may be an infinite loop!
		takeWhile = characterPredicate => {
			const startIndex = index
			_skipWhile(characterPredicate)
			return sourceString.slice(startIndex, index)
		},

		takeWhileWithPrev = characterPredicate => {
			const startIndex = index
			_skipWhile(characterPredicate)
			return sourceString.slice(startIndex - 1, index)
		},

		skipWhileEquals = char =>
			_skipWhile(_ => _ === char),

		skipRestOfLine = () =>
			_skipWhile(_ => _ !== Newline),

		_skipWhile = characterPredicate => {
			const startIndex = index
			while (characterPredicate(peek()))
				index = index + 1
			const diff = index - startIndex
			column = column + diff
			return diff
		},

		// Called after seeing the first newline.
		// Returns # total newlines, including the first.
		skipNewlines = () => {
			const startLine = line
			line = line + 1
			while (peek() === Newline) {
				index = index + 1
				line = line + 1
			}
			column = StartColumn
			return line - startLine
		}

	// Sprinkle checkPos() around to debug line and column tracking errors.
	/*
	const
		checkPos = () => {
			const p = _getCorrectPos()
			if (p.line !== line || p.column !== column)
				throw new Error(`index: ${index}, wrong: ${Pos(line, column)}, right: ${p}`)
		},
		_indexToPos = new Map(),
		_getCorrectPos = () => {
			if (index === 0)
				return Pos(StartLine, StartColumn)

			let oldPos, oldIndex
			for (oldIndex = index - 1; ; oldIndex = oldIndex - 1) {
				oldPos = _indexToPos.get(oldIndex)
				if (oldPos !== undefined)
					break
				assert(oldIndex >= 0)
			}
			let newLine = oldPos.line, newColumn = oldPos.column
			for (; oldIndex < index; oldIndex = oldIndex + 1)
				if (sourceString.charCodeAt(oldIndex) === Newline) {
					newLine = newLine + 1
					newColumn = StartColumn
				} else
					newColumn = newColumn + 1

			const p = Pos(newLine, newColumn)
			_indexToPos.set(index, p)
			return p
		}
	*/

	/*
	In the case of quote interpolation ("a{b}c") we'll recurse back into here.
	When isInQuote is true, we will not allow newlines.
	*/
	const lexPlain = isInQuote => {
		// This tells us which indented block we're in.
		// Incrementing it means issuing a GP_OpenBlock and decrementing it means a GP_CloseBlock.
		// Does nothing if isInQuote.
		let indent = 0

		// Make closures now rather than inside the loop.
		// This is significantly faster as of node v0.11.14.

		// This is where we started lexing the current token.
		let startColumn
		const
			startPos = () => Pos(line, startColumn),
			loc = () => Loc(startPos(), pos()),
			keyword = kind =>
				addToCurrentGroup(Keyword(loc(), kind)),
			funKeyword = kind => {
				keyword(kind)
				space(loc())
			},
			eatAndAddNumber = () => {
				// TODO: A real number literal lexer, not just JavaScript's...
				const numberString = takeWhileWithPrev(isNumberCharacter)
				// Don't include `.` at end.
				if (last(numberString) === '.') {
					index = index - 1
					column = column - 1
				}
				const number = Number(numberString)
				context.check(!Number.isNaN(number), pos, () =>
					`Invalid number literal ${code(numberString)}`)
				addToCurrentGroup(NumberLiteral(loc(), number))
			}

		const handleName = () => {
			// All other characters should be handled in a case above.
			const name = takeWhileWithPrev(isNameCharacter)
			const keywordKind = opKeywordKindFromName(name)
			if (keywordKind !== undefined) {
				context.check(keywordKind !== -1, pos, () =>
					`Reserved name ${code(name)}`)
				if (keywordKind === KW_Region)
					// TODO: Eat and put it in Region expression
					skipRestOfLine()
				keyword(keywordKind)
			} else
				addToCurrentGroup(Name(loc(), name))
		}

		while (true) {
			startColumn = column
			const characterEaten = eat()
			// Generally, the type of a token is determined by the first character.
			switch (characterEaten) {
				case Zero:
					return
				case CloseBrace:
					context.check(isInQuote, loc, () =>
						`Reserved character ${showChar(CloseBrace)}`)
					return
				case Quote:
					lexQuote(indent)
					break

				// GROUPS

				case OpenParenthesis:
					openParenthesis(loc())
					break
				case OpenBracket:
					openBracket(loc())
					break
				case CloseParenthesis:
					closeGroups(pos(), G_Parenthesis)
					break
				case CloseBracket:
					closeGroups(pos(), G_Bracket)
					break

				case Space: {
					const next = peek()
					context.warnIf(next === Space, loc, 'Multiple spaces in a row.')
					context.warnIf(next === Newline, loc, 'Line ends in a space.')
					space(loc())
					break
				}

				case Newline: {
					context.check(!isInQuote, loc, 'Quote interpolation cannot contain newline')

					// Skip any blank lines.
					skipNewlines()
					const oldIndent = indent
					indent = skipWhileEquals(Tab)
					context.check(peek() !== Space, pos, 'Line begins in a space')
					if (indent <= oldIndent) {
						const l = loc()
						for (let i = indent; i < oldIndent; i = i + 1) {
							closeLine(l.start)
							closeGroups(l.end, G_Block)
						}
						closeLine(l.start)
						openLine(l.end)
					} else {
						context.check(indent === oldIndent + 1, loc,
							'Line is indented more than once')
						// Block at end of line goes in its own spaced group.
						// However, `~` preceding a block goes in a group with it.
						if (isEmpty(curGroup.subTokens) ||
							!isKeyword(KW_Lazy, last(curGroup.subTokens)))
							space(loc())
						openGroup(loc().start, G_Block)
						openLine(loc().end)
					}
					break
				}
				case Tab:
					// We always eat tabs in the Newline handler,
					// so this will only happen in the middle of a line.
					context.fail(loc(), 'Tab may only be used to indent')

				// FUN

				case Bang:
					if (tryEat(Bar))
						funKeyword(KW_FunDo)
					else
						handleName()
					break
				case Tilde:
					if (tryEat(Bang)) {
						mustEat(Bar, '~!')
						funKeyword(KW_FunGenDo)
					} else if (tryEat(Bar))
						funKeyword(KW_FunGen)
					else
						keyword(KW_Lazy)
					break
				case Bar:
					keyword(KW_Fun)
					// First arg in its own spaced group
					space(loc())
					break

				// NUMBER

				case Hyphen:
					if (isDigit(peek()))
						// eatNumber() looks at prev character, so hyphen included.
						eatAndAddNumber()
					else
						handleName()
					break
				case N0: case N1: case N2: case N3: case N4:
				case N5: case N6: case N7: case N8: case N9:
					eatAndAddNumber()
					break


				// OTHER

				case Hash:
					if (tryEat(Hash)) {
						// Multi-line comment
						mustEat(Hash, '##')
						while (true)
							if (eat() === Hash && eat() === Hash && eat() === Hash) {
								const nl = tryEat(Newline)
								context.check(nl, loc, () =>
									`#Closing {code('###')} must be followed by newline.`)
								break
							}
					} else {
						// Single-line comment
						if (!(tryEat(Space) || tryEat(Tab)))
							context.fail(loc, () =>
								`${code('#')} must be followed by space or tab.`)
						skipRestOfLine()
					}
					break

				case Dot: {
					const next = peek()
					if (next === Space || next === Newline) {
						// ObjLit assign in its own spaced group.
						// We can't just create a new Group here because we want to
						// ensure it's not part of the preceding or following spaced group.
						closeGroups(startPos(), G_Space)
						keyword(KW_ObjAssign)
						// This exists solely so that the Space or Newline handler can close it...
						openGroup(pos(), G_Space)
					} else if (next === Bar) {
						skip()
						keyword(KW_FunThis)
						space(loc())
					} else if (next === Bang && peekNext() === Bar) {
						skip()
						skip()
						keyword(KW_FunThisDo)
						space(loc())
					} else if (next === Tilde) {
						skip()
						if (tryEat(Bang)) {
							mustEat(Bar, '.~!')
							keyword(KW_FunThisGenDo)
						} else {
							mustEat(Bar, '.~')
							keyword(KW_FunThisGen)
						}
						space(loc())
					} else {
						// +1 for the dot we just ate.
						const nDots = skipWhileEquals(Dot) + 1
						const next = peek()
						if (nDots === 3 && next === Space || next === Newline)
							keyword(KW_Ellipsis)
						else
							addToCurrentGroup(DotName(loc(), nDots, takeWhile(isNameCharacter)))
					}
					break
				}

				case Colon:
					if (tryEat(Colon)) {
						mustEat(Equal, '::')
						keyword(KW_AssignMutable)
					} else if (tryEat(Equal))
						keyword(KW_LocalMutate)
					else
						keyword(KW_Type)
					break

				case Underscore:
					keyword(KW_Focus)
					break

				case Ampersand: case Backslash: case Backtick: case Caret:
				case Comma: case Percent: case Semicolon:
					context.fail(loc, `Reserved character ${showChar(characterEaten)}`)
				default:
					handleName()
			}
		}
	}

	const lexQuote = indent => {
		const quoteIndent = indent + 1

		// Indented quote is characterized by being immediately followed by a newline.
		// The next line *must* have some content at the next indentation.
		const isIndented = tryEatNewline()
		if (isIndented) {
			const actualIndent = skipWhileEquals(Tab)
			context.check(actualIndent === quoteIndent, pos,
				'Indented quote must have exactly one more indent than previous line.')
		}

		// Current string literal part of quote we are reading.
		let read = ''

		const maybeOutputRead = () => {
			if (read !== '') {
				addToCurrentGroup(read)
				read = ''
			}
		}

		const locSingle = () => singleCharLoc(pos())

		openGroup(locSingle().start, G_Quote)

		eatChars: while (true) {
			const char = eat()
			switch (char) {
				case Backslash: {
					read = read + quoteEscape(eat())
					break
				}
				case OpenBrace: {
					maybeOutputRead()
					const l = locSingle()
					openParenthesis(l)
					lexPlain(true)
					closeGroups(l.end, G_Parenthesis)
					break
				}
				case Newline: {
					const originalPos = pos()
					// Go back to before we ate it.
					originalPos.column = originalPos.column - 1

					context.check(isIndented, locSingle, 'Unclosed quote.')
					// Allow extra blank lines.
					const numNewlines = skipNewlines()
					const newIndent = skipWhileEquals(Tab)
					if (newIndent < quoteIndent) {
						// Indented quote section is over.
						// Undo reading the tabs and newline.
						stepBackMany(originalPos, numNewlines + newIndent)
						assert(peek() === Newline)
						break eatChars
					} else
						read = read +
							'\n'.repeat(numNewlines) + '\t'.repeat(newIndent - quoteIndent)
					break
				}
				case Quote:
					if (!isIndented)
						break eatChars
					// Else fallthrough
				default:
					// I've tried pushing character codes to an array and stringifying them later,
					// but this turned out to be better.
					read = read + String.fromCharCode(char)
			}
		}

		maybeOutputRead()
		closeGroups(pos(), G_Quote)
	}

	const quoteEscape = ch => {
		switch (ch) {
			case OpenBrace: return '{'
			case LetterN: return '\n'
			case LetterT: return '\t'
			case Quote: return '"'
			case Backslash: return '\\'
			default: context.fail(pos, `No need to escape ${showChar(ch)}`)
		}
	}

	curGroup = Group(Loc(StartPos, null), [ ], G_Block)
	openLine(StartPos)

	lexPlain(false)

	const endPos = pos()
	closeLine(endPos)
	assert(isEmpty(groupStack))
	curGroup.loc.end = endPos
	return curGroup
}

const cc = _ => _.charCodeAt(0)
const
	Ampersand = cc('&'),
	Backslash = cc('\\'),
	Backtick = cc('`'),
	Bang = cc('!'),
	Bar = cc('|'),
	Caret = cc('^'),
	CloseBrace = cc('}'),
	CloseBracket = cc(']'),
	CloseParenthesis = cc(')'),
	Colon = cc(':'),
	Comma = cc(','),
	Dot = cc('.'),
	Equal = cc('='),
	Hash = cc('#'),
	Hyphen = cc('-'),
	LetterN = cc('n'),
	LetterT = cc('t'),
	N0 = cc('0'),
	N1 = cc('1'),
	N2 = cc('2'),
	N3 = cc('3'),
	N4 = cc('4'),
	N5 = cc('5'),
	N6 = cc('6'),
	N7 = cc('7'),
	N8 = cc('8'),
	N9 = cc('9'),
	Newline = cc('\n'),
	OpenBrace = cc('{'),
	OpenBracket = cc('['),
	OpenParenthesis = cc('('),
	Percent = cc('%'),
	Quote = cc('"'),
	Semicolon = cc(';'),
	Space = cc(' '),
	Tab = cc('\t'),
	Tilde = cc('~'),
	Underscore = cc('_'),
	Zero = cc('\0')

const
	showChar = char => code(String.fromCharCode(char)),
	_charPred = (chars, negate) => {
		let src = 'switch(ch) {\n'
		for (let i = 0; i < chars.length; i = i + 1)
			src = `${src}case ${chars.charCodeAt(i)}: `
		src = `${src} return ${!negate}\ndefault: return ${negate}\n}`
		return Function('ch', src)
	},
	isDigit = _charPred('0123456789'),
	isNameCharacter = _charPred(NonNameCharacters, true),
	isNumberCharacter = _charPred('0123456789.e')
