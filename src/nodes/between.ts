import type { Node, State } from './node';

/**
 * Between
 */
export function between({ state, t = [], f = [], min, max, inclusive = false }: {
    state: State,
    t?: Node[],
    f?: Node[],
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
    /**
     * Inclusive
     */
    inclusive?: boolean
}): Node {
    const v = parseFloat(String(state.get('$conditional.value') ?? '')) || 0;
    const result = inclusive ? v >= min && v <= max : v > min && v < max;
    state.delete('$state.noop'); state.delete('$state.noop.key');
    state.delete('$conditional.value'); state.delete('$conditional.key');
    return (result ? t : f)[0] ?? 0;
}
