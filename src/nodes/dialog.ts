import type { Node, State } from './node';

/**
 * Dialog
 * @width 6
 * @height 6
 */
export async function dialog({ state, node, nodes = [], character, text }: {
    state: State,
    node: Node,
    nodes: Node[],
    /**
     * Character
     * @editor Character
     */
    character: string,
    /**
     * Text
     * @editor Text
     */
    text: string
}): Promise<Node[]> {
    if (nodes.length === 0) {
        return Promise.resolve([]);
    }
    // skip back to the last noop to handle it
    if (state.has('noop')) {
        // Another noop go there instead
        if (node !== state.get('noop')) {
            return [state.get('noop')];
        }
        if(!nodes.every((n) => {
            return state.has(`$dialog.${n}`);
        })) {
            return [];
        }
        const nResults = nodes.map((n) => {
            return state.get(`$dialog.${n}`);
        }).flat();
        const results = nodes.map((n) => {
            return state.get(`$dialog.${n}.text`);
        }).flat();
        return new Promise((resolve) => {
            const options = results.map((text, index) => {
                return `${index + 1}. ${text}`;
            });
            console.log(`Your selection?`);
            const s = parseInt(window.prompt(options.join('\n'), '1') || '1', 10) - 1;
            console.log('select', nResults[s]);
            resolve([nResults[s]]);
            nodes.forEach((n) => {
                state.delete(`$dialog.${n}`);
                state.delete(`$dialog.${n}.text`);
            });
            state.delete('noop');
        });
    } else {
        // Only one noop is allowed, so use this to track
        state.set('noop', node);
        return Promise.resolve(nodes);
    }
}
