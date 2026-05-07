#!/usr/bin/env node
import { createServer } from 'http';
import type { Req, Res } from './utils/types.js';
import { getApi } from './endpoint/api.js';
import { getIndex, getStyles, getClient } from './endpoint/app.js';
import { getApiComment, postApiComment, patchApiComment, deleteApiComment } from './endpoint/apiComment.js';
import { getApiNodes, getApiNode, postApiNode, patchApiNode, deleteApiNode } from './endpoint/apiNode.js';
import { attachScriptNodeToArg, getGit, getScript, getScriptNode, postScript, removeScriptNodeToArg } from './endpoint/apiScript.js';

type Handler = (params: any, req: Req, res: Res) => void | Promise<void>;
type Routes = Record<string, Partial<Record<string, Handler>>>;

const CLIENT_JS = /^\/(client\.js|element\/.+\.js|utils\/.+\.js)$/;

const routes: Routes = {
    '/': {
        GET: getIndex,
    },
    '/styles.css': {
        GET: getStyles,
    },
    '/api': {
        GET: getApi,
    },
    '/api/git': {
        GET: getGit,
    },
    '/api/comment': {
        POST: postApiComment,
    },
    '/api/comment/:id': {
        GET:    getApiComment,
        PATCH:  patchApiComment,
        DELETE: deleteApiComment,
    },
    '/api/nodes': {
        GET: getApiNodes,
    },
    '/api/node': {
        POST: postApiNode,
    },
    '/api/node/:id': {
        GET:    getApiNode,
        PATCH:  patchApiNode,
        DELETE: deleteApiNode,
    },
    '/api/scripts/:name/nodes/:index/args/:arg': {
        POST:   attachScriptNodeToArg,
        DELETE: removeScriptNodeToArg,
    },
    '/api/scripts/:name/nodes/:index': {
        GET: getScriptNode,
    },
    '/api/scripts/:name': {
        GET:  getScript,
        POST: postScript,
    },
};

function match(url: string, pattern: string): Record<string, string> | null {
    const regexStr = pattern
        .split(/(:[\w]+)/g)
        .map((part, i) => i % 2 === 0
            ? part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            : `(?<${part.slice(1)}>[^/]+)`)
        .join('');
    const m = url?.match(new RegExp(`^${regexStr}$`));
    return m ? { ...m.groups } : null;
}

console.log('Server Started: localhost:3002');

createServer((req, res) => {
    console.log(`- Request: ${req.url}`);
    const url = req.url ?? '';
    const method = req.method ?? '';

    if (CLIENT_JS.test(url)) {
        if (method === 'GET') getClient(req, res);
        return;
    }

    for (const [pattern, methods] of Object.entries(routes)) {
        const params = match(url, pattern);
        if (params === null) continue;

        const handler = methods[method];
        if (handler) {
            Promise.resolve(handler(params, req, res)).catch(err => {
                res.statusCode = 500;
                res.end(String(err));
            });
        }
        return;
    }

    res.statusCode = 404;
    res.end('Page not found!');
}).listen(3002);
