import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { parseScripts } from './testUtils';
import { parseScript } from './read';
import { writeScript } from './write';

const scriptsDir = path.resolve(__dirname, '../../../src/scripts');
const nodesDir = path.resolve(__dirname, '../../../src/nodes');

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
            const source = writeScript(script, nodesDir);
            const reparsed = parseScript(source, script.name);
            expect(reparsed).toEqual(script);
        }
    });
});
