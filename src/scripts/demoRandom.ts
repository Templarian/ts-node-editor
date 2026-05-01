import type { Node, State } from '../nodes/node';
import { random } from "../nodes/random";
import { randomChoice } from "../nodes/randomChoice";
import { log } from "../nodes/log";
import { setState } from "../nodes/setState";

// 0 6 - -
// Randomly reward the player, weighted toward a greeting.

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
                // random - -
                const r1 = await random({
                    state,
                    node: 1,
                    nodes: [2, 3]
                });
                stack.unshift(...r1);
                continue;
            case 2:
                // randomChoice weight 5 -> [4]
                const r2 = randomChoice({
                    state,
                    callstack,
                    node: 2,
                    nodes: [4],
                    weight: 5
                });
                stack.unshift(r2);
                break;
            case 3:
                // randomChoice weight 1 -> [5]
                const r3 = randomChoice({
                    state,
                    callstack,
                    node: 3,
                    nodes: [5],
                    weight: 1
                });
                stack.unshift(r3);
                break;
            case 4:
                // log "Hello!"
                const r4 = log({
                    message: `Hello!`,
                    nodes: [0]
                });
                stack.unshift(...r4);
                break;
            case 5:
                // log "Here is gold"
                const r5 = log({
                    message: `Here is gold`,
                    nodes: [6]
                });
                stack.unshift(...r5);
                break;
            case 6:
                // setState coins = 5
                const r6 = setState({
                    state,
                    key: `coins`,
                    value: `5`,
                    nodes: [0]
                });
                stack.unshift(...r6);
                break;
        }
        callstack.shift();
    }
    return state;
}
