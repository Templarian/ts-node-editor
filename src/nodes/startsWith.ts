import type { Node, State } from './node';

/**
 * Starts With
 */
export function startsWith({ state, nodes, value, ignoreCase = false }: {
    state: State,
    nodes: Node[],
    /**
     * Value
     * @editor Text
     */
    value: string,
    /**
     * Ignore Case
     */
    ignoreCase?: boolean
}): Node {
    const raw = String(state.get('$conditional.value') ?? '');
    const a = ignoreCase ? raw.toLowerCase() : raw;
    const b = ignoreCase ? value.toLowerCase() : value;
    state.set('$conditional.result', a.startsWith(b));
    return nodes[0] ?? state.get('$conditional.noop');
}
