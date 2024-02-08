import { run } from './helloWorldInclude';

describe('helloWorldInclude', () => {
  test('should run and get message', async () => {
    const state = new Map();
    state.set('name', 'World');
    const result = await run(state);
    expect(result.get('message')).toBe('Hello John!');
  });
});
