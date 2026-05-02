import type { Node, State } from './../nodes/node';
import { dialog } from "./../nodes/dialog";
import { dialogChoice } from "./../nodes/dialogChoice";
import { conditional } from "./../nodes/conditional";
import { greaterThan } from "./../nodes/greaterThan";
import { and } from "./../nodes/and";
import { lessThan } from "./../nodes/lessThan";
import { get } from "./../nodes/stateGet";
import { add } from "./../nodes/stateAdd";
import { log } from "./../nodes/log";

// coins: "6"

// 0 17 - -
// Ask for gold, then check if coins are between 5 and 10.

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
                // dialog
                const r1 = await dialog({
                    state,
                    node: 1,
                    nodes: [2, 3],
                    character: `Merchant`,
                    text: `What would you like?`
                });
                stack.unshift(...r1);
                continue;
            case 2:
                // dialogChoice "Can I have 5 gold?" -> [4]
                const r2 = dialogChoice({
                    state,
                    callstack,
                    nodes: [4],
                    text: `Can I have 5 gold?`
                });
                stack.unshift(r2);
                break;
            case 3:
                // dialogChoice "Can I have 12 gold?" -> [16]
                const r3 = dialogChoice({
                    state,
                    callstack,
                    nodes: [16],
                    text: `Can I have 12 gold?`
                });
                stack.unshift(r3);
                break;
            case 4:
                // conditional [get coins][greaterThan 5][and][get coins][lessThan 10] t=[10] f=[13]
                const r4 = await conditional({
                    state,
                    node: 4,
                    nodes: [5],
                    t: [10],
                    f: [13]
                });
                stack.unshift(...r4);
                continue;
            case 5:
                // get key=coins -> [6]
                const r5 = get({
                    state,
                    node: 5,
                    nodes: [6],
                    key: `coins`
                });
                stack.unshift(...r5);
                continue;
            case 6:
                // greaterThan value=5 -> [7]
                const r6 = greaterThan({
                    state,
                    nodes: [7],
                    value: 5
                });
                stack.unshift(r6);
                break;
            case 7:
                // and -> [8]
                const r7 = and({
                    state,
                    nodes: [8]
                });
                stack.unshift(r7);
                break;
            case 8:
                // get key=coins -> [9]
                const r8 = get({
                    state,
                    node: 8,
                    nodes: [9],
                    key: `coins`
                });
                stack.unshift(...r8);
                continue;
            case 9:
                // lessThan value=10 -> []
                const r9 = lessThan({
                    state,
                    nodes: [],
                    value: 10
                });
                stack.unshift(r9);
                break;
            case 10:
                // get key=coins -> [11]
                const r10 = get({
                    state,
                    node: 10,
                    nodes: [11],
                    key: `coins`
                });
                stack.unshift(...r10);
                continue;
            case 11:
                // add value=20 -> [12]
                const r11 = add({
                    state,
                    callstack,
                    nodes: [12],
                    value: 20
                });
                stack.unshift(r11);
                break;
            case 12:
                // log "I'm rich!"
                const r12 = log({
                    message: `I'm rich!`,
                    nodes: [0]
                });
                stack.unshift(...r12);
                break;
            case 13:
                // get key=coins -> [14]
                const r13 = get({
                    state,
                    node: 13,
                    nodes: [14],
                    key: `coins`
                });
                stack.unshift(...r13);
                continue;
            case 14:
                // add value=5 -> [15]
                const r14 = add({
                    state,
                    callstack,
                    nodes: [15],
                    value: 5
                });
                stack.unshift(r14);
                break;
            case 15:
                // log "Expected more"
                const r15 = log({
                    message: `Expected more`,
                    nodes: [0]
                });
                stack.unshift(...r15);
                break;
            case 16:
                // get key=coins -> [17]
                const r16 = get({
                    state,
                    node: 16,
                    nodes: [17],
                    key: `coins`
                });
                stack.unshift(...r16);
                continue;
            case 17:
                // add value=12 -> [0]
                const r17 = add({
                    state,
                    callstack,
                    nodes: [0],
                    value: 12
                });
                stack.unshift(r17);
                break;
        }
        callstack.shift();
    }
    return state;
}
