// File: src/managers/EnemyManager.ts
import { MovingEnemy } from '../entities/enemy/MovingEnemy';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { findPath, IGridPosition, getLine } from '../utilities/PathFinder';
import { GameGrid } from '../core/GameGrid';
import { EventBus } from '../events/EventBus';
import { IWaypoint } from '../entities/waypoint/IWaypoint';

// Helper function to compare two routes.
function routesAreEqual(
  routeA: IWaypoint[],
  routeB: IWaypoint[],
  tolerance: number = 0.1,
): boolean {
  if (routeA.length !== routeB.length) {
    return false;
  }
  for (let i = 0; i < routeA.length; i++) {
    if (
      Math.abs(routeA[i].x - routeB[i].x) > tolerance ||
      Math.abs(routeA[i].y - routeB[i].y) > tolerance
    ) {
      return false;
    }
  }
  return true;
}

export class EnemyManager {
  private enemies: MovingEnemy[] = [];
  private waypointManager: WaypointManager;
  private gameGrid: GameGrid;

  constructor(waypointManager: WaypointManager, gameGrid: GameGrid) {
    this.waypointManager = waypointManager;
    this.gameGrid = gameGrid;
    EventBus.getInstance().subscribe('obstaclesUpdated', () => {
      this.reRouteAllEnemies();
    });
  }

  public getEnemies(): MovingEnemy[] {
    return this.enemies;
  }

  /**
   * Extracted common function to build a new path for an enemy toward its next original waypoint.
   * This function builds a set of positions for all other enemies (to discourage stacking),
   * then computes and returns the new path using findPath().
   *
   * @param enemy - The enemy to build a path for.
   * @param obstacles - The set of obstacles.
   * @returns The new path as an array of IGridPosition or null if no valid path is found.
   */
  private buildNewPath(
    enemy: MovingEnemy,
    obstacles: Set<string>,
  ): IGridPosition[] | null {
    // Build a set of positions (in "x,y" format) for all other enemies.
    const enemyPositions = new Set<string>();
    this.enemies.forEach((otherEnemy) => {
      if (otherEnemy !== enemy) {
        const key = `${Math.floor(otherEnemy.x)},${Math.floor(otherEnemy.y)}`;
        enemyPositions.add(key);
      }
    });

    if (enemy.nextOriginalIndex >= enemy.originalWaypoints.length) {
      return null;
    }
    const enemyGrid: IGridPosition = {
      x: Math.floor(enemy.x),
      y: Math.floor(enemy.y),
    };
    const targetWaypoint = enemy.originalWaypoints[enemy.nextOriginalIndex];
    const targetGrid: IGridPosition = {
      x: targetWaypoint.x,
      y: targetWaypoint.y,
    };

    return findPath(
      enemyGrid,
      targetGrid,
      this.gameGrid.width,
      this.gameGrid.height,
      obstacles,
      enemyPositions, // This extra parameter will let findPath add penalty for enemy stacking.
    );
  }

  public update(delta: number): void {
    const obstacles = this.gameGrid.getObstacles();
    this.enemies.forEach((enemy) => {
      enemy.update(delta);

      // If the enemy's current segment is blocked...
      if (enemy.isRouteBlocked(obstacles)) {
        const newPath = this.buildNewPath(enemy, obstacles);
        if (newPath && newPath.length > 0) {
          if (
            !routesAreEqual(
              newPath,
              enemy.currentWaypoints.slice(enemy.currentWaypointIndex),
            )
          ) {
            enemy.reroute(newPath);
          }
        }
      }
      // If the enemy has reached the end of its current route but still has further targets...
      else if (
        enemy.hasReachedWaypoint() &&
        enemy.currentWaypointIndex === enemy.currentWaypoints.length - 1 &&
        enemy.nextOriginalIndex < enemy.originalWaypoints.length
      ) {
        const newPath = this.buildNewPath(enemy, obstacles);
        if (newPath && newPath.length > 0) {
          enemy.reroute(newPath);
        }
      }
    });
  }

  public reRouteAllEnemies(): void {
    const obstacles = this.gameGrid.getObstacles();
    this.enemies.forEach((enemy) => {
      const newPath = this.buildNewPath(enemy, obstacles);
      if (newPath && newPath.length > 0) {
        if (
          !routesAreEqual(
            newPath,
            enemy.currentWaypoints.slice(enemy.currentWaypointIndex),
          )
        ) {
          enemy.reroute(newPath);
        }
      }
    });
  }

  public removeDeadEnemies(): void {
    this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
  }

  public spawnEnemyWave(count: number): void {
    const baseRoute = this.waypointManager.getWaypoints();
    for (let i = 0; i < count; i++) {
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
        0.005,
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
