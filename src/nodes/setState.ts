import type { Node } from './node';

// Set State
export function setState({ state, nodes, key, value }: {
    state: Map<string, any>
    nodes: Node[]
    // Key
    key: string,
    // Value; Use ${key} to reference state values.
    value: string
}): Node[] {
    state.set(key, value);
    return nodes;
}
