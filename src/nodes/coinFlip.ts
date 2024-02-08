import type { Node } from './node';

/**
 * Coin Flip
 */
export function coinFlip({ t, f }: {
    /**
     * True
     */
    t: Node[],
    /**
     * False
     */
    f: Node[],
}): Node[] {
    return Math.random() < 0.5 ? t : f;
}