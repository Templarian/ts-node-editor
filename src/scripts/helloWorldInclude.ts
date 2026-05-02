import type { Node, State } from './../nodes/node';
import { get } from "./../nodes/stateGet";
import { set } from "./../nodes/stateSet";
import { run as runHelloWorld } from './helloWorld';

// name: "John"

// 0 5 - -
// Import Hello World

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
                const r1 = get({
                    state,
                    node: 1,
                    nodes: [3],
                    key: 'name'
                });
                stack.unshift(...r1);
                continue;
            case 3:
                // 11 1 - -
                const r3 = set({
                    state,
                    callstack,
                    nodes: [2],
                    value: `John`
                });
                stack.unshift(r3);
                break;
            case 2:
                // 10 1 - -
                await runHelloWorld(state);
                stack.unshift(...[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
