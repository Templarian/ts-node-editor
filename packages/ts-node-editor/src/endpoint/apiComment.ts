import { IncomingMessage, ServerResponse } from 'http';

export function getApiComment(
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

export function postApiComment(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}

export function patchApiComment(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}

export function deleteApiComment(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {

}
