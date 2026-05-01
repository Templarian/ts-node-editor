import type { Node, State } from './node';

/**
 * Random
 */
export async function random({ state, node, nodes }: {
    state: State,
    node: Node,
    nodes: Node[],
}): Promise<Node[]> {
    if (nodes.length === 0) {
        return Promise.resolve([]);
    }
    if (state.has('noop')) {
        if (node !== state.get('noop')) {
            return [state.get('noop')];
        }
        if (!nodes.every((n) => state.has(`$random.${n}`))) {
            return [];
        }
        const totalWeight = nodes.reduce((sum, n) => sum + (state.get(`$random.${n}.weight`) ?? 1), 0);
        let pick = Math.random() * totalWeight;
        let chosen: Node[] = [];
        for (const n of nodes) {
            pick -= state.get(`$random.${n}.weight`) ?? 1;
            if (pick <= 0) {
                chosen = state.get(`$random.${n}`);
                break;
            }
        }
        nodes.forEach((n) => {
            state.delete(`$random.${n}`);
            state.delete(`$random.${n}.weight`);
        });
        state.delete('noop');
        return chosen;
    } else {
        state.set('noop', node);
        return Promise.resolve(nodes);
    }
}
