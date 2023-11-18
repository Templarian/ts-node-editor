import { IncomingMessage, ServerResponse } from 'http';
import {
    existsSync,
    readdirSync,
    lstatSync,
    createReadStream
} from 'fs';
import {
    join
} from 'path';

// All scripts have to start with a node definition
const startScriptOrNode = 'import type { Node } from ';

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

function isValidNodeOrScript(filename) {
    var readable = createReadStream(filename, {
        encoding: 'utf8',
        fd: null,
    });
    readable.on('readable', function() {
      var chunk;
      while (null !== (chunk = readable.read(1) /* here */)) {
        console.log(chunk); // chunk is one byte
      }
    });
}

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
