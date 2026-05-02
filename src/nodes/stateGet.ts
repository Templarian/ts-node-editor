import type { Node, State } from './node';

/**
 * Get
 * @width 6
 * @height 6
 */
export function stateGet({ state, node, nodes, key }: {
    state: State,
    node: Node,
    nodes: Node[],
    /**
     * Key
     * @description Unique identifier for the state variable.
     * @editor Text
     */
    key: string
}): Node[] {
    if (state.has('$conditional.noop')) {
        state.set('$conditional.value', state.has(key) ? state.get(key) : undefined);
        state.set('$conditional.key', key);
        return [nodes[0] ?? state.get('$conditional.noop')];
    }
    if (nodes.length === 0) {
        return [];
    }
    if (state.has('$state.noop')) {
        if (node !== state.get('$state.noop')) {
            return [state.get('$state.noop')];
        }
        if (!nodes.every((n) => state.has(`$state.${n}`))) {
            return [];
        }
        const stateKey = state.get('$state.noop.key');
        nodes.forEach((n) => {
            const op = state.get(`$state.${n}.op`);
            const val = state.get(`$state.${n}.value`);
            const cur = state.has(stateKey) ? parseFloat(state.get(stateKey)) : 0;
            if (op === 'add') state.set(stateKey, cur + val);
            else if (op === 'subtract') state.set(stateKey, cur - val);
            else if (op === 'multiply') state.set(stateKey, cur * val);
            else if (op === 'divide') state.set(stateKey, cur / val);
            else if (op === 'set') state.set(stateKey, val);
            else if (op === 'unset') state.delete(stateKey);
        });
        const nResults = nodes.map((n) => state.get(`$state.${n}`)).flat();
        nodes.forEach((n) => {
            state.delete(`$state.${n}`);
            state.delete(`$state.${n}.op`);
            state.delete(`$state.${n}.value`);
        });
        state.delete('$state.noop');
        state.delete('$state.noop.key');
        return nResults;
    } else {
        state.set('$state.noop', node);
        state.set('$state.noop.key', key);
        return nodes;
    }
}
