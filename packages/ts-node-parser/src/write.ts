import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type { ParsedScript, ScriptNode } from './read';

const RUNTIME_PARAMS = new Set(['state', 'node', 'callstack']);

interface NodeSignature {
    params: string[];
    isAsync: boolean;
    returnsSingle: boolean;
}

function readNodeSignature(nodesDir: string, typeName: string): NodeSignature | null {
    const fileName = typeName.charAt(0).toLowerCase() + typeName.slice(1) + '.ts';
    const filePath = path.join(nodesDir, fileName);
    if (!fs.existsSync(filePath)) return null;

    const source = fs.readFileSync(filePath, 'utf-8');
    const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

    for (const stmt of sf.statements) {
        if (!ts.isFunctionDeclaration(stmt)) continue;
        const param = stmt.parameters[0];
        if (!param || !ts.isObjectBindingPattern(param.name)) continue;

        const params = param.name.elements
            .filter(e => ts.isBindingElement(e) && ts.isIdentifier(e.name))
            .map(e => (e.name as ts.Identifier).text);

        const isAsync = !!(stmt.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword));
        const returnTypeText = stmt.type?.getText() ?? '';
        const returnsSingle = /\bNode\b/.test(returnTypeText)
            && !returnTypeText.includes('Node[]')
            && !returnTypeText.includes('Promise');

        return { params, isAsync, returnsSingle };
    }
    return null;
}

// Deep-synthesize a parsed expression into factory nodes so it can be printed
// in a different source file context without source-text resolution issues.
// source is the original text of the temp file, used to detect quote style.
function synthesizeExpression(node: ts.Expression, source: string): ts.Expression {
    if (ts.isIdentifier(node)) {
        return ts.factory.createIdentifier(node.text);
    }
    if (ts.isStringLiteral(node)) {
        const isSingleQuote = source[node.getStart()] === "'";
        return ts.factory.createStringLiteral(node.text, isSingleQuote);
    }
    if (ts.isNumericLiteral(node)) {
        return ts.factory.createNumericLiteral(node.text);
    }
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
        return ts.factory.createNoSubstitutionTemplateLiteral(node.text, node.rawText);
    }
    if (ts.isTemplateExpression(node)) {
        return ts.factory.createTemplateExpression(
            ts.factory.createTemplateHead(node.head.text, node.head.rawText),
            node.templateSpans.map(span =>
                ts.factory.createTemplateSpan(
                    synthesizeExpression(span.expression, source),
                    ts.isTemplateMiddle(span.literal)
                        ? ts.factory.createTemplateMiddle(span.literal.text, span.literal.rawText)
                        : ts.factory.createTemplateTail(span.literal.text, span.literal.rawText)
                )
            )
        );
    }
    if (ts.isPropertyAccessExpression(node)) {
        return ts.factory.createPropertyAccessExpression(
            synthesizeExpression(node.expression, source),
            node.name.text
        );
    }
    if (ts.isCallExpression(node)) {
        return ts.factory.createCallExpression(
            synthesizeExpression(node.expression as ts.Expression, source),
            undefined,
            node.arguments.map(a => synthesizeExpression(a as ts.Expression, source))
        );
    }
    if (ts.isParenthesizedExpression(node)) {
        return ts.factory.createParenthesizedExpression(synthesizeExpression(node.expression, source));
    }
    return node;
}

function createValueExpression(val: unknown): ts.Expression {
    if (typeof val === 'number') return ts.factory.createNumericLiteral(val);
    if (typeof val === 'boolean') return val ? ts.factory.createTrue() : ts.factory.createFalse();
    if (Array.isArray(val)) {
        return ts.factory.createArrayLiteralExpression(val.map(createValueExpression));
    }
    if (typeof val === 'string') {
        if (val.startsWith('`')) {
            // Template literals with expressions are stored as raw source — parse then
            // deep-synthesize so nodes aren't bound to the temporary source file.
            const sf = ts.createSourceFile('tmp.ts', val, ts.ScriptTarget.Latest, true);
            const stmt = sf.statements[0];
            if (ts.isExpressionStatement(stmt)) return synthesizeExpression(stmt.expression, val);
        }
        return ts.factory.createNoSubstitutionTemplateLiteral(val);
    }
    return ts.factory.createStringLiteral(String(val));
}

function call(name: string | ts.Expression, args: ts.Expression[]): ts.CallExpression {
    const expr = typeof name === 'string' ? ts.factory.createIdentifier(name) : name;
    return ts.factory.createCallExpression(expr, undefined, args);
}

function propAccess(obj: string, prop: string): ts.PropertyAccessExpression {
    return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(obj), prop);
}

function createCase0(node: ScriptNode | undefined): ts.CaseClause {
    const x = node?.x ?? 1;
    const y = node?.y ?? 1;
    const w = node?.width ?? '-';
    const h = node?.height ?? '-';
    const posComment = ` ${x} ${y} ${w} ${h}`;

    const noop = ts.factory.createStringLiteral('noop');

    const ifStmt = ts.factory.createIfStatement(
        call(propAccess('state', 'has'), [noop]),
        ts.factory.createBlock([
            ts.factory.createExpressionStatement(
                call(propAccess('stack', 'unshift'), [call(propAccess('state', 'get'), [ts.factory.createStringLiteral('noop')])])
            ),
            ts.factory.createExpressionStatement(
                call(propAccess('state', 'delete'), [ts.factory.createStringLiteral('noop')])
            ),
            ts.factory.createContinueStatement(),
        ], true)
    );
    ts.addSyntheticLeadingComment(ifStmt, ts.SyntaxKind.SingleLineCommentTrivia, posComment, true);
    addDescriptionComments(ifStmt, node?.description);

    return ts.factory.createCaseClause(ts.factory.createNumericLiteral(0), [
        ifStmt,
        ts.factory.createBreakStatement(ts.factory.createIdentifier('loop')),
    ]);
}

function addDescriptionComments(node: ts.Node, description: string | undefined): void {
    if (!description) return;
    for (const line of description.split('\n')) {
        ts.addSyntheticLeadingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, ` ${line}`, true);
    }
}

function createNodeCase(node: ScriptNode, sig: NodeSignature | null): ts.CaseClause {
    const posComment = ` ${node.x ?? '-'} ${node.y ?? '-'} ${node.width ?? '-'} ${node.height ?? '-'}`;

    if (node.type === 'include') {
        const scriptName = node.args.script as string;
        const awaitStmt = ts.factory.createExpressionStatement(
            ts.factory.createAwaitExpression(call(`run${scriptName}`, [ts.factory.createIdentifier('state')]))
        );
        ts.addSyntheticLeadingComment(awaitStmt, ts.SyntaxKind.SingleLineCommentTrivia, posComment, true);
        addDescriptionComments(awaitStmt, node.description);
        return ts.factory.createCaseClause(ts.factory.createNumericLiteral(node.id), [
            awaitStmt,
            ts.factory.createExpressionStatement(
                call(propAccess('stack', 'unshift'), [
                    ts.factory.createSpreadElement(ts.factory.createArrayLiteralExpression([ts.factory.createNumericLiteral(0)]))
                ])
            ),
            ts.factory.createBreakStatement(),
        ]);
    }

    const rVar = `r${node.id}`;
    const runtimeInSig = (sig?.params ?? []).filter(p => RUNTIME_PARAMS.has(p));

    const properties: ts.ObjectLiteralElementLike[] = [
        ...runtimeInSig.map(p =>
            p === 'node'
                ? ts.factory.createPropertyAssignment('node', ts.factory.createNumericLiteral(node.id))
                : ts.factory.createShorthandPropertyAssignment(p)
        ),
        ...Object.entries(node.args).map(([k, v]) =>
            ts.factory.createPropertyAssignment(k, createValueExpression(v))
        ),
    ];

    const callExpr = call(node.type!, [ts.factory.createObjectLiteralExpression(properties, true)]);
    const initExpr = sig?.isAsync ? ts.factory.createAwaitExpression(callExpr) : callExpr;

    const varStmt = ts.factory.createVariableStatement(undefined,
        ts.factory.createVariableDeclarationList(
            [ts.factory.createVariableDeclaration(rVar, undefined, undefined, initExpr)],
            ts.NodeFlags.Const
        )
    );
    ts.addSyntheticLeadingComment(varStmt, ts.SyntaxKind.SingleLineCommentTrivia, posComment, true);
    addDescriptionComments(varStmt, node.description);

    const spreadArg = sig?.returnsSingle
        ? ts.factory.createIdentifier(rVar)
        : ts.factory.createSpreadElement(ts.factory.createIdentifier(rVar));

    return ts.factory.createCaseClause(ts.factory.createNumericLiteral(node.id), [
        varStmt,
        ts.factory.createExpressionStatement(call(propAccess('stack', 'unshift'), [spreadArg])),
        sig?.isAsync ? ts.factory.createContinueStatement() : ts.factory.createBreakStatement(),
    ]);
}

function createRunFunction(script: ParsedScript, nodesDir: string): ts.FunctionDeclaration {
    const nodeArrayType = ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode('Node'));

    const node0 = script.nodes.find(n => n.id === 0);
    const cases: ts.CaseOrDefaultClause[] = [
        createCase0(node0),
        ...script.nodes.filter(n => n.id !== 0).map(n => createNodeCase(n, n.type !== 'include' ? readNodeSignature(nodesDir, n.type!) : null)),
    ];

    const loopBody = ts.factory.createBlock([
        ts.factory.createVariableStatement(undefined,
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration('node', undefined, undefined,
                    ts.factory.createBinaryExpression(
                        call(propAccess('stack', 'shift'), []),
                        ts.factory.createToken(ts.SyntaxKind.BarBarToken),
                        ts.factory.createNumericLiteral(0)
                    )
                )],
                ts.NodeFlags.Const
            )
        ),
        ts.factory.createExpressionStatement(call(propAccess('callstack', 'push'), [ts.factory.createIdentifier('node')])),
        ts.factory.createSwitchStatement(ts.factory.createIdentifier('node'), ts.factory.createCaseBlock(cases)),
        ts.factory.createExpressionStatement(call(propAccess('callstack', 'shift'), [])),
    ], true);

    const fnBody = ts.factory.createBlock([
        ts.factory.createVariableStatement(undefined,
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration('stack', undefined, nodeArrayType,
                    ts.factory.createArrayLiteralExpression(
                        ((node0?.args?.nodes ?? [1]) as number[]).map(n => ts.factory.createNumericLiteral(n))
                    )
                )],
                ts.NodeFlags.Const
            )
        ),
        ts.factory.createVariableStatement(undefined,
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration('callstack', undefined, nodeArrayType,
                    ts.factory.createArrayLiteralExpression([])
                )],
                ts.NodeFlags.Const
            )
        ),
        ts.factory.createLabeledStatement('loop', ts.factory.createWhileStatement(ts.factory.createTrue(), loopBody)),
        ts.factory.createReturnStatement(ts.factory.createIdentifier('state')),
    ], true);

    return ts.factory.createFunctionDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
        undefined, 'run', undefined,
        [ts.factory.createParameterDeclaration(undefined, undefined, 'state', undefined,
            ts.factory.createTypeReferenceNode('State'))],
        ts.factory.createTypeReferenceNode('Promise', [ts.factory.createTypeReferenceNode('State')]),
        fnBody
    );
}

export function writeScript(script: ParsedScript, nodesDir: string): string {
    const nodeTypes = [...new Set(script.nodes.filter(n => n.type && n.type !== 'include').map(n => n.type as string))];
    const includeScripts = script.nodes.filter(n => n.type === 'include').map(n => n.args.script as string);

    const statements: ts.Statement[] = [
        ts.factory.createImportDeclaration(undefined,
            ts.factory.createImportClause(ts.SyntaxKind.TypeKeyword, undefined,
                ts.factory.createNamedImports(['Node', 'State'].map(name =>
                    ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(name))
                ))
            ),
            ts.factory.createStringLiteral('../nodes/node')
        ),
        ...nodeTypes.map(typeName =>
            ts.factory.createImportDeclaration(undefined,
                ts.factory.createImportClause(undefined, undefined,
                    ts.factory.createNamedImports([
                        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(typeName))
                    ])
                ),
                ts.factory.createStringLiteral(`../nodes/${typeName.charAt(0).toLowerCase()}${typeName.slice(1)}`)
            )
        ),
        ...includeScripts.map(scriptName =>
            ts.factory.createImportDeclaration(undefined,
                ts.factory.createImportClause(undefined, undefined,
                    ts.factory.createNamedImports([
                        ts.factory.createImportSpecifier(
                            false,
                            ts.factory.createIdentifier('run'),
                            ts.factory.createIdentifier(`run${scriptName}`)
                        )
                    ])
                ),
                ts.factory.createStringLiteral(`./${scriptName.charAt(0).toLowerCase()}${scriptName.slice(1)}`)
            )
        ),
    ];

    let runFn = createRunFunction(script, nodesDir);

    // Attach file-level metadata as synthetic leading comments on the run function
    const leadingComments: string[] = [];
    for (const [key, val] of Object.entries(script.initialState)) {
        leadingComments.push(` ${key}: "${val}"`);
    }
    for (const comment of script.comments) {
        const { x, y, width, height } = comment;
        leadingComments.push(` ${x} ${y} ${width ?? '-'} ${height ?? '-'}`);
        for (const line of comment.text.split('\n').filter(Boolean)) {
            leadingComments.push(` ${line}`);
        }
    }
    for (const text of leadingComments) {
        runFn = ts.addSyntheticLeadingComment(runFn, ts.SyntaxKind.SingleLineCommentTrivia, text, true);
    }

    statements.push(runFn);

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const resultFile = ts.factory.updateSourceFile(
        ts.createSourceFile('output.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS),
        statements
    );
    return printer.printFile(resultFile);
}
