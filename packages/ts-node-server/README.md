# ts-node-server

The server controls all the endpoints and serving the initial application's compiled content.

## Endpoints

### `GET` `api/nodes`

Parse all of the nodes TS files and return their meta data.

```json
[{
    "name": "between",
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

### `GET` `api/scripts`

Returns an array of script names and description (this is node 0's entry comment). If node 0 does not have a comment `description` will be null.

```json
[{
    "name": "demoCoinFlip",
    "description": "Simple coin flip demo."
}]
```

### `GET` `api/script/{scriptName}`

Using the `ts-node-parser` this will get a script's serialized JSON.

### `PATCH` `api/scripts/{scriptName}/node/{id}`

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

### `POST` `api/scripts`

Create a new script. If the name exists it will throw a `401`. Only the entry node 0 should exist with the description.

```typescript
interface PostScript {
    name: string,
    description: number
}
```

### `PATCH` `api/scripts/{scriptName}`

This handles renaming an existing script.

```typescript
interface PatchScript {
    name: string,
}
```
