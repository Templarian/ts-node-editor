import type { Node, State } from '../nodes/node';
import { random } from "../nodes/random";
import { randomChoice } from "../nodes/randomChoice";
import { log } from "../nodes/log";
import { stateGet } from "../nodes/stateGet";
import { stateAdd } from "../nodes/stateAdd";

// 0 7 - -
// Randomly reward the player, weighted toward a greeting.

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
                // 10 1 - -
                const r1 = await random({
                    state,
                    node: 1,
                    nodes: [2, 3]
                });
                stack.push(...r1.slice().reverse());
                continue;
            case 2:
                // 20 1 - -
                const r2 = randomChoice({
                    state,
                    callstack,
                    node: 2,
                    nodes: [4],
                    weight: 5
                });
                stack.push(r2[0]);
                break;
            case 3:
                // 30 1 - -
                const r3 = randomChoice({
                    state,
                    callstack,
                    node: 3,
                    nodes: [5],
                    weight: 1
                });
                stack.push(r3[0]);
                break;
            case 4:
                // 40 1 - -
                const r4 = log({
                    message: `Hello!`,
                    nodes: [0]
                });
                stack.push(r4[0]);
                break;
            case 5:
                // 50 10 - -
                const r5 = log({
                    message: `Here is gold`,
                    nodes: [6]
                });
                stack.push(r5[0]);
                break;
            case 6:
                // 60 1 - -
                const r6 = stateGet({
                    state,
                    node: 6,
                    nodes: [7],
                    key: `coins`
                });
                stack.push(r6[0]);
                continue;
            case 7:
                // 70 1 - -
                const r7 = stateAdd({
                    state,
                    callstack,
                    nodes: [0],
                    value: 5
                });
                stack.push(r7[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
