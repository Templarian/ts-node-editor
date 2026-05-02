import type { Node, State } from './node';

/**
 * Is Set
 */
export function isSet({ state, nodes }: {
    state: State,
    nodes: Node[]
}): Node {
    state.set('$conditional.result', state.has(state.get('$conditional.key')));
    return nodes[0] ?? state.get('$conditional.noop');
}
