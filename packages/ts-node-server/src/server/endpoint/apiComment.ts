import type { Req, Res } from '../utils/types.js';

export function getApiComment(
    { id: _id }: { id: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    const output = {
        comments: [],
        nodes: []
    };
    res.end(JSON.stringify(output));
}

export function postApiComment(
    _params: Record<string, string>,
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
}

export function patchApiComment(
    { id }: { id: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
    res.end(id);
}

export function deleteApiComment(
    { id: _id }: { id: string },
    _req: Req,
    res: Res,
) {
    res.setHeader('content-type', 'application/json');
}
