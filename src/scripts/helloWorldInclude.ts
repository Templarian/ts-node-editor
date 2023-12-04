import type { Node, State } from './../nodes/node';
import { setState } from "./../nodes/setState";
import { run as runHelloWorld } from './helloWorld';

// 0 5 - -
// Import Hello World

export async function run(state: State): Promise<State> {
    // 1 1 - - script
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.shift() || 0;
        callstack.push(node);
        switch (node) {
            case 0:
                if (state.has('noop')) {
                    stack.unshift(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 2:
                // 4 1 - -
                const r1 = setState({
                    state,
                    nodes: [2],
                    key: 'name',
                    value: `John`
                });
                stack.unshift(...r1);
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