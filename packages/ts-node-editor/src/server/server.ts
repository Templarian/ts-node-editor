#!/usr/bin/env node

import { createServer } from 'http';
import {
  getApi
} from './endpoint/api';
import {
  getIndex,
  getStyles,
  getClient
} from './endpoint/app';
import {
  getApiComment,
  postApiComment,
  patchApiComment,
  deleteApiComment
} from './endpoint/apiComment';
import {
  getApiNodes,
  getApiNode,
  postApiNode,
  patchApiNode,
  deleteApiNode
} from './endpoint/apiNode';
import {
  getGit,
  getScript
} from './endpoint/apiScript';

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
  } else if (p = req.url.match(/^\/client\.js$/)) {
    if (req.method === "GET") {
      getClient(req, res);
    } else {
      throw new Error('Only get supported for /styles.css');
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
      getApiNodes(req, res);
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
  } else if (req.url.match(/^\/api\/script$/)) {
    if (req.method === 'GET') {
      getScript(req, res);
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
