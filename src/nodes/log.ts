import type { Node } from './node';

// Log
export function log({ nodes, message }: {
    nodes: Node[]
    // Message; Use ${key} to reference state values.
    message: string
}): Node[] {
    console.log(message);
    return nodes;
}
