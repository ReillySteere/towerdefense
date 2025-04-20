import { GameGrid } from '../../core/GameGrid';
import { MovingEnemy } from './MovingEnemy';
import { IWaypoint } from '../../entities/waypoint/IWaypoint';
import { GameState } from 'ui/engine/modules/Game/GameState';
import {
  PathPlanningService,
  type IGridPosition,
} from '../../services/PathPlanningService';

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

interface EnemyManagerProps {
  gameGrid: GameGrid;
  pathPlanningService: PathPlanningService;
  scene: Phaser.Scene;
}
class EnemyManager {
  #enemies: MovingEnemy[] = [];
  #gameGrid: GameGrid;
  #pathPlanningService: PathPlanningService;
  #scene: Phaser.Scene;
  #state: GameState;

  constructor({ gameGrid, pathPlanningService, scene }: EnemyManagerProps) {
    this.#gameGrid = gameGrid;
    this.#pathPlanningService = pathPlanningService;
    this.#scene = scene;
    this.#state = GameState.getInstance();
  }

  public getEnemies(): MovingEnemy[] {
    return this.#enemies;
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
    this.#enemies.forEach((otherEnemy) => {
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

    return this.#pathPlanningService.computePath(
      enemyGrid,
      targetGrid,
      obstacles,
      enemyPositions,
      undefined, // Optionally, you could pass in tower positions here.
    );
  }

  public update(delta: number, obstacles: Set<string>): void {
    this.#enemies.forEach((enemy) => {
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

  public reRouteAllEnemies({ obstacles }: { obstacles: Set<string> }): void {
    this.#enemies.forEach((enemy) => {
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
    let totalReward = 0;
    this.#enemies = this.#enemies.filter((enemy) => {
      if (enemy.health <= 0) {
        totalReward += enemy.reward;
        return false; // drop from array
      }
      return true;
    });
    if (totalReward > 0) {
      this.#state.addMoney(totalReward);
      this.#scene.events.emit('moneyUpdate', this.#state.money);
    }
  }

  public spawnEnemyWave(baseRoute: IWaypoint[], count: number): void {
    for (let i = 0; i < count; i++) {
      const offsetX = i * 0.5;
      const offsetY = i * 0.25;
      const startingPoint = {
        x: baseRoute[0].x + offsetX,
        y: baseRoute[0].y + offsetY,
      };

      const enemy = new MovingEnemy(
        `Enemy_${this.#enemies.length + 1}`,
        100,
        baseRoute,
        0.01,
      );
      enemy.x = startingPoint.x;
      enemy.y = startingPoint.y;
      enemy.currentWaypoints[0] = { ...startingPoint };

      this.#enemies.push(enemy);
    }
  }

  public draw(graphics: Phaser.GameObjects.Graphics): void {
    this.getEnemies().forEach((enemy) => {
      const routePixels = enemy.currentWaypoints.map((wp) =>
        this.#gameGrid.gridToPixel(wp.x, wp.y),
      );

      // Draw enemy's route (in light green).
      graphics.lineStyle(2, 0x00aa00, 1);
      for (let i = routePixels.length - 1; i > 0; i--) {
        graphics.strokeLineShape(
          new Phaser.Geom.Line(
            routePixels[i].pixelX,
            routePixels[i].pixelY,
            routePixels[i - 1].pixelX,
            routePixels[i - 1].pixelY,
          ),
        );
      }

      // Draw enemy as a red circle.
      const enemyPos = this.#gameGrid.gridToPixel(enemy.x, enemy.y);
      graphics.fillStyle(0xff0000, 1);
      graphics.fillCircle(enemyPos.pixelX, enemyPos.pixelY, 10);
    });
  }

  public clearEnemies(): void {
    this.#enemies = [];
  }
}

export default EnemyManager;
