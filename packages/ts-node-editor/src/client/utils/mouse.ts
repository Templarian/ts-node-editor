type Point = {
    x: number;
    y: number;
}

/**
 * Navigate a 2d array of 0's and 1's.
 * 
 * @param matrix 2D array
 * @param start [x, y]
 * @param end [y, y]
 * @returns Array of x and y
 */
export function getPath(matrix: number[][], start: Point, end: Point): Point[] {
    var queue = [];

    matrix[start.x][start.y] = 1;
    queue.push([[start.x, start.y]]);

    while (queue.length > 0) {
        var path = queue.shift();
        var pos = path[path.length - 1];
        var direction = [
            [pos[0] + 1, pos[1]],
            [pos[0], pos[1] + 1],
            [pos[0] - 1, pos[1]],
            [pos[0], pos[1] - 1]
        ];

        for (var i = 0; i < direction.length; i++) {
            if (direction[i][0] == end.x && direction[i][1] == end.y) {
                path.push([end.x, end.y]);
                return path.map(([y, x]) => ({ x, y }));
            }

            if (direction[i][0] < 0 || direction[i][0] >= matrix.length
                || direction[i][1] < 0 || direction[i][1] >= matrix[0].length
                || matrix[direction[i][0]][direction[i][1]] != 0) {
                continue;
            }

            matrix[direction[i][0]][direction[i][1]] = 1;
            queue.push(path.concat([direction[i]]));
        }
    }
}
