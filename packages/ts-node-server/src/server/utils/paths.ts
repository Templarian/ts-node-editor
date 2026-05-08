import { resolve } from 'path';
import { fileURLToPath } from 'url';

const root = '../../../../../..';
export const gitFile = resolve(fileURLToPath(import.meta.url), root, '.git');
export const scriptsDir = resolve(fileURLToPath(import.meta.url), root, 'src/scripts');
export const nodesDir = resolve(fileURLToPath(import.meta.url), root, 'src/nodes');
export const playgroundHtml = resolve(fileURLToPath(import.meta.url), root, 'packages/ts-node-playground/index.html');