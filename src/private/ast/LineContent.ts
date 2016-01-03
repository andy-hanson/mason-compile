import MsAst from './MsAst'

// LineContent
/**
Any valid part of a Block.
Note that some [[Val]]s will still cause warnings if they appear as a line.
*/
abstract class LineContent extends MsAst {
	// Make this a nominal type
	isLineContent() {}
}
export default LineContent

export interface Val extends LineContent {
	// Make this a nominal type
	isVal(): void
}
export function isVal(_: LineContent): _ is Val {
	return 'isVal' in _
}

export interface Do extends LineContent {
	// Make this a nominal type
	isDo(): void
}
export function isDo(_: LineContent): _ is Do {
	return 'isDo' in _
}

/** Could act as either a Val or Do. */
export abstract class ValOrDo extends LineContent implements Val, Do {
	isVal() {}
	isDo() {}
}

/** Can only appear as a line of a Block. */
export abstract class DoOnly extends LineContent implements Do {
	isDo() {}
	// Make this a nominal type
	private isDoOnly() {}
}

/** Can only appear as an expression. */
export abstract class ValOnly extends LineContent implements Val {
	isVal() {}
	// Make this a nominal type
	private isValOnly() {}
}
