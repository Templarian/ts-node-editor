import { getPath } from './mouse';

describe('mouse', () => {

  it('should navigate the correct path', () => {
    const matrix = [
      [0, 1, 1, 1],
      [0, 1, 1, 1],
      [0, 0, 1, 1],
      [1, 0, 0, 0]
    ];
    const result = getPath(matrix, { x: 0, y: 0 }, { x: 3, y: 3 });
    const expects = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 }
    ];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expects));
  });

  it('should navigate south first', () => {
    const matrix = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ];
    const result = getPath(matrix, { x: 0, y: 1 }, { x: 3, y: 2 });
    const expects = [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 }
    ];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expects));
  });

  it('should feel bad the mouse could not find cheeze', () => {
    const matrix = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ];
    const result = getPath(matrix, { x: 0, y: 1 }, { x: 3, y: 2 });
    const expects = [];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expects));
  });

});