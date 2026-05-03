import type { Node, State } from './node';

/**
 * Empty
 */
export function empty({ state, t = [], f = [] }: {
    state: State,
    t?: Node[],
    f?: Node[]
}): Node {
    const v = state.get('$conditional.value');
    const result = v === undefined || v === null || v === '' || v === 0;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return (result ? t : f)[0] ?? 0;
}
