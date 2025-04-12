import { GameGrid } from '../core/GameGrid';
import { Tower } from '../entities/tower/Tower';
import { findPath, IGridPosition } from '../utilities/PathFinder';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { EventBus } from '../events/EventBus';

export class TowerManager {
  private towers: Tower[] = [];

  constructor(private grid: GameGrid) {}

  hasTowerAt(x: number, y: number): boolean {
    return this.towers.some((tower) => tower.x === x && tower.y === y);
  }

  getTowers(): Tower[] {
    return this.towers;
  }

  getObstacleSet(): Set<string> {
    const obstacles = new Set<string>();
    this.towers.forEach((tower) => {
      // Here tower.x and tower.y are assumed to be grid coordinates.
      obstacles.add(`${tower.x},${tower.y}`);
    });
    return obstacles;
  }

  public canPlaceTower(
    candidateTower: Tower,
    canvasWidth: number,
    canvasHeight: number,
    waypointManager: WaypointManager,
  ): boolean {
    const candidateObstacles = this.getObstacleSet();
    candidateObstacles.add(`${candidateTower.x},${candidateTower.y}`);

    const gridWidth = canvasWidth / 20;
    const gridHeight = canvasHeight / 20;
    const baseRoute = waypointManager.getWaypoints();
    if (baseRoute.length < 2) {
      return false;
    }

    for (let i = 0; i < baseRoute.length - 1; i++) {
      const startWaypoint = baseRoute[i];
      const endWaypoint = baseRoute[i + 1];

      const startGrid: IGridPosition = {
        x: Math.min(startWaypoint.x, gridWidth - 1),
        y: Math.min(startWaypoint.y, gridHeight - 1),
      };
      const endGrid: IGridPosition = {
        x: Math.min(endWaypoint.x, gridWidth - 1),
        y: Math.min(endWaypoint.y, gridHeight - 1),
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
          `[TowerManager] Tower candidate at (${candidateTower.x}, ${candidateTower.y}) blocks segment from (${startGrid.x},${startGrid.y}) to (${endGrid.x},${endGrid.y}).`,
        );
        return false;
      }
    }

    return true;
  }

  addTower(tower: Tower): boolean {
    if (this.grid.isBlocked(tower.x, tower.y)) {
      // Already occupied.
      return false;
    }

    this.towers.push(tower);
    console.log(`[TowerManager] Tower added at (${tower.x}, ${tower.y}).`);
    const obstacles = this.getObstacleSet();
    EventBus.getInstance().publish('obstaclesUpdated', { obstacles });

    return true;
  }

  draw(graphics: Phaser.GameObjects.Graphics): void {
    this.towers.forEach((tower) => {
      graphics.fillStyle(0x0000ff, 1);
      // Multiply by grid cell size (20) for drawing.
      const pixelX = tower.x * 20 + 10; // centered in the cell
      const pixelY = tower.y * 20 + 10;
      graphics.fillRect(
        pixelX - tower.size / 2,
        pixelY - tower.size / 2,
        tower.size,
        tower.size,
      );
    });
  }
}
