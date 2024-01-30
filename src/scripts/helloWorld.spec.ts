import { describe, expect, test } from '@jest/globals';
import { run } from './helloWorld';

describe('sum module', () => {
  test('verify basic run', async () => {
    const state = new Map();
    state.set('name', 'World');
    const result = await run(state);
    expect(result.get('message')).toBe('Hello World!');
  });
});