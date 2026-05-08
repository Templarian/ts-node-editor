# ts-node-server

The server controls all the endpoints and serving the initial application's compiled content.

```bash
npm start
```

- `/playground` serves `ts-node-playground/index.html`

## Endpoints

### `GET` `api`

Returns an example script JSON structure (demo data).

### `GET` `api/git`

Returns `true` if the git file exists, `false` otherwise.

---

### `GET` `api/nodes`

Returns a list of all nodes.

```json
[{
    "name": "between",
    "description": "Between"
}]
```

### `GET` `api/nodes/:name`

Parse the node into an easy to read JSON format.

- 401 if the node is not found

```json
{
    "name": "between",
    "description": "Between",
    "editor": null,
    "args": [{
        "key": "min",
        "label": "Min",
        "editor": "Number"
    }, {
        "key": "max",
        "label": "Max",
        "editor": "Number"
    }],
    "nodes": [{
        "key": "t",
        "label": "True"
    }, {
        "key": "f",
        "label": "False"
    }]
}
```

### `GET` `api/nodes/:name/source`

Get a node's raw TypeScript source as a JSON string.

- 401 if the node is not found

### `GET` `api/nodes/:name/compiled`

Get a node's TypeScript compiled to JavaScript as a JSON string.

- 401 if the node is not found

---

### `GET` `api/scripts`

Returns an array of script names and descriptions (node 0's description). If node 0 does not have a description, `description` will be an empty string.

```json
[{
    "name": "demoCoinFlip",
    "description": "Simple coin flip demo."
}]
```

### `GET` `api/scripts/:name`

Using the `ts-node-parser` this will get a script's serialized JSON.

- 401 if the script is not found

### `POST` `api/scripts/:name`

Create a new script. If the name exists it will throw a `401`.

```typescript
interface PostScript {
    name: string,
    description: string
}
```

### `GET` `api/scripts/:name/nodes/:index`

Get a single node from a script by its id.

- 401 if the script or node is not found

### `POST` `api/scripts/:name/nodes/:index/args/:arg`

Attach a node id to an array-type arg on a script node.

- 401 if the script or node is not found

```typescript
interface AttachScriptNodeArg {
    nodeId: number
}
```

### `DELETE` `api/scripts/:name/nodes/:index/args/:arg`

Remove a node id from an array-type arg on a script node.

- 401 if the script or node is not found

```typescript
interface RemoveScriptNodeArg {
    nodeId: number
}
```

### `GET` `api/scripts/:name/comments`

Returns all comments for a script.

- 401 if the script is not found

```typescript
interface ScriptComment {
    x: number,
    y: number,
    width?: number,
    height?: number,
    text: string
}
```

### `POST` `api/scripts/:name/comments`

Add a new comment to a script.

- 401 if the script is not found

```typescript
interface ScriptComment {
    x: number,
    y: number,
    width?: number,
    height?: number,
    text: string
}
```

### `PATCH` `api/scripts/:name/comments/:index`

Update an existing comment by index.

- 401 if the script or comment index is not found

```typescript
type PatchScriptComment = Partial<ScriptComment>
```

### `DELETE` `api/scripts/:name/comments/:index`

Remove a comment by index.

- 401 if the script or comment index is not found
