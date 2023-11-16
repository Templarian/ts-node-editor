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

}

export function deleteApiNode(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}
