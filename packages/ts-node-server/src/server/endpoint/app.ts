import { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export function getIndex(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/html');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.end(readFileSync(join(__dirname, '..', '..', '..', 'src', 'client', 'index.html')));
}

export function getStyles(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/css');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.end(readFileSync(join(__dirname, '..', '..', '..', 'src', 'client', 'styles.css')));
}

export function getClient(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'text/javascript');
    let m = null;
    const __dirname = dirname(fileURLToPath(import.meta.url));
    if (req.url === '/element/element.js') {
        res.end(readFileSync(join(
            __dirname, '..', '..', '..', '..', '..', 'node_modules',
            '@pictogrammers', 'element', 'dist', 'element.esm.js'
        )));
    } else if (m = req.url.match(/^\/element\/(.+)\/(.+)\.(html|css)\.js$/)) {
        let content = readFileSync(join(__dirname, '..', '..', '..', 'src', 'client', 'element', m[1], `${m[2]}.${m[3]}`)).toString();
        content = content.replace(/`/g, '\\`');
        res.end(`export default \`${content}\`;`);
    } else {
        res.end(readFileSync(join(__dirname, '..', '..', 'client', req.url)));
    }
}
