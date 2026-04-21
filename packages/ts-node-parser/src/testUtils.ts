import * as fs from 'fs';
import * as path from 'path';
import { parseScript } from './read';
import type { ParsedScript } from './read';

export function parseScriptFile(filePath: string): ParsedScript {
    return parseScript(fs.readFileSync(filePath, 'utf-8'), filePath);
}

export function parseScripts(dir: string): ParsedScript[] {
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'verify.ts')
        .map(f => path.join(dir, f));
    return files.map(parseScriptFile);
}
