import { IncomingMessage, ServerResponse } from 'http';
import { existsSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parseScript, writeScript, type ScriptNode } from 'ts-node-parser';
import Script, { type ScriptJson } from '../utils/script.js';

const root = '../../../../../..';
const scriptsDir = resolve(fileURLToPath(import.meta.url), root, 'src/scripts');
const nodesDir = resolve(fileURLToPath(import.meta.url), root, 'src/nodes');

export function getGit(
    _req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const git = resolve(fileURLToPath(import.meta.url), root, '.git');
    res.end(JSON.stringify(existsSync(git)));
}

export async function getScript(
    name,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const filePath = join(scriptsDir, `${name}.ts`);
    if (!existsSync(filePath)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Script not found.' }));
        return;
    }
    const source = await readFile(filePath, 'utf-8');
    const obj = parseScript(source);
    res.end(JSON.stringify(obj));
}

export async function getScriptNode(
    name,
    index,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
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
    name,
    index,
    arg,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
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
        await writeFile(filePath, writeScript(script, nodesDir));
        res.end(JSON.stringify(true));
    });
}

export function removeScriptNodeToArg(
    name,
    index,
    arg,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
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
        await writeFile(filePath, writeScript(script, nodesDir));
        res.end(JSON.stringify(true));
    });
}

interface PostScriptBody {
    name: string;
    description: string;
}

export function postScript(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const { name, description }: PostScriptBody = JSON.parse(body);
        const fileName = `${name}.ts`;
        const filePath = join(scriptsDir, fileName);
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
        const source = writeScript(new Script(json).toJson(), nodesDir);
        await writeFile(filePath, source);
        res.end(JSON.stringify(true));
    });
}
