import type { Node, State } from './node';

/**
 * Match
 */
export function match({ state, t = [], f = [], value, ignoreCase = false }: {
    state: State,
    t: Node[],
    f: Node[],
    /**
     * Value (regex)
     * @editor Text
     */
    value: string,
    /**
     * Ignore Case
     */
    ignoreCase?: boolean
}): Node[] {
    const raw = String(state.get('$conditional.value') ?? '');
    const result = new RegExp(value, ignoreCase ? 'i' : '').test(raw);
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return result ? t : f;
}
