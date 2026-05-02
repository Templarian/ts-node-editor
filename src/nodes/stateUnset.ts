import type { Node, State } from './node';

/**
 * Unset
 */
export function stateUnset({ state, callstack, nodes }: {
    state: State,
    callstack: Node[],
    nodes: Node[]
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
        state.set(`$state.${ln}.op`, 'unset');
        return state.get('$state.noop');
    } else {
        throw new Error('unset node must be on state branch');
    }
}
