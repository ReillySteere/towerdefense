import { MovingEnemy } from '../entities/enemy/MovingEnemy';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { findPath, IGridPosition, getLine } from '../utilities/PathFinder';
import { GameGrid } from '../core/GameGrid';

export class EnemyManager {
  private enemies: MovingEnemy[] = [];
  private waypointManager: WaypointManager;
  private gameGrid: GameGrid;

  constructor(waypointManager: WaypointManager, gameGrid: GameGrid) {
    this.waypointManager = waypointManager;
    this.gameGrid = gameGrid;
  }

  public getEnemies(): MovingEnemy[] {
    return this.enemies;
  }

  /**
   * Update enemy positions.
   */
  public update(delta: number): void {
    const obstacles = this.gameGrid.getObstacles();
    this.enemies.forEach((enemy) => {
      enemy.update(delta);
      // If the enemy has reached its current waypoint, check its route.
      if (enemy.hasReachedWaypoint()) {
        this.reRouteEnemy(enemy, obstacles);
      }
    });
  }

  /**
   * Re-route a single enemy based on its next waypoint.
   * Enemy's current position is rounded to integer grid coordinates before the check.
   */
  private reRouteEnemy(enemy: MovingEnemy, obstacles: Set<string>): void {
    if (enemy.nextOriginalIndex < enemy.originalWaypoints.length) {
      // Convert enemy's current (fractional) grid position to integer grid coordinates.
      const enemyGrid: IGridPosition = {
        x: Math.floor(enemy.x),
        y: Math.floor(enemy.y),
      };
      const targetWaypoint = enemy.originalWaypoints[enemy.nextOriginalIndex];
      const targetGrid: IGridPosition = {
        x: targetWaypoint.x,
        y: targetWaypoint.y,
      };

      const line = getLine(enemyGrid, targetGrid);
      const blocked = line.some((cell) => obstacles.has(`${cell.x},${cell.y}`));

      if (blocked) {
        const newPath = findPath(
          enemyGrid,
          targetGrid,
          this.gameGrid.width,
          this.gameGrid.height,
          obstacles,
        );
        if (newPath && newPath.length > 0) {
          enemy.reroute(newPath);
        }
      }
    }
  }

  /**
   * Re-route all enemies in response to an obstacle update.
   */
  public reRouteAllEnemies(): void {
    const obstacles = this.gameGrid.getObstacles();
    this.enemies.forEach((enemy) => {
      if (enemy.nextOriginalIndex < enemy.originalWaypoints.length) {
        const enemyGrid: IGridPosition = {
          x: Math.floor(enemy.x),
          y: Math.floor(enemy.y),
        };
        const targetWaypoint = enemy.originalWaypoints[enemy.nextOriginalIndex];
        const targetGrid: IGridPosition = {
          x: targetWaypoint.x,
          y: targetWaypoint.y,
        };

        const line = getLine(enemyGrid, targetGrid);
        const blocked = line.some((cell) =>
          obstacles.has(`${cell.x},${cell.y}`),
        );
        if (blocked) {
          const newPath = findPath(
            enemyGrid,
            targetGrid,
            this.gameGrid.width,
            this.gameGrid.height,
            obstacles,
          );
          if (newPath && newPath.length > 0) {
            enemy.reroute(newPath);
          }
        }
      }
    });
  }

  /**
   * Spawn new enemies using grid coordinates for starting positions.
   * Assumes waypointManager returns waypoints in grid coordinates.
   */
  public spawnEnemyWave(count: number): void {
    const baseRoute = this.waypointManager.getWaypoints();
    for (let i = 0; i < count; i++) {
      // Use grid offsets (adjust as needed).
      const offsetX = i * 0.5;
      const offsetY = i * 0.25;
      const startingPoint = {
        x: baseRoute[0].x + offsetX,
        y: baseRoute[0].y + offsetY,
      };

      const enemy = new MovingEnemy(
        `Enemy_${this.enemies.length + 1}`,
        100,
        baseRoute,
        0.005, // speed in grid cells/ms
      );
      enemy.x = startingPoint.x;
      enemy.y = startingPoint.y;
      enemy.currentWaypoints[0] = { ...startingPoint };

      this.enemies.push(enemy);
    }
  }

  public clearEnemies(): void {
    this.enemies = [];
  }
}
