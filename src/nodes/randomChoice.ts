import type { Node, State } from './node';

/**
 * Random Choice
 */
export function randomChoice({ state, callstack, node: _node, nodes, weight = 1 }: {
    state: State,
    callstack: Node[],
    node: Node,
    nodes: Node[],
    /**
     * Weight
     */
    weight?: number
}): Node[] {
    if (state.has('noop')) {
        const noop = state.get('noop');
        let ln = 0 as Node;
        for (let i = callstack.length - 1; i >= 0; i--) {
            if (callstack[i - 1] === noop) {
                ln = callstack[i];
                break;
            }
        }
        state.set(`$random.${ln}`, nodes);
        state.set(`$random.${ln}.weight`, weight > 0 ? weight : 1);
        return [state.get('noop')];
    } else {
        throw new Error('RandomChoice node must be on a random branch');
    }
}
