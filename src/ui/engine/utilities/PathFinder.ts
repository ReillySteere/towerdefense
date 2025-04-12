export interface IGridPosition {
  x: number;
  y: number;
}

interface INode extends IGridPosition {
  g: number;
  h: number;
  f: number;
  parent?: INode;
}

function getEnemyPenaltyForCell(
  cell: IGridPosition,
  enemyPositions: Set<string>,
  penaltyPerEnemy: number = 3, // Adjust this value as necessary
): number {
  let penalty = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // Skip the current cell itself.
      if (dx === 0 && dy === 0) continue;
      const adjacentKey = `${cell.x + dx},${cell.y + dy}`;
      if (enemyPositions.has(adjacentKey)) {
        penalty += penaltyPerEnemy;
      }
    }
  }
  return penalty;
}

function getPenaltyForCell(
  cell: IGridPosition,
  obstacles: Set<string>,
  penaltyPerNeighbor: number = 2, // arbitrary penalty value
): number {
  let penalty = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // Skip checking the cell itself.
      if (dx === 0 && dy === 0) continue;
      const adjacentKey = `${cell.x + dx},${cell.y + dy}`;
      if (obstacles.has(adjacentKey)) {
        penalty += penaltyPerNeighbor;
      }
    }
  }
  return penalty;
}

function heuristic(a: IGridPosition, b: IGridPosition): number {
  // Manhattan distance heuristic.
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Bresenham's line algorithm to return grid cells (as integer coordinates)
 * between start and end positions.
 */
export function getLine(
  start: IGridPosition,
  end: IGridPosition,
): IGridPosition[] {
  const points: IGridPosition[] = [];
  // Ensure inputs are integers.
  let x0 = Math.floor(start.x),
    y0 = Math.floor(start.y);
  const x1 = Math.floor(end.x),
    y1 = Math.floor(end.y);
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}

/**
 * A* pathfinding algorithm on a grid.
 *
 * @param start - Starting grid cell.
 * @param end - Target grid cell.
 * @param gridWidth - Number of cells horizontally.
 * @param gridHeight - Number of cells vertically.
 * @param obstacles - Set of blocked cells keys ("x,y").
 * @returns Array of grid positions from start to end (inclusive), or null if none found.
 */
export function findPath(
  start: IGridPosition,
  end: IGridPosition,
  gridWidth: number,
  gridHeight: number,
  obstacles: Set<string>,
  enemyPositions?: Set<string>,
): IGridPosition[] | null {
  const openList: INode[] = [];
  const closedSet: Set<string> = new Set();
  const nodeKey = (node: IGridPosition) => `${node.x},${node.y}`;

  // Ensure that start and end are integers.
  const startNode: INode = {
    x: Math.floor(start.x),
    y: Math.floor(start.y),
    g: 0,
    h: heuristic(start, end),
    f: 0,
  };
  startNode.f = startNode.g + startNode.h;
  openList.push(startNode);

  // Directions: cardinal and diagonal.
  const directions: IGridPosition[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  while (openList.length > 0) {
    // Find the node with the lowest f value.
    let currentIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[currentIndex].f) {
        currentIndex = i;
      }
    }
    const currentNode = openList.splice(currentIndex, 1)[0];
    closedSet.add(nodeKey(currentNode));

    // Goal reached.
    if (
      currentNode.x === Math.floor(end.x) &&
      currentNode.y === Math.floor(end.y)
    ) {
      const path: IGridPosition[] = [];
      let current: INode | undefined = currentNode;
      while (current) {
        path.unshift({ x: current.x, y: current.y });
        current = current.parent;
      }
      return path;
    }

    // Explore neighbors.
    for (const dir of directions) {
      const neighbor: IGridPosition = {
        x: currentNode.x + dir.x,
        y: currentNode.y + dir.y,
      };
      const neighborKey = nodeKey(neighbor);
      // Skip out-of-bounds neighbors.
      if (
        neighbor.x < 0 ||
        neighbor.x >= gridWidth ||
        neighbor.y < 0 ||
        neighbor.y >= gridHeight
      ) {
        continue;
      }
      if (obstacles.has(neighborKey) || closedSet.has(neighborKey)) {
        continue;
      }
      // Calculate cost of specific nodes - this is where we modify how appealing a particular node is
      const baseCost = dir.x === 0 || dir.y === 0 ? 1 : Math.SQRT2;
      const towerPenalty = getPenaltyForCell(neighbor, obstacles, 2); // adjust penalty value as needed
      const enemyPenalty = enemyPositions
        ? getEnemyPenaltyForCell(neighbor, enemyPositions, 3)
        : 0;
      const cost = baseCost + towerPenalty + enemyPenalty;
      const tentativeG = currentNode.g + cost;

      let neighborNode = openList.find(
        (n) => n.x === neighbor.x && n.y === neighbor.y,
      );
      if (!neighborNode) {
        neighborNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: tentativeG,
          h: heuristic(neighbor, end),
          f: 0,
          parent: currentNode,
        };
        neighborNode.f = neighborNode.g + neighborNode.h;
        openList.push(neighborNode);
      } else if (tentativeG < neighborNode.g) {
        neighborNode.g = tentativeG;
        neighborNode.f = neighborNode.g + neighborNode.h;
        neighborNode.parent = currentNode;
      }
    }
  }
  return null;
}
