import type { Node } from './node';
import { EntryType } from "./entryType";

/**
* Entry
*/
export function Entry({ state, nodes, entryType }: {
   state: Map<string, string | number | boolean>
   nodes: Node[],
   /**
    * Entry Type
    */
   entryType: EntryType
}): Node[] {
   // Activate differently based on the entry
   return state.get('entryType') === entryType ? nodes : [];
}
