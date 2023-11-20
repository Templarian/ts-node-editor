import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

export function getIndex(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/html');
    res.end(readFileSync(join(__dirname, '..', '..', '..', 'src', 'client', 'index.html')));
}

export function getStyles(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/css');
    res.end(readFileSync(join(__dirname, '..', '..', '..', 'src', 'client', 'styles.css')));
}

export function getClient(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/javascript');
    res.end(readFileSync(join(__dirname, '..', '..', 'client', 'client.js')));
}
