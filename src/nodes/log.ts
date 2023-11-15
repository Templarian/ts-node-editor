import type { Node } from './node';

/**
 * Log
 * @width 6
 * @height 6
 */
export function log({ nodes, message }: {
    nodes: Node[]
    /**
     * Message
     * @description Use ${key} to reference state values.
     * @editor string
     */
    message: string
}): Node[] {
    console.log(message);
    return nodes;
}
