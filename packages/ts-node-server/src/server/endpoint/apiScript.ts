import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { parseScript, writeScript, type ScriptNode } from 'ts-node-parser';
import Script, { type ScriptJson } from '../utils/script.js';
import type { Req, Res } from '../utils/types.js';
import { scriptsDir, gitFile } from '../utils/paths.js';

export async function getScriptComments(
    { name }: { name: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(scriptsDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Script not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    res.end(JSON.stringify(parseScript(source).comments));
}

export function getGit(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(existsSync(gitFile)));
}

export async function getScript(
    { name }: { name: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(scriptsDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Script not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    res.end(JSON.stringify(parseScript(source)));
}

export async function getScriptNode(
    { name, index }: { name: string; index: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(scriptsDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Script not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    const script = parseScript(source);
    const node = script.nodes.find((n: ScriptNode) => n.id === Number(index));
    if (!node) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Node not found.' }));
        return;
    }
    res.end(JSON.stringify(node));
}

export function attachScriptNodeToArg(
    { name, index, arg }: { name: string; index: string; arg: string },
    req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const { nodeId }: { nodeId: number } = JSON.parse(body);
        const filePath = join(scriptsDir, `${name}.ts`);
        if (!existsSync(filePath)) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Script not found.' }));
            return;
        }
        const source = await readFile(filePath, 'utf-8');
        const script = parseScript(source);
        const node = script.nodes.find((n: ScriptNode) => n.id === Number(index));
        if (!node) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Node not found.' }));
            return;
        }
        const list = (node.args[arg] as number[] | undefined) ?? [];
        node.args[arg] = [...list, nodeId];
        await writeFile(filePath, writeScript(script, scriptsDir));
        res.end(JSON.stringify(true));
    });
}

export function removeScriptNodeToArg(
    { name, index, arg }: { name: string; index: string; arg: string },
    req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const { nodeId }: { nodeId: number } = JSON.parse(body);
        const filePath = join(scriptsDir, `${name}.ts`);
        if (!existsSync(filePath)) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Script not found.' }));
            return;
        }
        const source = await readFile(filePath, 'utf-8');
        const script = parseScript(source);
        const node = script.nodes.find((n: ScriptNode) => n.id === Number(index));
        if (!node) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Node not found.' }));
            return;
        }
        const list = (node.args[arg] as number[] | undefined) ?? [];
        node.args[arg] = list.filter(id => id !== nodeId);
        await writeFile(filePath, writeScript(script, scriptsDir));
        res.end(JSON.stringify(true));
    });
}

export function postScript(
    _params: Record<string, string>,
    req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const { name, description }: { name: string; description: string } = JSON.parse(body);
        const filePath = join(scriptsDir, `${name}.ts`);
        if (existsSync(filePath)) {
            res.statusCode = 401;
            res.end(JSON.stringify(`Script "${name}" already exists.`));
            return;
        }
        const json: ScriptJson = {
            name,
            initialState: {},
            comments: [],
            nodes: [{ id: 0, args: { nodes: [1] }, description }],
        };
        await writeFile(filePath, writeScript(new Script(json).toJson(), scriptsDir));
        res.end(JSON.stringify(true));
    });
}

