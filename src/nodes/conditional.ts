import type { Node, State } from './node';

/**
 * Conditional
 */
export async function conditional({ state, node, nodes, t = [], f = [] }: {
    state: State,
    node: Node,
    nodes: Node[],
    /**
     * True
     */
    t: Node[],
    /**
     * False
     */
    f: Node[]
}): Promise<Node[]> {
    if (nodes.length === 0) {
        return f;
    }
    if (state.has('$conditional.noop')) {
        if (node !== state.get('$conditional.noop')) {
            return [state.get('$conditional.noop')];
        }
        const result = state.get('$conditional.result') ?? false;
        state.delete('$conditional.noop');
        state.delete('$conditional.result');
        state.delete('$conditional.value');
        state.delete('$conditional.key');
        return result ? t : f;
    } else {
        state.set('$conditional.noop', node);
        return nodes;
    }
}
