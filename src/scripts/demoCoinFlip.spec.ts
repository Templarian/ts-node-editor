import { run } from './demoCoinFlip';

describe('coinFlip', () => {
  test('should follow true path', async () => {
    // Coin flip is always true
    const randomSpy = jest.spyOn(global.Math, 'random').mockReturnValue(0.40);
    const logSpy = jest.spyOn(global.console, 'log');
    const state = new Map();
    const result = await run(state);
    expect(result.keys.length).toBe(0);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Heads');
    randomSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('should follow false path', async () => {
    // Coin flip is always false
    const randomSpy = jest.spyOn(global.Math, 'random').mockReturnValue(0.60);
    const logSpy = jest.spyOn(global.console, 'log');
    const state = new Map();
    const result = await run(state);
    expect(result.keys.length).toBe(0);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Tails');
    randomSpy.mockRestore();
    logSpy.mockRestore();
  });
});
