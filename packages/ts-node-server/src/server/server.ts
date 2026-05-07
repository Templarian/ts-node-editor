#!/usr/bin/env node
import { createServer } from 'http';
import {
  getApi,
} from './endpoint/api.js';
import {
  getIndex,
  getStyles,
  getClient,
} from './endpoint/app.js';
import {
  getApiComment,
  postApiComment,
  patchApiComment,
  deleteApiComment,
} from './endpoint/apiComment.js';
import {
  getApiNodes,
  getApiNode,
  postApiNode,
  patchApiNode,
  deleteApiNode,
} from './endpoint/apiNode.js';
import {
  attachScriptNodeToArg,
  getGit,
  getScript,
  getScriptNode,
  removeScriptNodeToArg,
} from './endpoint/apiScript.js';

console.log('Server Started: localhost:3002');

createServer((req, res) => {
  console.log(`- Request: ${req.url}`);
  let p = null;
  if (p = req.url.match(/^\/$/)) {
    if (req.method === "GET") {
      getIndex(req, res);
    } else {
      throw new Error('Only get supported for /');
    }
  } else if (p = req.url.match(/^\/styles\.css$/)) {
    if (req.method === "GET") {
      getStyles(req, res);
    } else {
      throw new Error('Only get supported for /styles.css');
    }
  } else if (p = req.url.match(/^\/(client\.js|element\/.+\.js|utils\/.+\.js)$/)) {
    if (req.method === "GET") {
      getClient(req, res);
    } else {
      throw new Error('Only get supported for scripts');
    }
  } else if (req.url.match(/^\/api$/)) {
    getApi(req, res);
  } else if (p = req.url.match(/^\/api\/comment$/)) {
    if (req.method === 'POST') {
      postApiComment(req, res);
    }
  } else if (p = req.url.match(/^\/api\/comment\/(\d+)$/)) {
    if (req.method === 'GET') {
      getApiComment(req, res);
    } else if (req.method === 'POST') {
      res.end('Invalid. You meant: /api/comment');
    } else if (req.method === 'PATCH') {
      patchApiComment(req, res);
    } else if (req.method === 'DELETE') {
      deleteApiComment(req, res);
    }
  } else if (p = req.url.match(/^\/api\/node$/)) {
    if (req.method === 'POST') {
      postApiNode(req, res);
    }
  } else if (p = req.url.match(/^\/api\/nodes$/)) {
    if (req.method === 'GET') {
      getApiNodes(req, res).catch(err => { res.statusCode = 500; res.end(String(err)); });
    }
  } else if (p = req.url.match(/^\/api\/node\/(\d+)$/)) {
    if (req.method === 'GET') {
      getApiNode(req, res);
    } else if (req.method === 'POST') {
      res.end('Invalid. You meant: /api/node');
    } else if (req.method === 'PATCH') {
      patchApiNode(req, res);
    } else if (req.method === 'DELETE') {
      deleteApiNode(req, res);
    }
  } else if (p = req.url.match(/^\/api\/scripts\/(?<name>.+)\/nodes\/(?<index>.+)$/)) {
    if (req.method === 'GET') {
      getScriptNode(p.groups.name, p.groups.index, res);
    }
  } else if (p = req.url.match(/^\/api\/scripts\/(?<name>.+)\/nodes\/(?<index>.+)\/args\/(?<arg>.+)$/)) {
    if (req.method === 'POST') {
      attachScriptNodeToArg(p.groups.name, p.groups.index, p.groups.arg, req, res);
    } else if (req.method === 'DELETE') {
      removeScriptNodeToArg(p.groups.name, p.groups.index, p.groups.arg, req, res);
    }
  } else if (p = req.url.match(/^\/api\/scripts\/(?<name>.+)$/)) {
    if (req.method === 'GET') {
      getScript(p.groups.name, res);
    }
  } else if (req.url.match(/^\/api\/git$/)) {
    if (req.method === 'GET') {
      getGit(req, res);
    }
  } else {
      res.statusCode = 404;
      res.end("Page not found!");
  }
}).listen(3002);
