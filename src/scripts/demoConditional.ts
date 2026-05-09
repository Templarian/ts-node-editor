import type { Node, State } from '../nodes/node';
import { dialog } from '../nodes/dialog';
import { dialogChoice } from '../nodes/dialogChoice';
import { stateGet } from '../nodes/stateGet';
import { greaterThan } from '../nodes/greaterThan';
import { lessThan } from '../nodes/lessThan';
import { stateAdd } from '../nodes/stateAdd';
import { log } from '../nodes/log';

// coins: "6"

// 0 15 - -
// Ask for gold, then check if coins are between 5 and 10.

export async function run(state: State): Promise<State> {
    const stack: Node[] = [1];
    const callstack: Node[] = [];
    loop: while (true) {
        const node = stack.pop() ?? 0;
        callstack.push(node);
        switch (node) {
            case 0:
                // 1 1 - -
                // Demo showing how conditionals work.
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
                    character: `Merchant`,
                    text: `What would you like?`
                });
                stack.push(...r1.slice().reverse());
                continue;
            case 2:
                // 33 1 - -
                const r2 = dialogChoice({
                    state,
                    callstack,
                    nodes: [4],
                    text: `Can I have 5 gold?`
                });
                stack.push(r2[0]);
                break;
            case 3:
                // 17 9 - -
                const r3 = dialogChoice({
                    state,
                    callstack,
                    nodes: [13],
                    text: `Can I have 12 gold?`
                });
                stack.push(r3[0]);
                break;
            case 4:
                // 49 1 - -
                const r4 = stateGet({
                    state,
                    node: 4,
                    nodes: [5],
                    key: `coins`
                });
                stack.push(r4[0]);
                continue;
            case 5:
                // 65 1 - -
                const r5 = greaterThan({
                    state,
                    t: [6],
                    f: [10],
                    value: 5
                });
                stack.push(r5[0]);
                break;
            case 6:
                // 81 1 - -
                const r6 = stateGet({
                    state,
                    node: 6,
                    nodes: [7],
                    key: `coins`
                });
                stack.push(r6[0]);
                continue;
            case 7:
                // 97 1 - -
                const r7 = lessThan({
                    state,
                    t: [8],
                    f: [10],
                    value: 10
                });
                stack.push(r7[0]);
                break;
            case 8:
                // 113 1 - -
                const r8 = stateGet({
                    state,
                    node: 8,
                    nodes: [9],
                    key: `coins`
                });
                stack.push(r8[0]);
                continue;
            case 9:
                // 130 1 - -
                const r9 = stateAdd({
                    state,
                    callstack,
                    nodes: [12],
                    value: 20
                });
                stack.push(r9[0]);
                break;
            case 10:
                // 33 9 - -
                const r10 = stateGet({
                    state,
                    node: 10,
                    nodes: [11],
                    key: `coins`
                });
                stack.push(r10[0]);
                continue;
            case 11:
                // 49 9 - -
                const r11 = stateAdd({
                    state,
                    callstack,
                    nodes: [12],
                    value: 5
                });
                stack.push(r11[0]);
                break;
            case 12:
                // 65 9 - -
                const r12 = log({
                    message: `Done`,
                    nodes: [0]
                });
                stack.push(r12[0]);
                break;
            case 13:
                // 81 9 - -
                const r13 = stateGet({
                    state,
                    node: 13,
                    nodes: [14],
                    key: `coins`
                });
                stack.push(r13[0]);
                continue;
            case 14:
                // 97 9 - -
                const r14 = stateAdd({
                    state,
                    callstack,
                    nodes: [0],
                    value: 12
                });
                stack.push(r14[0]);
                break;
            case 15:
                // 113 9 - -
                const r15 = log({
                    message: `I'm rich!`,
                    nodes: [0]
                });
                stack.push(r15[0]);
                break;
        }
        callstack.shift();
    }
    return state;
}
