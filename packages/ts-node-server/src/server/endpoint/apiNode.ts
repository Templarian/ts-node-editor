import { IncomingMessage, ServerResponse } from 'http';

export function getApiNodes(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    // Parse all TS files everytime here
    const output = [
        {
            name: 'coinFlip',
            displayName: 'Coin Flip',
            width: 6,
            height: 6,
            fields: [{
                name: 'nodes',
                displayName: null,
                type: 'Node',
                isArray: true
            }]
        },
        {
            name: 'setState',
            displayName: 'Set Variable',
            width: 6,
            height: 6,
            fields: [{
                name: 't',
                displayName: 'True',
                type: 'Node',
                isArray: true
            }, {
                name: 'f',
                displayName: 'False',
                type: 'Node',
                isArray: true
            }]
        }
    ];
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
