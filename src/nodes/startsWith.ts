import type { Node, State } from './node';

/**
 * Starts With
 */
export function startsWith({ state, t = [], f = [], value, ignoreCase = false }: {
    state: State,
    t?: Node[],
    f?: Node[],
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
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return (a.startsWith(b) ? t : f)[0] ?? 0;
}
