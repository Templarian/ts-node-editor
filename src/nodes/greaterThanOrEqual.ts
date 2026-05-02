import type { Node, State } from './node';

/**
 * Greater Than Or Equal
 */
export function greaterThanOrEqual({ state, nodes, value }: {
    state: State,
    nodes: Node[],
    /**
     * Value
     * @editor Number
     */
    value: number
}): Node {
    const v = parseFloat(String(state.get('$conditional.value') ?? '')) || 0;
    state.set('$conditional.result', v >= value);
    return nodes[0] ?? state.get('$conditional.noop');
}
