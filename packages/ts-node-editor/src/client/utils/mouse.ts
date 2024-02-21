export function getPath(matrix, start, end) {
    var queue = [];

    matrix[start[0]][start[1]] = 1;
    queue.push([start]);

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
            if (direction[i][0] == end[0] && direction[i][1] == end[1]) {
                return path.concat([end]);
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
