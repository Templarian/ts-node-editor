# TypeScript Node Editor

Build self contained TypeScript friendly scripts that can be modified with a no-code node editor.

- 0 dependencies (TypeScript is an assumed peer dependency)
- Lots of example nodes (dialog, decision trees, etc...)
- TS files are updated realtime.

## Install

```
npm install ts-node-editor
```

In the `package.json` add a line in `scripts`: `"editor": "ts-node-editor"`

```
npm run editor
```

> Any file starting with `import type { Node }` is assumed to be a function defining a node or a script.

## Usage

Generated scripts can either be imported normally or dynamically. The Hello World example adds a `message` to the state.

```ts
const { run } = await import('./scripts/helloWorld');
const state = await run({
    name: 'John'
});
console.log(state);
// Map(2) {'name' => 'John', 'message' => 'Hello John!'}
```

This simple example makes use of the [`setState`](./nodes/setState.ts) function to update or set a variables state.

```
npm run editor ./scripts/helloWorld.ts
```

In the editor the `Hello ${name}!` gets transformed into a string literal pulling the `state.get('name')` value.

## Endpoints

```
get    api/
{
    comments: [
        { $x: 1, $x: 10, $width: 10, $height: 10, text: 'Describe the script use here.' }
    ],
    nodes: [
        { $name: 'start', $x: 1, $x: 1, $width: 2, $height: 2, nodes: [2] },
        { $name: 'entry', $x: 3, $x: 2, $width: 10, $height: 10, nodes: [2, 4] },
        { $name: 'coinFlip', $x: 3, $x: 2, $width: 10, $height: 10, t: [2, 4], f: [5] }
    ]
}

delete api/comment/0
put    api/comment
delete api/comment/0
post   api/comment

get    api/node/2
delete api/node/2
post   api/node/2 { $x: 1, $y, 2, $width: 10, $height: 10 }
put    api/node/2 { nodes: [2, 4] }

get    api/scripts
['src/scripts/script1.ts']
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