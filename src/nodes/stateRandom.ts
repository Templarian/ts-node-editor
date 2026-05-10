import type { Node, State } from './node';

/**
 * Set Random
 */
export function stateRandom({ state, callstack, nodes = [], min = 0, max = 100 }: {
    state: State,
    callstack: Node[],
    nodes: Node[],
    /**
     * Min
     * @description Minimum value (inclusive).
     * @editor Number
     */
    min: number,
    /**
     * Max
     * @description Maximum value (inclusive).
     * @editor Number
     */
    max: number
}): Node[] {
    if (state.has('$state.noop')) {
        const noop = state.get('$state.noop');
        let ln = 0 as Node;
        for (let i = callstack.length - 1; i >= 0; i--) {
            if (callstack[i - 1] === noop) {
                ln = callstack[i];
                break;
            }
        }
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        state.set(`$state.${ln}`, nodes);
        state.set(`$state.${ln}.op`, 'set');
        state.set(`$state.${ln}.value`, value);
        return [state.get('$state.noop')];
    } else {
        throw new Error('stateRandom node must be on state branch');
    }
}
