import { IncomingMessage, ServerResponse } from 'http';
import {
    existsSync,
    readdirSync,
    lstatSync
} from 'fs';
import {
    join
} from 'path';

function fromDir(startPath, filter) {

    console.log('Starting from dir '+startPath+'/');

    if (!existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    const filenames = [];
    const files = readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = join(startPath, files[i]);
        const stat = lstatSync(filename);
        if (stat.isDirectory()) {
            filenames.push(...fromDir(filename, filter)); //recurse
        } else if (filename.endsWith(filter)) {
            filenames.push(filename);
        };
    };
    return filenames;
};

/**
 * Display a warning if executed outside of a git repo
 */
export function getGit(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(existsSync('.git')));
}

export function getScript(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(fromDir('./src', '.ts')));
}

export function postScript(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }
) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(true));
}
