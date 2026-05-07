import type { Node, State } from './../nodes/node';
import { stateGet } from "./../nodes/stateGet";
import { stateSet } from "./../nodes/stateSet";
import { run as runHelloWorld } from './helloWorld';

// name: "John"

// 0 5 - -
// Import Hello World

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.pop() ?? 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - -
                if (state.has('noop')) {
                    stack.push(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 1:
                // 4 1 - -
                const r1 = stateGet({
                    state,
                    node: 1,
                    nodes: [3],
                    key: 'name'
                });
                stack.push(r1[0]);
                continue;
            case 3:
                // 11 1 - -
                const r3 = stateSet({
                    state,
                    callstack,
                    nodes: [2],
                    value: `John`
                });
                stack.push(r3[0]);
                break;
            case 2:
                // 10 1 - -
                await runHelloWorld(state);
                stack.push(0);
                break;
        }
        callstack.shift();
    }
    return state;
}
