import ts from 'typescript';

interface NodeArg {
    key: string;
    label: string;
    editor: string | null;
    value?: unknown;
}

interface NodeConnection {
    key: string;
    label: string;
}

export interface ParsedNode {
    name: string;
    description: string | null;
    editor: string | null;
    async: boolean;
    args: NodeArg[];
    nodes: NodeConnection[];
}

const SPECIAL_PARAMS = new Set(['state', 'node', 'callstack']);

function jsDocDescription(node: ts.Node): string | null {
    const jsDoc = (node as any).jsDoc as ts.JSDoc[] | undefined;
    if (!jsDoc?.length) return null;
    const doc = jsDoc[jsDoc.length - 1];
    if (typeof doc.comment === 'string') return doc.comment.trim() || null;
    if (Array.isArray(doc.comment)) {
        return doc.comment.map((c: any) => c.text ?? '').join('').trim() || null;
    }
    return null;
}

function jsDocEditorTag(node: ts.Node): string | null {
    const tags = ts.getJSDocTags(node);
    const tag = tags.find(t => t.tagName.text === 'editor');
    if (!tag) return null;
    if (typeof tag.comment === 'string') return tag.comment.trim() || null;
    if (Array.isArray(tag.comment)) {
        return tag.comment.map((c: any) => c.text ?? '').join('').trim() || null;
    }
    return null;
}

function extractDefaultValue(expr: ts.Expression): unknown {
    if (ts.isNumericLiteral(expr)) return parseFloat(expr.text);
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
    if (expr.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (expr.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isPrefixUnaryExpression(expr) && expr.operator === ts.SyntaxKind.MinusToken) {
        if (ts.isNumericLiteral(expr.operand)) return -parseFloat((expr.operand as ts.NumericLiteral).text);
    }
    return undefined;
}

function isNodeArray(typeNode: ts.TypeNode | undefined): boolean {
    if (!typeNode) return false;
    if (ts.isArrayTypeNode(typeNode)) {
        const el = typeNode.elementType;
        return ts.isTypeReferenceNode(el) && el.typeName.getText() === 'Node';
    }
    return false;
}

export function parseNode(source: string): ParsedNode | null {
    const sourceFile = ts.createSourceFile('node.ts', source, ts.ScriptTarget.Latest, true);

    let result: ParsedNode | null = null;

    function visit(node: ts.Node) {
        if (ts.isFunctionDeclaration(node) && node.name && !result) {
            const args: NodeArg[] = [];
            const nodes: NodeConnection[] = [];

            const param = node.parameters[0];

            const defaults = new Map<string, unknown>();
            if (param?.name && ts.isObjectBindingPattern(param.name)) {
                for (const element of param.name.elements) {
                    if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name) || !element.initializer) continue;
                    const val = extractDefaultValue(element.initializer);
                    if (val !== undefined) defaults.set(element.name.text, val);
                }
            }

            if (param?.type && ts.isTypeLiteralNode(param.type)) {
                for (const member of param.type.members) {
                    if (!ts.isPropertySignature(member)) continue;
                    const key = member.name.getText(sourceFile);
                    if (SPECIAL_PARAMS.has(key)) continue;

                    const label = jsDocDescription(member) ?? key;
                    if (isNodeArray(member.type)) {
                        nodes.push({ key, label });
                    } else {
                        const arg: NodeArg = { key, label, editor: jsDocEditorTag(member) };
                        if (defaults.has(key)) arg.value = defaults.get(key);
                        args.push(arg);
                    }
                }
            }

            result = {
                name: node.name.text,
                description: jsDocDescription(node),
                editor: jsDocEditorTag(node),
                async: node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) ?? false,
                args,
                nodes,
            };
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return result;
}
