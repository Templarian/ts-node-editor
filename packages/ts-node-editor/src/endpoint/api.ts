import { IncomingMessage, ServerResponse } from 'http';

export function getApi(
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