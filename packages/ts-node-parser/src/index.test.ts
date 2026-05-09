import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { parseScripts } from './testUtils';
import { parseScript } from './read';
import { writeScript } from './write';

const scriptsDir = path.resolve(__dirname, '../../../src/scripts');
const nodesDir = path.resolve(__dirname, '../../../src/nodes');

function getNodeSource(nodeName: string): string {
    const fileName = nodeName.charAt(0).toLowerCase() + nodeName.slice(1) + '.ts';
    const filePath = path.join(nodesDir, fileName);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

describe('parseScripts', () => {
    it('parses all scripts', () => {
        const results = parseScripts(scriptsDir);
        expect(results).toMatchSnapshot();
    });
});

describe('writeScript', () => {
    it('round-trips all scripts through parse and write', () => {
        const scripts = parseScripts(scriptsDir);
        for (const script of scripts) {
            const source = writeScript(script, getNodeSource);
            const reparsed = parseScript(source, script.name);
            expect(reparsed).toEqual(script);
        }
    });
});
