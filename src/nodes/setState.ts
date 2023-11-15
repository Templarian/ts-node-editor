import type { Node } from './node';

/**
 * Set State
 * @width 6
 * @height 6
 */
export function setState({ state, nodes, key, value }: {
    state: Map<string, any>
    nodes: Node[]
    /**
     * Key
     * @description Unique value.
     */
    key: string
    /**
     * Value
     * @description Use ${key} to reference state values.
     */
    value: string
}): Node[] {
    state.set(key, value);
    return nodes;
}
