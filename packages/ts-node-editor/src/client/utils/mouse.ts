type Point = {
    x: number;
    y: number;
}

//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0, position1) {
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);
    return d1 + d2;
}

class GridPoint {
    x;
    y;
    cols;
    rows;
    walkable;
    constructor(x, y, cols, rows, walkable) {
        this.x = x; //x location of the grid point
        this.y = y; //y location of the grid point
        this.cols = cols;
        this.rows = rows;
        this.walkable = walkable;
    }
    f = 0; //total cost function
    g = 0; //cost function from start to the current grid point
    h = 0; //heuristic estimated cost function from current grid point to the goal
    neighbors = []; // neighbors of the current grid point
    parent = undefined; // immediate source of the current grid point
    // update neighbors array for a given grid point
    updateNeighbors(grid) {
        let i = this.x;
        let j = this.y;
        if (i < this.cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < this.rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }
}

/**
 * Navigate a 2d array of 0's and 1's.
 * 
 * @param matrix 2D array
 * @param start { x, y }
 * @param end { y, y }
 * @returns Array of { x, y }
 */
export function getPath(matrix: number[][], start: Point, end: Point): Point[] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const grid = [];
    let openSet = []; //array containing unevaluated grid points
    let closedSet = []; //array containing completely evaluated grid points

    let path = [];

    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new GridPoint(i, j, cols, rows, matrix[i][j] === 0);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].updateNeighbors(grid);
        }
    }

    const startGridPoint = grid[start.y][start.x];
    const endGridPoint = grid[end.y][end.x];

    openSet.push(startGridPoint);

    while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];

        if (current === endGridPoint) {
            let temp = current;
            path.push({ x: temp.y, y: temp.x });
            while (temp.parent) {
                path.push({ x: temp.parent.y, y: temp.parent.x });
                temp = temp.parent;
            }
            console.log("DONE!");
            // return the traced path
            return path.reverse();
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            // skip any obstacles or neighbors that have already been evaluated
            if (!neighbor.walkable || closedSet.includes(neighbor)) {
                continue;
            }
            let possibleG = current.g + 1;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (possibleG >= neighbor.g) {
                continue;
            }

            neighbor.g = possibleG;
            neighbor.h = heuristic(neighbor, endGridPoint);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
        }
    }

    //no solution by default
    return [];
}
