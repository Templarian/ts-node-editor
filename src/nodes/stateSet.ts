import type { Node, State } from './node';

/**
 * Set
 */
export function set({ state, callstack, nodes, value }: {
    state: State,
    callstack: Node[],
    nodes: Node[],
    /**
     * Value
     * @description Use ${key} to reference state values.
     * @editor Text
     */
    value: string
}): Node {
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
        state.set(`$state.${ln}.op`, 'set');
        state.set(`$state.${ln}.value`, value);
        return state.get('$state.noop');
    } else {
        throw new Error('set node must be on state branch');
    }
}
