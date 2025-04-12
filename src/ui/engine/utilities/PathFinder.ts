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

function heuristic(a: IGridPosition, b: IGridPosition): number {
  // Manhattan distance heuristic.
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function findPath(
  start: IGridPosition,
  end: IGridPosition,
  gridWidth: number,
  gridHeight: number,
  obstacles: Set<string>, // keys of the form "x,y"
): IGridPosition[] | null {
  const openList: INode[] = [];
  const closedSet: Set<string> = new Set();

  const nodeKey = (node: IGridPosition) => `${node.x},${node.y}`;

  const startNode: INode = { ...start, g: 0, h: heuristic(start, end), f: 0 };
  startNode.f = startNode.g + startNode.h;
  openList.push(startNode);

  // Directions: up, right, down, left and diagonals.
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
    // Get the node with the lowest f in the open list.
    let currentIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[currentIndex].f) {
        currentIndex = i;
      }
    }
    const currentNode = openList.splice(currentIndex, 1)[0];
    closedSet.add(nodeKey(currentNode));

    // Goal test.
    if (currentNode.x === end.x && currentNode.y === end.y) {
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
      // Skip if out of bounds.
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
      const cost = dir.x === 0 || dir.y === 0 ? 1 : Math.SQRT2;
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
