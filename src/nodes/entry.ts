import type { Node, State } from './node';
import { EntryType } from "./entryType";

/**
* Entry
*/
export function entry({ state, nodes = [], entryType }: {
   state: State,
   nodes: Node[],
   /**
    * Entry Type
    */
   entryType: EntryType
}): Node[] {
   // Activate differently based on the entry
   return state.get('entryType') === entryType ? nodes : [];
}
