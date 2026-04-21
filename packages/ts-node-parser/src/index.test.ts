import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { parseScripts } from './testUtils';

const scriptsDir = path.resolve(__dirname, '../../../src/scripts');

describe('parseScripts', () => {
    it('parses all scripts', () => {
        const results = parseScripts(scriptsDir);
        expect(results).toMatchSnapshot();
    });
});
