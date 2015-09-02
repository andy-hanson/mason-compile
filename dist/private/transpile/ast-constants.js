if (typeof define !== 'function') var define = require('amdefine')(module);define(['exports', 'esast/dist/ast', 'esast/dist/util', './util'], function (exports, _esastDistAst, _esastDistUtil, _util) {
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	const GlobalError = new _esastDistAst.Identifier('Error'),
	      IdArguments = new _esastDistAst.Identifier('arguments'),
	      IdBuilt = new _esastDistAst.Identifier('built'),
	      IdDefine = new _esastDistAst.Identifier('define'),
	      IdError = _util._IdError,
	      IdExports = new _esastDistAst.Identifier('exports'),
	      IdExtract = new _esastDistAst.Identifier('_$'),
	     
	// TODO:ES6 Shouldn't need, just use arrow functions.
	IdLexicalThis = new _esastDistAst.Identifier('_this'),
	      LitEmptyArray = new _esastDistAst.ArrayExpression([]),
	      LitEmptyString = new _esastDistAst.Literal(''),
	      LitNull = new _esastDistAst.Literal(null),
	      LitStrExports = new _esastDistAst.Literal('exports'),
	      LitStrThrow = new _esastDistAst.Literal('An error occurred.'),
	      LitTrue = new _esastDistAst.Literal(true),
	      LitZero = new _esastDistAst.Literal(0),
	      ReturnBuilt = new _esastDistAst.ReturnStatement(IdBuilt),
	      ReturnExports = new _esastDistAst.ReturnStatement(IdExports),
	      ReturnRes = new _esastDistAst.ReturnStatement(new _esastDistAst.Identifier('res')),
	      SwitchCaseNoMatch = new _esastDistAst.SwitchCase(undefined, [(0, _util.throwErrorFromString)('No branch of `switch` matches.')]),
	      SymbolIterator = (0, _esastDistUtil.member)(new _esastDistAst.Identifier('Symbol'), 'iterator'),
	      ThrowAssertFail = (0, _util.throwErrorFromString)('Assertion failed.'),
	      ThrowNoCaseMatch = (0, _util.throwErrorFromString)('No branch of `case` matches.'),
	      UseStrict = new _esastDistAst.ExpressionStatement(new _esastDistAst.Literal('use strict')),
	      ArraySliceCall = (0, _esastDistUtil.member)((0, _esastDistUtil.member)(LitEmptyArray, 'slice'), 'call'),
	     
	// if (typeof define !== 'function') var define = require('amdefine')(module)
	AmdefineHeader = new _esastDistAst.IfStatement(new _esastDistAst.BinaryExpression('!==', new _esastDistAst.UnaryExpression('typeof', IdDefine), new _esastDistAst.Literal('function')), new _esastDistAst.VariableDeclaration('var', [new _esastDistAst.VariableDeclarator(IdDefine, new _esastDistAst.CallExpression(new _esastDistAst.CallExpression(new _esastDistAst.Identifier('require'), [new _esastDistAst.Literal('amdefine')]), [new _esastDistAst.Identifier('module')]))])),
	      DeclareBuiltBag = new _esastDistAst.VariableDeclaration('const', [new _esastDistAst.VariableDeclarator(IdBuilt, LitEmptyArray)]),
	      DeclareBuiltMap = new _esastDistAst.VariableDeclaration('const', [new _esastDistAst.VariableDeclarator(IdBuilt, new _esastDistAst.NewExpression((0, _esastDistUtil.member)(new _esastDistAst.Identifier('global'), 'Map'), []))]),
	      DeclareBuiltObj = new _esastDistAst.VariableDeclaration('const', [new _esastDistAst.VariableDeclarator(IdBuilt, new _esastDistAst.ObjectExpression([]))]),
	      ExportsDefault = (0, _esastDistUtil.member)(IdExports, 'default'),
	      ExportsGet = (0, _esastDistUtil.member)(IdExports, '_get');
	exports.GlobalError = GlobalError;
	exports.IdArguments = IdArguments;
	exports.IdBuilt = IdBuilt;
	exports.IdDefine = IdDefine;
	exports.IdError = IdError;
	exports.IdExports = IdExports;
	exports.IdExtract = IdExtract;
	exports.IdLexicalThis = IdLexicalThis;
	exports.LitEmptyArray = LitEmptyArray;
	exports.LitEmptyString = LitEmptyString;
	exports.LitNull = LitNull;
	exports.LitStrExports = LitStrExports;
	exports.LitStrThrow = LitStrThrow;
	exports.LitTrue = LitTrue;
	exports.LitZero = LitZero;
	exports.ReturnBuilt = ReturnBuilt;
	exports.ReturnExports = ReturnExports;
	exports.ReturnRes = ReturnRes;
	exports.SwitchCaseNoMatch = SwitchCaseNoMatch;
	exports.SymbolIterator = SymbolIterator;
	exports.ThrowAssertFail = ThrowAssertFail;
	exports.ThrowNoCaseMatch = ThrowNoCaseMatch;
	exports.UseStrict = UseStrict;
	exports.ArraySliceCall = ArraySliceCall;
	exports.AmdefineHeader = AmdefineHeader;
	exports.DeclareBuiltBag = DeclareBuiltBag;
	exports.DeclareBuiltMap = DeclareBuiltMap;
	exports.DeclareBuiltObj = DeclareBuiltObj;
	exports.ExportsDefault = ExportsDefault;
	exports.ExportsGet = ExportsGet;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzdC1jb25zdGFudHMuanMiLCJwcml2YXRlL3RyYW5zcGlsZS9hc3QtY29uc3RhbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNNTyxPQUNOLFdBQVcsR0FBRyxrQkFQa0UsVUFBVSxDQU83RCxPQUFPLENBQUM7T0FDckMsV0FBVyxHQUFHLGtCQVJrRSxVQUFVLENBUTdELFdBQVcsQ0FBQztPQUN6QyxPQUFPLEdBQUcsa0JBVHNFLFVBQVUsQ0FTakUsT0FBTyxDQUFDO09BQ2pDLFFBQVEsR0FBRyxrQkFWcUUsVUFBVSxDQVVoRSxRQUFRLENBQUM7T0FDbkMsT0FBTyxTQVBDLFFBQVEsQUFPRTtPQUNsQixTQUFTLEdBQUcsa0JBWm9FLFVBQVUsQ0FZL0QsU0FBUyxDQUFDO09BQ3JDLFNBQVMsR0FBRyxrQkFib0UsVUFBVSxDQWEvRCxJQUFJLENBQUM7OztBQUVoQyxjQUFhLEdBQUcsa0JBZmdFLFVBQVUsQ0FlM0QsT0FBTyxDQUFDO09BQ3ZDLGFBQWEsR0FBRyxrQkFoQlIsZUFBZSxDQWdCYSxFQUFFLENBQUM7T0FDdkMsY0FBYyxHQUFHLGtCQWhCSixPQUFPLENBZ0JTLEVBQUUsQ0FBQztPQUNoQyxPQUFPLEdBQUcsa0JBakJHLE9BQU8sQ0FpQkUsSUFBSSxDQUFDO09BQzNCLGFBQWEsR0FBRyxrQkFsQkgsT0FBTyxDQWtCUSxTQUFTLENBQUM7T0FDdEMsV0FBVyxHQUFHLGtCQW5CRCxPQUFPLENBbUJNLG9CQUFvQixDQUFDO09BQy9DLE9BQU8sR0FBRyxrQkFwQkcsT0FBTyxDQW9CRSxJQUFJLENBQUM7T0FDM0IsT0FBTyxHQUFHLGtCQXJCRyxPQUFPLENBcUJFLENBQUMsQ0FBQztPQUN4QixXQUFXLEdBQUcsa0JBdEJ5QyxlQUFlLENBc0JwQyxPQUFPLENBQUM7T0FDMUMsYUFBYSxHQUFHLGtCQXZCdUMsZUFBZSxDQXVCbEMsU0FBUyxDQUFDO09BQzlDLFNBQVMsR0FBRyxrQkF4QjJDLGVBQWUsQ0F3QnRDLGtCQXpCZ0QsVUFBVSxDQXlCM0MsS0FBSyxDQUFDLENBQUM7T0FDdEQsaUJBQWlCLEdBQUcsa0JBekJvRCxVQUFVLENBeUIvQyxTQUFTLEVBQUUsQ0FDN0MsVUF2QmlCLG9CQUFvQixFQXVCaEIsZ0NBQWdDLENBQUMsQ0FBRSxDQUFDO09BQzFELGNBQWMsR0FBRyxtQkF6QlQsTUFBTSxFQXlCVSxrQkE1QndELFVBQVUsQ0E0Qm5ELFFBQVEsQ0FBQyxFQUFFLFVBQVUsQ0FBQztPQUM3RCxlQUFlLEdBQUcsVUF6QkEsb0JBQW9CLEVBeUJDLG1CQUFtQixDQUFDO09BQzNELGdCQUFnQixHQUFHLFVBMUJELG9CQUFvQixFQTBCRSw4QkFBOEIsQ0FBQztPQUN2RSxTQUFTLEdBQUcsa0JBL0IrQyxtQkFBbUIsQ0ErQjFDLGtCQTlCdkIsT0FBTyxDQThCNEIsWUFBWSxDQUFDLENBQUM7T0FFOUQsY0FBYyxHQUFHLG1CQTlCVCxNQUFNLEVBOEJVLG1CQTlCaEIsTUFBTSxFQThCaUIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQzs7O0FBRS9ELGVBQWMsR0FBRyxrQkFsQ2pCLFdBQVcsQ0FtQ1Ysa0JBcEN3QixnQkFBZ0IsQ0FvQ25CLEtBQUssRUFDekIsa0JBbkNGLGVBQWUsQ0FtQ08sUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUN2QyxrQkFyQ1csT0FBTyxDQXFDTixVQUFVLENBQUMsQ0FBQyxFQUN6QixrQkFyQ2dCLG1CQUFtQixDQXFDWCxLQUFLLEVBQUUsQ0FDOUIsa0JBdENvQyxrQkFBa0IsQ0FzQy9CLFFBQVEsRUFBRSxrQkF4Q1EsY0FBYyxDQXlDdEQsa0JBekN3QyxjQUFjLENBeUNuQyxrQkF6QzBELFVBQVUsQ0F5Q3JELFNBQVMsQ0FBQyxFQUFFLENBQUUsa0JBeEN0QyxPQUFPLENBd0MyQyxVQUFVLENBQUMsQ0FBRSxDQUFDLEVBQzFFLENBQUUsa0JBMUMyRSxVQUFVLENBMEN0RSxRQUFRLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUM7T0FDckMsZUFBZSxHQUFHLGtCQXpDRCxtQkFBbUIsQ0F5Q00sT0FBTyxFQUNoRCxDQUFFLGtCQTFDbUMsa0JBQWtCLENBMEM5QixPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUUsQ0FBQztPQUNwRCxlQUFlLEdBQUcsa0JBM0NELG1CQUFtQixDQTJDTSxPQUFPLEVBQUUsQ0FDbEQsa0JBNUNxQyxrQkFBa0IsQ0E0Q2hDLE9BQU8sRUFDN0Isa0JBOUNvQixhQUFhLENBOENmLG1CQTVDWixNQUFNLEVBNENhLGtCQS9DcUQsVUFBVSxDQStDaEQsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRyxDQUFDLENBQUMsQ0FBRSxDQUFDO09BQ3JFLGVBQWUsR0FBRyxrQkE5Q0QsbUJBQW1CLENBOENNLE9BQU8sRUFBRSxDQUNsRCxrQkEvQ3FDLGtCQUFrQixDQStDaEMsT0FBTyxFQUFFLGtCQWhESSxnQkFBZ0IsQ0FnREMsRUFBRyxDQUFDLENBQUMsQ0FBRSxDQUFDO09BQzlELGNBQWMsR0FBRyxtQkEvQ1QsTUFBTSxFQStDVSxTQUFTLEVBQUUsU0FBUyxDQUFDO09BQzdDLFVBQVUsR0FBRyxtQkFoREwsTUFBTSxFQWdETSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUEiLCJmaWxlIjoicHJpdmF0ZS90cmFuc3BpbGUvYXN0LWNvbnN0YW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiaW1wb3J0IHsgQXJyYXlFeHByZXNzaW9uLCBCaW5hcnlFeHByZXNzaW9uLCBDYWxsRXhwcmVzc2lvbiwgRXhwcmVzc2lvblN0YXRlbWVudCwgSWRlbnRpZmllcixcblx0SWZTdGF0ZW1lbnQsIExpdGVyYWwsIE5ld0V4cHJlc3Npb24sIE9iamVjdEV4cHJlc3Npb24sIFJldHVyblN0YXRlbWVudCwgU3dpdGNoQ2FzZSxcblx0VW5hcnlFeHByZXNzaW9uLCBWYXJpYWJsZURlY2xhcmF0aW9uLCBWYXJpYWJsZURlY2xhcmF0b3IgfSBmcm9tICdlc2FzdC9kaXN0L2FzdCdcbmltcG9ydCB7IG1lbWJlciB9IGZyb20gJ2VzYXN0L2Rpc3QvdXRpbCdcbmltcG9ydCB7IF9JZEVycm9yLCB0aHJvd0Vycm9yRnJvbVN0cmluZyB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGNvbnN0XG5cdEdsb2JhbEVycm9yID0gbmV3IElkZW50aWZpZXIoJ0Vycm9yJyksXG5cdElkQXJndW1lbnRzID0gbmV3IElkZW50aWZpZXIoJ2FyZ3VtZW50cycpLFxuXHRJZEJ1aWx0ID0gbmV3IElkZW50aWZpZXIoJ2J1aWx0JyksXG5cdElkRGVmaW5lID0gbmV3IElkZW50aWZpZXIoJ2RlZmluZScpLFxuXHRJZEVycm9yID0gX0lkRXJyb3IsXG5cdElkRXhwb3J0cyA9IG5ldyBJZGVudGlmaWVyKCdleHBvcnRzJyksXG5cdElkRXh0cmFjdCA9IG5ldyBJZGVudGlmaWVyKCdfJCcpLFxuXHQvLyBUT0RPOkVTNiBTaG91bGRuJ3QgbmVlZCwganVzdCB1c2UgYXJyb3cgZnVuY3Rpb25zLlxuXHRJZExleGljYWxUaGlzID0gbmV3IElkZW50aWZpZXIoJ190aGlzJyksXG5cdExpdEVtcHR5QXJyYXkgPSBuZXcgQXJyYXlFeHByZXNzaW9uKFtdKSxcblx0TGl0RW1wdHlTdHJpbmcgPSBuZXcgTGl0ZXJhbCgnJyksXG5cdExpdE51bGwgPSBuZXcgTGl0ZXJhbChudWxsKSxcblx0TGl0U3RyRXhwb3J0cyA9IG5ldyBMaXRlcmFsKCdleHBvcnRzJyksXG5cdExpdFN0clRocm93ID0gbmV3IExpdGVyYWwoJ0FuIGVycm9yIG9jY3VycmVkLicpLFxuXHRMaXRUcnVlID0gbmV3IExpdGVyYWwodHJ1ZSksXG5cdExpdFplcm8gPSBuZXcgTGl0ZXJhbCgwKSxcblx0UmV0dXJuQnVpbHQgPSBuZXcgUmV0dXJuU3RhdGVtZW50KElkQnVpbHQpLFxuXHRSZXR1cm5FeHBvcnRzID0gbmV3IFJldHVyblN0YXRlbWVudChJZEV4cG9ydHMpLFxuXHRSZXR1cm5SZXMgPSBuZXcgUmV0dXJuU3RhdGVtZW50KG5ldyBJZGVudGlmaWVyKCdyZXMnKSksXG5cdFN3aXRjaENhc2VOb01hdGNoID0gbmV3IFN3aXRjaENhc2UodW5kZWZpbmVkLCBbXG5cdFx0dGhyb3dFcnJvckZyb21TdHJpbmcoJ05vIGJyYW5jaCBvZiBgc3dpdGNoYCBtYXRjaGVzLicpIF0pLFxuXHRTeW1ib2xJdGVyYXRvciA9IG1lbWJlcihuZXcgSWRlbnRpZmllcignU3ltYm9sJyksICdpdGVyYXRvcicpLFxuXHRUaHJvd0Fzc2VydEZhaWwgPSB0aHJvd0Vycm9yRnJvbVN0cmluZygnQXNzZXJ0aW9uIGZhaWxlZC4nKSxcblx0VGhyb3dOb0Nhc2VNYXRjaCA9IHRocm93RXJyb3JGcm9tU3RyaW5nKCdObyBicmFuY2ggb2YgYGNhc2VgIG1hdGNoZXMuJyksXG5cdFVzZVN0cmljdCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KG5ldyBMaXRlcmFsKCd1c2Ugc3RyaWN0JykpLFxuXG5cdEFycmF5U2xpY2VDYWxsID0gbWVtYmVyKG1lbWJlcihMaXRFbXB0eUFycmF5LCAnc2xpY2UnKSwgJ2NhbGwnKSxcblx0Ly8gaWYgKHR5cGVvZiBkZWZpbmUgIT09ICdmdW5jdGlvbicpIHZhciBkZWZpbmUgPSByZXF1aXJlKCdhbWRlZmluZScpKG1vZHVsZSlcblx0QW1kZWZpbmVIZWFkZXIgPSBuZXcgSWZTdGF0ZW1lbnQoXG5cdFx0bmV3IEJpbmFyeUV4cHJlc3Npb24oJyE9PScsXG5cdFx0XHRuZXcgVW5hcnlFeHByZXNzaW9uKCd0eXBlb2YnLCBJZERlZmluZSksXG5cdFx0XHRuZXcgTGl0ZXJhbCgnZnVuY3Rpb24nKSksXG5cdFx0bmV3IFZhcmlhYmxlRGVjbGFyYXRpb24oJ3ZhcicsIFtcblx0XHRcdG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoSWREZWZpbmUsIG5ldyBDYWxsRXhwcmVzc2lvbihcblx0XHRcdFx0bmV3IENhbGxFeHByZXNzaW9uKG5ldyBJZGVudGlmaWVyKCdyZXF1aXJlJyksIFsgbmV3IExpdGVyYWwoJ2FtZGVmaW5lJykgXSksXG5cdFx0XHRcdFsgbmV3IElkZW50aWZpZXIoJ21vZHVsZScpIF0pKSBdKSksXG5cdERlY2xhcmVCdWlsdEJhZyA9IG5ldyBWYXJpYWJsZURlY2xhcmF0aW9uKCdjb25zdCcsXG5cdFx0WyBuZXcgVmFyaWFibGVEZWNsYXJhdG9yKElkQnVpbHQsIExpdEVtcHR5QXJyYXkpIF0pLFxuXHREZWNsYXJlQnVpbHRNYXAgPSBuZXcgVmFyaWFibGVEZWNsYXJhdGlvbignY29uc3QnLCBbXG5cdFx0bmV3IFZhcmlhYmxlRGVjbGFyYXRvcihJZEJ1aWx0LFxuXHRcdFx0bmV3IE5ld0V4cHJlc3Npb24obWVtYmVyKG5ldyBJZGVudGlmaWVyKCdnbG9iYWwnKSwgJ01hcCcpLCBbIF0pKSBdKSxcblx0RGVjbGFyZUJ1aWx0T2JqID0gbmV3IFZhcmlhYmxlRGVjbGFyYXRpb24oJ2NvbnN0JywgW1xuXHRcdG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoSWRCdWlsdCwgbmV3IE9iamVjdEV4cHJlc3Npb24oWyBdKSkgXSksXG5cdEV4cG9ydHNEZWZhdWx0ID0gbWVtYmVyKElkRXhwb3J0cywgJ2RlZmF1bHQnKSxcblx0RXhwb3J0c0dldCA9IG1lbWJlcihJZEV4cG9ydHMsICdfZ2V0JylcbiJdLCJzb3VyY2VSb290IjoiL3NyYyJ9