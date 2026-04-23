import type { Node } from './node';

/**
 * Draw Image
 * @width 6
 * @height 6
 */
export function drawImage({ nodes, message }: {
    nodes: Node[]
    /**
     * Message
     * @description Use ${key} to reference state values.
     * @editor Text
     */
    message: string
}): Node[] {
    console.log(message);
    return nodes;
}
