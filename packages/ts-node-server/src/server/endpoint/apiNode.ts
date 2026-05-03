import { IncomingMessage, ServerResponse } from 'http';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parseNode } from '../utils/parseNode.js';

const nodesDir = resolve(fileURLToPath(import.meta.url), '../../../../../../src/nodes');

export async function getApiNodes(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
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

export function getApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}

export function postApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}

export function patchApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const id = req.url.match(/^\/api\/node\/(\d+)$/)[1];
    res.end(id);
}

export function deleteApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}
