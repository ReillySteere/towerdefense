/**
 * GameGrid is responsible for managing the grid occupancy.
 * It provides methods to check if cells are occupied, update cell occupancy,
 * clear the grid, and retrieve the current obstacles.
 */
export class GameGrid {
  private grid: number[][];
  readonly #width: number;
  readonly #height: number;

  constructor(width: number, height: number) {
    this.#width = width;
    this.#height = height;
    // Initialize grid with all cells unoccupied (0)
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
  }

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  /**
   * Returns true if the specified cell (x, y) is already occupied.
   */
  public isCellOccupied(x: number, y: number): boolean {
    return this.grid[y][x] !== 0;
  }

  /**
   * Sets the occupancy status of a cell.
   * @param x - X-coordinate (grid cell index).
   * @param y - Y-coordinate (grid cell index).
   * @param occupied - True to mark as occupied, false for free.
   */
  public setCellOccupancy(
    x: number,
    y: number,
    occupied: boolean = true,
  ): void {
    this.grid[y][x] = occupied ? 1 : 0;
  }

  /**
   * Clears the grid by marking all cells as unoccupied.
   */
  public clear(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = 0;
      }
    }
  }

  /**
   * Retrieves a set of obstacles represented as string keys ("x,y")
   * for all occupied cells.
   */
  public getObstacles(): Set<string> {
    const obstacles = new Set<string>();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          obstacles.add(`${x},${y}`);
        }
      }
    }
    return obstacles;
  }

  /**
   * Checks whether the specified cell (x, y) is within grid bounds.
   */
  public isCellInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
