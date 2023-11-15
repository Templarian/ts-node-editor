import type { Node } from './node';

/**
 * Choices
 */
export function Choice({ state, callstack, node, nodes, text }: {
    state: Map<string, any>,
    callstack: Node[],
    node: Node,
    nodes: Node[],
    // Text
    text: string
}): Node {
    if (state.has('noop')) {
        const noop = state.get('noop');
        let ln = 0 as Node;
        for (let i = callstack.length - 1; i >= 0; i--) {
            if (callstack[i - 1] === noop) {
                ln = callstack[i];
                break;
            }
        }
        state.set(`$dialog.${ln}`, nodes);
        if (state.has(`$dialog.${ln}.text`)) {
            state.get(`$dialog.${ln}.text`).push(text);
        } else {
            state.set(`$dialog.${ln}.text`, [text]);
        }
        return state.get('noop');
    } else {
        throw new Error('Choice node must be on dialog branch');
    }
}