import type { Node, State } from './node';

/**
 * Is True
 */
export function isTrue({ state, t = [], f = [] }: {
    state: State,
    t: Node[],
    f: Node[]
}): Node[] {
    const v = state.get('$conditional.value');
    const result = v === true || v === 'true' || v === 1;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return result ? t : f;
}
