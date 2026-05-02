import type { Node, State } from './node';

/**
 * In
 */
function conditionalIn({ state, nodes, value, ignoreCase = false }: {
    state: State,
    nodes: Node[],
    /**
     * Value
     */
    value: string[],
    /**
     * Ignore Case
     */
    ignoreCase?: boolean
}): Node {
    const raw = String(state.get('$conditional.value') ?? '');
    const a = ignoreCase ? raw.toLowerCase() : raw;
    const list = ignoreCase ? value.map(v => v.toLowerCase()) : value;
    state.set('$conditional.result', list.includes(a));
    return nodes[0] ?? state.get('$conditional.noop');
}

export { conditionalIn as in };
