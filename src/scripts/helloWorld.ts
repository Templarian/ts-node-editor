import type { Node, State } from '../nodes/node';
import { stateGet } from '../nodes/stateGet';
import { stateSet } from '../nodes/stateSet';

// name: "John"

// 0 5 - -
// The hello world script takes in a name.
// This allows multiple line comment blocks also.

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.pop() ?? 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - -
                // Hello world app.
                if (state.has('noop')) {
                    stack.push(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 1:
                // 17 1 - -
                const r1 = stateGet({
                    state,
                    node: 1,
                    nodes: [2],
                    key: 'message'
                });
                stack.push(r1[0]);
                continue;
            case 2:
                // 33 1 - -
                const r2 = stateSet({
                    state,
                    callstack,
                    nodes: [0],
                    value: `Hello ${state.get('name')}!`
                });
                stack.push(r2[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
