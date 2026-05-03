import type { Node, State } from './node';

/**
 * Is Not Set
 */
export function isNotSet({ state, t = [], f = [] }: {
    state: State,
    t?: Node[],
    f?: Node[]
}): Node[] {
    const result = !state.has(state.get('$conditional.key'));
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return result ? t : f;
}
