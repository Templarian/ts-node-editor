import { describe, expect, test } from '@jest/globals';
import { run } from './helloWorld';

describe('helloWorld', () => {
  test('should run and get message', async () => {
    const state = new Map();
    state.set('name', 'World');
    const result = await run(state);
    expect(result.get('message')).toBe('Hello World!');
  });
});