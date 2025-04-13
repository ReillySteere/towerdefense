const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = 20;
export class GameGrid {
  #grid: number[][];
  readonly width: number;
  readonly height: number;

  constructor() {
    this.width = CANVAS_WIDTH / CELL_SIZE;
    this.height = CANVAS_HEIGHT / CELL_SIZE;
    this.#grid = Array.from({ length: this.height }, () =>
      Array(this.width).fill(0),
    );
  }

  /**
   * Returns the size of a grid cell in pixels.
   */
  get cellSize(): number {
    return CELL_SIZE;
  }

  /**
   * Checks if the cell at (x,y) is occupied.
   */
  isCellOccupied(x: number, y: number): boolean {
    return this.#grid[y][x] !== 0;
  }

  /**
   * Sets the occupancy status of a cell.
   */
  setCellOccupancy(x: number, y: number, occupied: boolean = true): void {
    this.#grid[y][x] = occupied ? 1 : 0;
  }

  /**
   * Resets the grid to unoccupied.
   */
  clear(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.#grid[y][x] = 0;
      }
    }
  }

  /**
   * Returns a Set of obstacle cells (as strings in the format "x,y").
   */
  getObstacles(): Set<string> {
    const obstacles = new Set<string>();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.#grid[y][x] === 1) {
          obstacles.add(`${x},${y}`);
        }
      }
    }
    return obstacles;
  }

  /**
   * Converts grid coordinates to pixel coordinates.
   * Positions the object at the center of the grid cell.
   *
   * @param gridX - The grid X coordinate.
   * @param gridY - The grid Y coordinate.
   * @returns An object containing pixelX and pixelY.
   */
  gridToPixel(
    gridX: number,
    gridY: number,
  ): { pixelX: number; pixelY: number } {
    return {
      pixelX: gridX * CELL_SIZE + CELL_SIZE / 2,
      pixelY: gridY * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  /**
   * Converts pixel coordinates to grid coordinates.
   *
   * @param pixelX - The pixel X coordinate.
   * @param pixelY - The pixel Y coordinate.
   * @returns An object containing gridX and gridY.
   */
  pixelToGrid(
    pixelX: number,
    pixelY: number,
  ): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor(pixelX / CELL_SIZE),
      gridY: Math.floor(pixelY / CELL_SIZE),
    };
  }
}
