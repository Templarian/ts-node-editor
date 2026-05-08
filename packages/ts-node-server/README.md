# ts-node-server

The server controls all the endpoints and serving the initial application's compiled content.

```bash
npm start
```

- `/playground` serves `ts-node-playground/index.html`

## Endpoints

### `GET` `api/nodes`

Returns a list of all nodes.

```json
[{
    "name": "between",
    "description": "Between"
}]
```

### `GET` `api/nodes/:nodeName`

Parse the node a easy to read JSON format.

```json
[{
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
}]
```

### `GET` `api/nodes/:name/compiled`

Get a node's TypeScript compiled javascript.

### `GET` `api/scripts`

Returns an array of script names and description (this is node 0's entry comment). If node 0 does not have a comment `description` will be null.

```json
[{
    "name": "demoCoinFlip",
    "description": "Simple coin flip demo."
}]
```

### `GET` `api/scripts/:scriptName`

Using the `ts-node-parser` this will get a script's serialized JSON.

### `PATCH` `api/scripts/:scriptName/nodes/:id`

Updates any of the node's data. The properties that can be updated are:

```typescript
interface PatchNode {
    x: number,
    y: number,
    width: number | null,
    height: number | null,
    description: string | null
}
```

### `POST` `api/scripts/:scriptName/nodes`

Add a node to an existing script.

- 401 if not script is found

```typescript
interface PostNode {
    x: number,
    y: number,
    width: number | null,
    height: number | null,
    description: string | null,
    type: string,
    args: Record<string, any>
}
```

### `PUT` `api/scripts/:scriptName/nodes/:index/args/:argKey`

Update a value.

```typescript
interface PutScriptNodeArgs {
  value: string | number | boolean
}
```

### `POST` `api/scripts/:scriptName/nodes/:id/args/:argKey`

Post can only be used on args of array type.

- 401 on any args that are not array type

```typescript
interface PostScriptNodeArgs {
  value: string | number | boolean
}
```

### `DELETE` `api/scripts/:scriptName/nodes/:id/args/:argKey`

Delete can only be used on args of array type. For instance array.

- 401 on any args that are not array type

```typescript
interface DeleteScriptNodeArgs {
  value: string | number
}
```


### `POST` `api/scripts`

Create a new script. If the name exists it will throw a `401`. Only the entry node 0 should exist with the description.

```typescript
interface PostScript {
    name: string,
    description: number
}
```

### `PATCH` `api/scripts/:scriptName`

This handles renaming an existing script.

```typescript
interface PatchScript {
    name: string,
}
```
