import { IncomingMessage, ServerResponse } from 'http';

export function getApi(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    const output = {
        comments: [
            { $x: 1, $y: 10, $width: 10, $height: 10, text: 'Simple CoinFlip example script.' }
        ],
        nodes: [
            { $name: 'start', $x: 1, $y: 1, $width: 2, $height: 2, nodes: [1] },
            { $name: 'coinFlip', $x: 3, $y: 2, $width: 6, $height: 6, t: [2], f: [3] },
            { $name: 'log', $x: 10, $y: 2, $width: 6, $height: 6, text: 'Heads' },
            { $name: 'log', $x: 10, $y: 7, $width: 6, $height: 6, text: 'Tails' },
        ]
    };
    res.end(JSON.stringify(output));
}