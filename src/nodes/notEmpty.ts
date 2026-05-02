import type { Node, State } from './node';

/**
 * Not Empty
 */
export function notEmpty({ state, nodes }: {
    state: State,
    nodes: Node[]
}): Node {
    const v = state.get('$conditional.value');
    state.set('$conditional.result', v !== undefined && v !== null && v !== '' && v !== 0);
    return nodes[0] ?? state.get('$conditional.noop');
}
