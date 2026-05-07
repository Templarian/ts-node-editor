import { run } from './demoDialog';

describe('demoDialog', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        (global as any).window = { prompt: jest.fn() };
    });

    afterEach(() => {
        jest.useRealTimers();
        delete (global as any).window;
    });

    test('should follow red door path', async () => {
        (global as any).window.prompt.mockReturnValue('1');
        const logSpy = jest.spyOn(global.console, 'log');
        const state = new Map();
        const runPromise = run(state);
        await jest.runAllTimersAsync();
        await runPromise;
        expect(logSpy).toHaveBeenCalledWith('You entered the red room');
        logSpy.mockRestore();
    });

    test('should follow blue door path', async () => {
        (global as any).window.prompt.mockReturnValue('2');
        const logSpy = jest.spyOn(global.console, 'log');
        const state = new Map();
        const runPromise = run(state);
        await jest.runAllTimersAsync();
        await runPromise;
        expect(logSpy).toHaveBeenCalledWith('You entered the blue room');
        logSpy.mockRestore();
    });
});
