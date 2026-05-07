import { IncomingMessage, ServerResponse } from 'http';
import { existsSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parseScript, writeScript } from 'ts-node-parser';
import Script, { type ScriptJson } from '../utils/script.js';

const scriptsDir = resolve(fileURLToPath(import.meta.url), '../../../../../../src/scripts');
const nodesDir = resolve(fileURLToPath(import.meta.url), '../../../../../../src/nodes');

export function getGit(
    _req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(existsSync('.git')));
}

export async function getScript(
    name,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const source = await readFile(join(scriptsDir, `${name}.ts`), 'utf-8');
    const obj = parseScript(source);
    res.end(JSON.stringify(obj));
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
