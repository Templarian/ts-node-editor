import { IncomingMessage, ServerResponse } from 'http';

export function getApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const output = {
        comments: [],
        nodes: []
    };
    res.end(JSON.stringify(output));
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
