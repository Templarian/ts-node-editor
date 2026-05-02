import type { Node, State } from './node';

/**
 * Is True
 */
export function isTrue({ state, nodes }: {
    state: State,
    nodes: Node[]
}): Node {
    const v = state.get('$conditional.value');
    state.set('$conditional.result', v === true || v === 'true' || v === 1);
    return nodes[0] ?? state.get('$conditional.noop');
}
