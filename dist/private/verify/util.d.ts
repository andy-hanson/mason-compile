import Language from '../languages/Language';
import { Val, LocalDeclare, Name, Named, Spread } from '../MsAst';
export declare function makeUseOptional(localDeclare: LocalDeclare): void;
export declare function makeUseOptionalIfFocus(localDeclare: LocalDeclare): void;
export declare function verifyEachValOrSpread(asts: Array<Val | Spread>): void;
export declare function verifyName(_: Name): void;
export declare function setName(expr: Named): void;
export declare function verifyNotLazy(localDeclare: LocalDeclare, errorMessage: (_: Language) => string): void;
