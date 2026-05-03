# ts-node-server

The server controls all the endpoints and serving the initial application's compiled content.

## Endpoints

### `GET` `api/nodes`

Parse all of the nodes TS files and return their meta data.

```json
{
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
}
```