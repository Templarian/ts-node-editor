import type { Node } from '../nodes/node';
import { coinFlip } from "../nodes/coinFlip";
import { log } from "../nodes/log";

// 0 5 - -
// Flip a coin and log which is selected

export async function run(state: Map<string, any>) {
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
            case 1:
                // 4 1 - -
                const r1 = coinFlip({
                    t: [2],
                    f: [3]
                });
                stack.unshift(...r1);
                break;
            case 2:
                // 11 1 - -
                const r2 = log({
                    message: `Heads`,
                    nodes: [0]
                });
                stack.unshift(...r2);
                break;
            case 3:
                // 11 8 - -
                const r3 = log({
                    message: `Tails`,
                    nodes: [0]
                });
                stack.unshift(...r3);
                break;
        }
        callstack.shift();
    }
    return state;
}