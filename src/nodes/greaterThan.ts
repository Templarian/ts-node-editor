import type { Node, State } from './node';

/**
 * Greater Than
 */
export function greaterThan({ state, t = [], f = [], value = 0 }: {
    state: State,
    t: Node[],
    f: Node[],
    /**
     * Value
     * @editor Number
     */
    value: number
}): Node[] {
    const v = parseFloat(String(state.get('$conditional.value') ?? '')) || 0;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return v > value ? t : f;
}
