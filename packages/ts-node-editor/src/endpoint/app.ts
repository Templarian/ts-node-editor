import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

export function getIndex(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/html');
    res.end(readFileSync(join(__dirname, '..', '..', 'src', 'index.html')));
}

export function getStyles(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/css');
    res.end(readFileSync(join(__dirname, '..', '..', 'src', 'styles.css')));
}