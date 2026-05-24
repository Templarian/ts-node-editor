import type { Node, State } from '../nodes/node';
import { dialog } from '../nodes/dialog';
import { dialogChoice } from '../nodes/dialogChoice';
import { log } from '../nodes/log';

// 0 5 - -
// Ask the player which door to enter and log the result.

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.pop() ?? 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - -
                // Dialog example with doors.
                if (state.has('noop')) {
                    stack.push(state.get('noop'));
                    state.delete('noop');
                    continue;
                }
                break loop;
            case 1:
                // 17 1 - -
                const r1 = await dialog({
                    state,
                    node: 1,
                    nodes: [2, 3],
                    character: 'Guide',
                    text: 'Which door will you choose?'
                });
                stack.push(...r1.slice().reverse());
                continue;
            case 2:
                // 33 1 - -
                const r2 = dialogChoice({
                    state,
                    callstack,
                    nodes: [4],
                    text: 'Red Door'
                });
                stack.push(r2[0]);
                break;
            case 3:
                // 33 9 - -
                const r3 = dialogChoice({
                    state,
                    callstack,
                    nodes: [5],
                    text: 'Blue Door'
                });
                stack.push(r3[0]);
                break;
            case 4:
                // 49 1 - -
                const r4 = log({
                    nodes: [0],
                    message: 'You entered the red room'
                });
                stack.push(r4[0]);
                break;
            case 5:
                // 49 9 - -
                const r5 = log({
                    nodes: [0],
                    message: 'You entered the blue room'
                });
                stack.push(r5[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
