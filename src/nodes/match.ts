import type { Node, State } from './node';

/**
 * Match
 */
export function match({ state, nodes, value, ignoreCase = false }: {
    state: State,
    nodes: Node[],
    /**
     * Value (regex)
     * @editor Text
     */
    value: string,
    /**
     * Ignore Case
     */
    ignoreCase?: boolean
}): Node {
    const raw = String(state.get('$conditional.value') ?? '');
    const flags = ignoreCase ? 'i' : '';
    state.set('$conditional.result', new RegExp(value, flags).test(raw));
    return nodes[0] ?? state.get('$conditional.noop');
}
