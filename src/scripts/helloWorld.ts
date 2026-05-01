import type { Node, State } from './../nodes/node';
import { get } from "./../nodes/stateGet";
import { set } from "./../nodes/stateSet";

// name: "John"

// 0 5 - -
// The hello world script takes in a name.
// This allows multiple line comment blocks also.

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.shift() || 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - - script
                if (state.has('noop')) {
                    stack.unshift(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 1:
                // 4 1 - -
                const r1 = await get({
                    state,
                    node: 1,
                    nodes: [2],
                    key: 'message'
                });
                stack.unshift(...r1);
                continue;
            case 2:
                // 11 1 - -
                const r2 = set({
                    state,
                    callstack,
                    nodes: [0],
                    value: `Hello ${state.get('name')}!`
                });
                stack.unshift(r2);
                break;
        }
        callstack.shift();
    }
    return state;
}
