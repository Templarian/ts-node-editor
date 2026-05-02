import type { Node, State } from './node';

/**
 * Conditional Get
 */
export function conditionalGet({ state, nodes, key }: {
    state: State,
    nodes: Node[],
    /**
     * Key
     * @editor Text
     */
    key: string
}): Node {
    if (!state.has('$conditional.noop')) {
        throw new Error('conditionalGet must be on a condition branch');
    }
    state.set('$conditional.value', state.has(key) ? state.get(key) : undefined);
    state.set('$conditional.key', key);
    return nodes[0] ?? state.get('$conditional.noop');
}
