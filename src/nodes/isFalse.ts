import type { Node, State } from './node';

/**
 * Is False
 */
export function isFalse({ state, nodes }: {
    state: State,
    nodes: Node[]
}): Node {
    const v = state.get('$conditional.value');
    state.set('$conditional.result', v === false || v === 'false' || v === 0);
    return nodes[0] ?? state.get('$conditional.noop');
}
