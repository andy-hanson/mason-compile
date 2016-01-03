import Loc from 'esast/lib/Loc';
import Op from 'op/Op';
import { Arguments } from './Call';
import { ClassTraitDo, MethodImplLike } from './classTraitCommon';
import Fun from './Fun';
import { Val, ValOnly, ValOrDo } from './LineContent';
import { LocalDeclare } from './locals';
import MemberName from './MemberName';
import MsAst from './MsAst';
export default class Class extends ValOnly {
    opFields: Op<Array<Field>>;
    opSuperClass: Op<Val>;
    traits: Array<Val>;
    opComment: Op<string>;
    opDo: Op<ClassTraitDo>;
    statics: Array<MethodImplLike>;
    opConstructor: Op<Constructor>;
    methods: Array<MethodImplLike>;
    constructor(loc: Loc, opFields: Op<Array<Field>>, opSuperClass: Op<Val>, traits: Array<Val>, opComment?: Op<string>, opDo?: Op<ClassTraitDo>, statics?: Array<MethodImplLike>, opConstructor?: Op<Constructor>, methods?: Array<MethodImplLike>);
    isRecord: boolean;
}
export declare class Field extends MsAst {
    name: string;
    opType: Op<Val>;
    constructor(loc: Loc, name: string, opType?: Op<Val>);
}
export declare class Constructor extends MsAst {
    fun: Fun;
    memberArgs: Array<LocalDeclare>;
    constructor(loc: Loc, fun: Fun, memberArgs: Array<LocalDeclare>);
}
export declare class SuperCall extends ValOrDo {
    args: Arguments;
    constructor(loc: Loc, args: Arguments);
}
export declare class SuperMember extends ValOnly {
    name: MemberName;
    constructor(loc: Loc, name: MemberName);
}
