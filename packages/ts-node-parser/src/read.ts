import * as ts from 'typescript';
import * as path from 'path';

export interface Position {
    x: number;
    y: number;
}

export interface ScriptNode {
    id: number;
    position: Position | null;
    type: string;
    args: Record<string, unknown>;
}

export interface ParsedScript {
    name: string;
    entryPosition: Position | null;
    description: string;
    initialState: Record<string, string>;
    imports: string[];
    nodes: ScriptNode[];
}

const RUNTIME_PARAMS = new Set(['state', 'node', 'callstack']);

function commentText(range: ts.CommentRange, source: string): string {
    if (range.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
        return source.substring(range.pos + 2, range.end).trim();
    }
    return source.substring(range.pos + 2, range.end - 2).trim();
}

function parsePosition(text: string): Position | null {
    const m = text.match(/^(\d+)\s+(\d+)\s+-\s+-/);
    return m ? { x: parseInt(m[1], 10), y: parseInt(m[2], 10) } : null;
}

function extractValue(node: ts.Expression, source: string): unknown {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        return node.text;
    }
    if (ts.isNumericLiteral(node)) {
        return parseFloat(node.text);
    }
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isArrayLiteralExpression(node)) {
        return node.elements.map(e => extractValue(e, source));
    }
    if (ts.isTemplateLiteral(node)) {
        return source.substring(node.getStart(), node.getEnd());
    }
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
        return -parseFloat((node.operand as ts.NumericLiteral).text);
    }
    return source.substring(node.getStart(), node.getEnd());
}

function extractObjLiteralArgs(obj: ts.ObjectLiteralExpression, source: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const prop of obj.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key = ts.isIdentifier(prop.name) ? prop.name.text : null;
        if (!key || RUNTIME_PARAMS.has(key)) continue;
        result[key] = extractValue(prop.initializer, source);
    }
    return result;
}

function extractCallInfo(stmt: ts.Statement, source: string): { type: string; args: Record<string, unknown> } | null {
    let callExpr: ts.CallExpression | null = null;
    let isStandaloneCall = false;

    if (ts.isVariableStatement(stmt)) {
        let init = stmt.declarationList.declarations[0]?.initializer;
        if (!init) return null;
        if (ts.isAwaitExpression(init)) init = init.expression;
        if (ts.isCallExpression(init)) callExpr = init;
    } else if (ts.isExpressionStatement(stmt)) {
        let expr = stmt.expression;
        if (ts.isAwaitExpression(expr)) expr = expr.expression;
        if (ts.isCallExpression(expr)) {
            callExpr = expr;
            isStandaloneCall = true;
        }
    }

    if (!callExpr) return null;

    const fnName = ts.isIdentifier(callExpr.expression) ? callExpr.expression.text : null;
    if (!fnName) return null;

    // Script include pattern: await runXxx(state)
    if (isStandaloneCall && fnName.startsWith('run')) {
        return { type: 'include', args: { script: fnName.replace(/^run/, '') } };
    }

    const objArg = callExpr.arguments[0];
    const args = objArg && ts.isObjectLiteralExpression(objArg)
        ? extractObjLiteralArgs(objArg, source)
        : {};

    return { type: fnName, args };
}

function findSwitchStatement(node: ts.Node): ts.SwitchStatement | null {
    if (ts.isSwitchStatement(node)) return node;
    let found: ts.SwitchStatement | null = null;
    ts.forEachChild(node, child => {
        if (!found) found = findSwitchStatement(child);
    });
    return found;
}

export function parseScript(source: string, name = 'script'): ParsedScript {
    const sf = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);

    const parsed: ParsedScript = {
        name: path.basename(name, '.ts'),
        entryPosition: null,
        description: '',
        initialState: {},
        imports: [],
        nodes: [],
    };

    // Extract metadata comments that appear between the imports and the run function.
    // In the TS AST these are leading trivia of the function declaration.
    const runFn = sf.statements.find(
        s => ts.isFunctionDeclaration(s) || ts.isExportAssignment(s)
    ) ?? sf.statements[sf.statements.length - 1];

    if (runFn) {
        const ranges = ts.getLeadingCommentRanges(source, runFn.getFullStart()) ?? [];
        const descLines: string[] = [];
        for (const range of ranges) {
            const text = commentText(range, source);
            const pos = parsePosition(text);
            if (pos && !parsed.entryPosition) {
                parsed.entryPosition = pos;
                continue;
            }
            const stateMatch = text.match(/^(\w+):\s+"(.*)"/);
            if (stateMatch) {
                parsed.initialState[stateMatch[1]] = stateMatch[2];
                continue;
            }
            descLines.push(text);
        }
        parsed.description = descLines.join('\n').trim();
    }

    for (const stmt of sf.statements) {
        if (!ts.isImportDeclaration(stmt)) continue;
        const mod = stmt.moduleSpecifier;
        if (!ts.isStringLiteral(mod)) continue;
        if (mod.text.includes('/nodes/')) {
            const nodeName = path.basename(mod.text);
            if (!parsed.imports.includes(nodeName)) {
                parsed.imports.push(nodeName);
            }
        }
    }

    const switchStmt = findSwitchStatement(sf);
    if (!switchStmt) return parsed;

    for (const clause of switchStmt.caseBlock.clauses) {
        if (!ts.isCaseClause(clause)) continue;
        const caseExpr = clause.expression;
        if (!ts.isNumericLiteral(caseExpr)) continue;
        const id = parseInt(caseExpr.text, 10);

        // Skip case 0 — it's the exit/entry handler boilerplate
        if (id === 0) continue;

        const stmts = clause.statements.filter(
            s => !ts.isBreakStatement(s) && !ts.isContinueStatement(s)
        );
        if (stmts.length === 0) continue;

        const firstStmt = stmts[0];
        const ranges = ts.getLeadingCommentRanges(source, firstStmt.getFullStart()) ?? [];
        let position: Position | null = null;
        for (const r of ranges) {
            position = parsePosition(commentText(r, source));
            if (position) break;
        }

        const callInfo = extractCallInfo(firstStmt, source);
        if (!callInfo) continue;

        parsed.nodes.push({ id, position, type: callInfo.type, args: callInfo.args });
    }

    return parsed;
}
