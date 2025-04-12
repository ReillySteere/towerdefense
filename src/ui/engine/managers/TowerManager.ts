import { Tower } from '../entities/tower/Tower';
import { GameGrid } from '../core/GameGrid';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { EventBus } from '../events/EventBus';
import { findPath, IGridPosition } from '../utilities/PathFinder';

export class TowerManager {
  private towers: Tower[] = [];

  constructor(private grid: GameGrid) {}

  /**
   * Check if a tower already exists at (x, y).
   */
  hasTowerAt(x: number, y: number): boolean {
    return this.towers.some((tower) => tower.x === x && tower.y === y);
  }

  getTowers(): Tower[] {
    return this.towers;
  }
  /**
   * Return a list of obstacles from both towers and the grid.
   */
  getObstacleSet(): Set<string> {
    const obstacles = new Set<string>();
    // Add tower positions as obstacles.
    this.towers.forEach((tower) => {
      obstacles.add(`${tower.x},${tower.y}`);
    });
    // Also include any obstacles already set in the grid.
    this.grid.getObstacles().forEach((key) => obstacles.add(key));
    return obstacles;
  }

  /**
   * Validate whether a candidate tower can be placed:
   * - The target cell must not be already occupied.
   * - The candidate should not block any necessary path between waypoints.
   */
  public canPlaceTower(
    candidateTower: Tower,
    canvasWidth: number,
    canvasHeight: number,
    waypointManager: WaypointManager,
  ): boolean {
    // Reject if the grid cell is already occupied, either by a tower or a grid obstacle.
    if (
      this.grid.isCellOccupied(candidateTower.x, candidateTower.y) ||
      this.hasTowerAt(candidateTower.x, candidateTower.y)
    ) {
      return false;
    }

    // Create a candidate obstacle set including the new tower.
    const candidateObstacles = this.getObstacleSet();
    candidateObstacles.add(`${candidateTower.x},${candidateTower.y}`);

    const gridWidth = canvasWidth / 20;
    const gridHeight = canvasHeight / 20;
    const baseRoute = waypointManager.getWaypoints();
    if (baseRoute.length < 2) {
      return false;
    }

    // Validate the route between each pair of consecutive waypoints.
    for (let i = 0; i < baseRoute.length - 1; i++) {
      const startGrid: IGridPosition = {
        x: Math.min(baseRoute[i].x, gridWidth - 1),
        y: Math.min(baseRoute[i].y, gridHeight - 1),
      };
      const endGrid: IGridPosition = {
        x: Math.min(baseRoute[i + 1].x, gridWidth - 1),
        y: Math.min(baseRoute[i + 1].y, gridHeight - 1),
      };

      const path = findPath(
        startGrid,
        endGrid,
        gridWidth,
        gridHeight,
        candidateObstacles,
      );
      if (!path || path.length === 0) {
        console.warn(
          `[TowerManager] Tower candidate at (${candidateTower.x}, ${candidateTower.y}) blocks the path between (${startGrid.x}, ${startGrid.y}) and (${endGrid.x}, ${endGrid.y}).`,
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Place the tower:
   * - Validate placement.
   * - Mark the grid cell as occupied.
   * - Publish an event to trigger re-routing of enemies.
   */
  addTower(
    tower: Tower,
    canvasWidth: number,
    canvasHeight: number,
    waypointManager: WaypointManager,
  ): boolean {
    if (
      !this.canPlaceTower(tower, canvasWidth, canvasHeight, waypointManager)
    ) {
      return false;
    }

    // Mark grid cell as occupied.
    this.grid.setCellOccupancy(tower.x, tower.y, true);
    this.towers.push(tower);

    // Update obstacles and notify other systems.
    const obstacles = this.getObstacleSet();
    EventBus.getInstance().publish('obstaclesUpdated', { obstacles });

    return true;
  }

  /**
   * Render towers.
   */
  draw(graphics: Phaser.GameObjects.Graphics, gridSize: number): void {
    this.towers.forEach((tower) => {
      graphics.fillStyle(0x0000ff, 1);
      const pixelX = tower.x * gridSize + gridSize / 2;
      const pixelY = tower.y * gridSize + gridSize / 2;
      graphics.fillRect(
        pixelX - tower.size / 2,
        pixelY - tower.size / 2,
        tower.size,
        tower.size,
      );
    });
  }
}
