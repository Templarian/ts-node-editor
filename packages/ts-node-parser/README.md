# ts-node-parser

Parses and generates TypeScript state machine scripts used by the ts-node-editor runtime.

## Overview

Scripts are TypeScript files that encode a stack-based state machine as a `switch` statement. Each `case` calls a node function (from `src/nodes/`) and pushes the next node IDs onto the stack. `parseScript` reads a script's source into a plain JSON object; `writeScript` takes that object and generates the TypeScript source back.

## `parseScript(source, name?)`

Parses a script's TypeScript source string using the TypeScript AST and returns a `ParsedScript` object.

```ts
import { parseScript } from 'ts-node-parser';
import { readFileSync } from 'fs';

const source = readFileSync('src/scripts/helloWorld.ts', 'utf-8');
const script = parseScript(source, 'helloWorld');
```

**`ParsedScript` shape:**

```json
{
  "name": "helloWorld",
  "entryPosition": { "x": 0, "y": 5 },
  "description": "The hello world script takes in a name.",
  "initialState": { "name": "John" },
  "imports": ["node", "setState"],
  "nodes": [
    {
      "id": 1,
      "position": { "x": 4, "y": 1 },
      "type": "setState",
      "args": {
        "nodes": [0],
        "key": "message",
        "value": "`Hello ${state.get('name')}!`"
      }
    }
  ]
}
```

| Field | Description |
|---|---|
| `name` | Script filename without `.ts` |
| `entryPosition` | Grid position of the entry node, from the `// x y - -` file comment |
| `description` | Free-text description from comments between imports and the `run` function |
| `initialState` | Key/value pairs from `// key: "value"` comments |
| `imports` | Node module names imported from `../nodes/` |
| `nodes` | Each non-boilerplate `case` in the switch statement |
| `nodes[].id` | The case number |
| `nodes[].position` | Grid position from the `// x y - -` inline comment |
| `nodes[].type` | The node function name (e.g. `setState`, `log`, `coinFlip`) or `"include"` for script calls |
| `nodes[].args` | All non-runtime arguments passed to the node function. Runtime params (`state`, `node`, `callstack`) are stripped. `nodes`, `t`, `f` etc. are kept as they encode the graph edges. |

## `writeScript(script, nodesDir)`

Takes a `ParsedScript` object and generates TypeScript source using `ts.factory`. Reads each node's function signature from `nodesDir` to determine which runtime parameters (`state`, `node`, `callstack`) to re-inject and whether to use `await`/`continue` or `break`.

```ts
import { parseScript, writeScript } from 'ts-node-parser';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const source = readFileSync('src/scripts/helloWorld.ts', 'utf-8');
const script = parseScript(source, 'helloWorld');

// Modify the script
script.nodes[0].args.value = '`Hi ${state.get("name")}!`';

const output = writeScript(script, path.resolve('src/nodes'));
writeFileSync('src/scripts/helloWorld.ts', output);
```

`parseScript(writeScript(script, nodesDir))` round-trips cleanly — the parsed result is identical to the original.
