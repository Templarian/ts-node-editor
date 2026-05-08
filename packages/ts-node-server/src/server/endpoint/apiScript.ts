import { existsSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';
import { parseScript, writeScript, type ScriptNode } from 'ts-node-parser';
import Script, { ScriptComment, type ScriptJson } from '../utils/script.js';
import type { Req, Res } from '../utils/types.js';
import { scriptsDir, gitFile } from '../utils/paths.js';

export async function getScripts(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const files = await readdir(scriptsDir);
    const scripts = await Promise.all(
        files
            .filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'))
            .map(async f => {
                const name = basename(f, '.ts');
                const source = await readFile(join(scriptsDir, f), 'utf-8');
                const script = parseScript(source);
                const description = script.nodes.find((n: { id: number }) => n.id === 0)?.description ?? '';
                return { name, description };
            })
    );
    res.end(JSON.stringify(scripts));
}

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

export function postScriptComments(
    { name }: { name: string },
    req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const comment: ScriptComment = JSON.parse(body);
        const filePath = join(scriptsDir, `${name}.ts`);
        if (!existsSync(filePath)) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Script not found.' }));
            return;
        }
        const source = await readFile(filePath, 'utf-8');
        const script = parseScript(source);
        script.comments.push(comment);
        await writeFile(filePath, writeScript(script, scriptsDir));
        res.end(JSON.stringify(comment));
    });
}

export function patchScriptComments(
    { name, index }: { name: string; index: string },
    req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        const partial: Partial<ScriptComment> = JSON.parse(body);
        const filePath = join(scriptsDir, `${name}.ts`);
        if (!existsSync(filePath)) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Script not found.' }));
            return;
        }
        const source = await readFile(filePath, 'utf-8');
        const script = parseScript(source);
        const i = Number(index);
        if (i < 0 || i >= script.comments.length) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: 'Comment not found.' }));
            return;
        }
        script.comments[i] = { ...script.comments[i], ...partial };
        await writeFile(filePath, writeScript(script, scriptsDir));
        res.end(JSON.stringify(script.comments[i]));
    });
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

