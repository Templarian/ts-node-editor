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
     * True
     */
    f: Node[],
}): Node[] {
    return Math.random() < 0.5 ? t : f;
}