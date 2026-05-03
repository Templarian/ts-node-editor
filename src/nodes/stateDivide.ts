import type { Node, State } from './node';

/**
 * Divide
 */
export function stateDivide({ state, callstack, nodes, value }: {
    state: State,
    callstack: Node[],
    nodes: Node[],
    /**
     * Value
     * @editor Number
     */
    value: number
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
        state.set(`$state.${ln}`, nodes);
        state.set(`$state.${ln}.op`, 'divide');
        state.set(`$state.${ln}.value`, value);
        return [state.get('$state.noop')];
    } else {
        throw new Error('divide node must be on state branch');
    }
}
