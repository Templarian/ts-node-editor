import type { Node, State } from './node';

/**
 * Or
 */
export function or({ state, nodes }: {
    state: State,
    nodes: Node[]
}): Node {
    if (state.get('$conditional.result') ?? false) {
        return state.get('$conditional.noop');
    }
    state.delete('$conditional.result');
    return nodes[0] ?? state.get('$conditional.noop');
}
