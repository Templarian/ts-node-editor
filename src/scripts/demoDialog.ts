import type { Node, State } from '../nodes/node';
import { dialog } from "../nodes/dialog";
import { dialogChoice } from "../nodes/dialogChoice";
import { log } from "../nodes/log";

// 0 5 - -
// Ask the player which door to enter and log the result.

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
                const r1 = await dialog({
                    state,
                    node: 1,
                    nodes: [2, 3],
                    character: `Guide`,
                    text: `Which door will you choose?`
                });
                stack.unshift(...r1);
                continue;
            case 2:
                // 11 1 - -
                const r2 = dialogChoice({
                    state,
                    callstack,
                    nodes: [4],
                    text: `Red Door`
                });
                stack.unshift(r2);
                break;
            case 3:
                // 11 4 - -
                const r3 = dialogChoice({
                    state,
                    callstack,
                    nodes: [5],
                    text: `Blue Door`
                });
                stack.unshift(r3);
                break;
            case 4:
                // 18 1 - -
                const r4 = log({
                    message: `You entered the red room`,
                    nodes: [0]
                });
                stack.unshift(...r4);
                break;
            case 5:
                // 18 4 - -
                const r5 = log({
                    message: `You entered the blue room`,
                    nodes: [0]
                });
                stack.unshift(...r5);
                break;
        }
        callstack.shift();
    }
    return state;
}
