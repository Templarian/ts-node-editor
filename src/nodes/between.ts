import type { Node, State } from './node';

/**
 * Between
 */
export function between({ state, nodes, min, max, inclusive = false }: {
    state: State,
    nodes: Node[],
    /**
     * Min
     * @editor Number
     */
    min: number,
    /**
     * Max
     * @editor Number
     */
    max: number,
    /**
     * Inclusive
     */
    inclusive?: boolean
}): Node {
    const v = parseFloat(String(state.get('$conditional.value') ?? '')) || 0;
    state.set('$conditional.result', inclusive ? v >= min && v <= max : v > min && v < max);
    return nodes[0] ?? state.get('$conditional.noop');
}
