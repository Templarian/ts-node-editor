import type { Node, State } from './node';

/**
 * In
 */
function conditionalIn({ state, t = [], f = [], value, ignoreCase = false }: {
    state: State,
    t?: Node[],
    f?: Node[],
    /**
     * Value
     */
    value: string[],
    /**
     * Ignore Case
     */
    ignoreCase?: boolean
}): Node[] {
    const raw = String(state.get('$conditional.value') ?? '');
    const a = ignoreCase ? raw.toLowerCase() : raw;
    const list = ignoreCase ? value.map(v => v.toLowerCase()) : value;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return list.includes(a) ? t : f;
}

export { conditionalIn as in };
