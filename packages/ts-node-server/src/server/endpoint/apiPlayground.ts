import { readFile } from 'fs/promises';
import type { Req, Res } from '../utils/types.js';
import { playgroundHtml } from '../utils/paths.js';

export async function getPlayground(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'text/html');
    res.end(await readFile(playgroundHtml, 'utf-8'));
}
