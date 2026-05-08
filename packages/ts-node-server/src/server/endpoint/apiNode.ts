import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import ts from 'typescript';
import { parseNode } from '../utils/parseNode.js';
import type { Req, Res } from '../utils/types.js';
import { nodesDir } from '../utils/paths.js';

export async function getApiNodes(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const files = (await readdir(nodesDir)).filter(f => f.endsWith('.ts'));
    const output = (await Promise.all(
        files.map(async f => {
            const source = await readFile(join(nodesDir, f), 'utf-8');
            return parseNode(source);
        })
    )).filter(Boolean);
    res.end(JSON.stringify(output));
}

export async function getApiNode(
    { name }: { name: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(nodesDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Node not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    res.end(JSON.stringify(parseNode(source)));
}

export async function getApiNodeSource(
    { name }: { name: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(nodesDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Node not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    res.end(JSON.stringify(source));
}

export async function getApiNodeCompiled(
    { name }: { name: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(nodesDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Node not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
        },
    });
    res.end(JSON.stringify(outputText));
}

export function postApiNode(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {

}

export function patchApiNode(
    { id }: { id: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    res.end(id);
}

export function deleteApiNode(
    { id: _id }: { id: string },
    _req: Req,
    res: Res,
) {

}
