import type { Node, State } from '../nodes/node';
import { coinFlip } from '../nodes/coinFlip';
import { log } from '../nodes/log';

// 0 5 - -
// Flip a coin and log which is selected

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.pop() ?? 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - -
                // Simple coin flip demo.
                if (state.has('noop')) {
                    stack.push(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 1:
                // 17 1 - -
                const r1 = coinFlip({
                    t: [2],
                    f: [3]
                });
                stack.push(r1[0]);
                break;
            case 2:
                // 33 1 - -
                const r2 = log({
                    message: 'Heads',
                    nodes: [0]
                });
                stack.push(r2[0]);
                break;
            case 3:
                // 33 9 - -
                const r3 = log({
                    message: 'Tails',
                    nodes: [0]
                });
                stack.push(r3[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
