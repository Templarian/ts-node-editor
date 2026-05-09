import type { Node, State } from './node';

/**
 * Between
 * @editor Between
 */
export function between({ state, t = [], f = [], min = 0, max = 100 }: {
    state: State,
    /**
     * True
     */
    t: Node[],
    /**
     * False
     */
    f: Node[],
    /**
     * Min
     * @editor Number
     */
    min: number,
    /**
     * Max
     * @editor Number
     */
    max: number,
}): Node[] {
    const v = parseFloat(String(state.get('$conditional.value') ?? '')) || 0;
    const result = v >= min && v <= max;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return (result ? t : f) ?? [0];
}
