# TypeScript Node Editor

> Note: This is a work in progress.

Build self contained TypeScript friendly scripts that can be modified with a no-code node editor.

- 0 dependencies (TypeScript is an assumed peer dependency)
- No middle layer format. TS files are the source of truth.

Node editors are generally used when visual dipiction of a flow of events would be better understood. Examples include:

- Describing dialog interaction with various branching.
  - Since these may loop back the nodes can be easier followed.
- Data processing flows where nodes process data.

## Install

```bash
npm install ts-node-editor
```

In the `package.json` add a line in `scripts`: `"editor": "ts-node-editor"`

```bash
npm run editor
```

> Any file starting with `import type { Node }` is assumed to be a function defining a node or a script.

## Usage

The node editor is split into Nodes and Scripts TypeScript files.

- Nodes are modular self contained functions.
- Scripts are a braching of nodes and the TypeScript files are what your parent application will execute.

### Scripts

Generated scripts can either be imported normally or dynamically. The [Hello World](./src/scripts/helloWorld.ts) example adds a `message` to the state.

```ts
const { run } = await import('./scripts/helloWorld');
const state = await run({
    name: 'John'
});
console.log(state);
// Map(2) {'name' => 'John', 'message' => 'Hello John!'}
```

This simple example makes use of the [`setState`](./src/nodes/setState.ts) function to update or set a variable's state.

```bash
npm run editor src/scripts/helloWorld.ts
```

In the editor the `Hello ${name}!` gets transformed into a string literal pulling the `state.get('name')` value.

### Node

Every node script starts with the same line importing the `Node` type (an alias for `number`);

```ts
import type { Node } from './node';
```

Define a node by exporting a named function.

- `myNode` - The name of the method can be anything.
- `state` - An optional `Map` type of shared state passed between nodes.
- `nodes` - An optional list of nodes connect to the top right of the node

```ts
/**
 * My Node Name
 */
export function myNode({ state, nodes }: {
    state: Map<string, any>
    nodes: Node[]
}): Node[] {

}
```

All node functions must return an array of nodes. Always return `[0]` instead of an empty array to ensure `noop` correctly loop back.

```ts
    return nodes;
```

## Endpoints

```text
get    api/
{
    comments: [
        { $x: 1, $y: 10, $width: 10, $height: 10, text: 'Describe the script use here.' }
    ],
    nodes: [
        { $name: 'start', $x: 1, $y: 1, $width: 2, $height: 2, nodes: [1] },
        { $name: 'coinFlip', $x: 3, $y: 2, $width: 6, $height: 6, t: [2], f: [3] },
        { $name: 'log', $x: 10, $y: 2, $width: 6, $height: 6, text: 'Heads' },
        { $name: 'log', $x: 10, $y: 7, $width: 6, $height: 6, text: 'Tails' },
    ]
}
post   api/
{
    path: ['src', 'scripts']
    file: 'filename.ts'
}

delete api/comment/0
patch  api/comment/0 { text: 'Updated value.' }
delete api/comment/0
post   api/comment

get    api/node/2
delete api/node/2
post   api/node/2    { $x: 1, $y, 2, $width: 10, $height: 10 }
patch  api/node/2    { nodes: [2, 4] }

get    api/scripts
[{
    name: 'src', directory: [{
        name: 'script', directory: [{
            name: 'script1.ts'
        }]
    }]
}]
post   api/script
{
    path: ['src', 'scripts']
    file: 'filename.ts'
}
```

## TS Wrapper

```ts
const script = new Script();
script.fromFile('filename.ts');
const comments = script.getComments();
const index = script.addComment({
    $x: 1,
    $y: 2,
    $width: 10,
    $height: 10,
    text: 'Awesome!'
});
script.updateComment(1, {
    text: 'New comment text'
});
script.removeComment(2);
const nodes = script.getNodes();
const index = script.addNode({
    $name: 'coinFlip',
    $x: 1,
    $y: 2,
    $width: 10,
    $height: 10,
    t: [2, 4],
    f: [5]
});
script.updateNode(2, {
    $x: 1,
    $y: 2
});
script.removeNode(2);
script.toFile('filename.ts');
```