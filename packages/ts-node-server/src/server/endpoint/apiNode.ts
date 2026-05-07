import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parseNode } from '../utils/parseNode.js';
import type { Req, Res } from '../utils/types.js';

const nodesDir = resolve(fileURLToPath(import.meta.url), '../../../../../../src/nodes');

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

export function getApiNode(
    { id: _id }: { id: string },
    _req: Req,
    res: Res,
) {

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
