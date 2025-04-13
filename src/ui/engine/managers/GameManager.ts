import { GameGrid } from '../core/GameGrid';
import { Projectile } from '../entities/tower/Projectile';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { EventBus } from '../events/EventBus';
import { PathPlanningService } from '../services/PathPlanningService';
import { RendererService } from '../services/RendererService';
import EnemyManager from './EnemyManager';
import TowerManager from './TowerManager';

class GameManager {
  #enemyManager: EnemyManager;
  #gameGrid: GameGrid;
  #pathPlanningService: PathPlanningService;
  #projectiles: Projectile[] = [];
  #rendererService: RendererService;
  #scene: Phaser.Scene;
  #towerManager: TowerManager;
  #waveCount: number = 1;
  #waypointManager: WaypointManager;

  constructor(scene: Phaser.Scene) {
    this.#gameGrid = new GameGrid();
    this.#pathPlanningService = new PathPlanningService({
      gameGrid: this.#gameGrid,
    });

    this.#scene = scene;
    this.#enemyManager = new EnemyManager({
      gameGrid: this.#gameGrid,
      pathPlanningService: this.#pathPlanningService,
    });

    this.#rendererService = new RendererService({ gameGrid: this.#gameGrid });

    this.#towerManager = new TowerManager({
      gameGrid: this.#gameGrid,
      pathPlanningService: this.#pathPlanningService,
    });

    this.#waypointManager = new WaypointManager();

    EventBus.getInstance().subscribe('obstaclesUpdated', () => {
      const obstacles = this.#gameGrid.getObstacles();
      this.#enemyManager.reRouteAllEnemies({ obstacles });
    });
  }

  create() {
    const baseRoute = this.#waypointManager.getWaypoints();

    this.#scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const { gridX, gridY } = this.#gameGrid.pixelToGrid(pointer.x, pointer.y);

      this.#towerManager.addTower({
        baseRoute,
        gridX,
        gridY,
      });
    });

    // New wave trigger on key "N".
    this.#scene.input?.keyboard?.on('keydown-N', () => {
      // Spawn a new wave of enemies.
      this.#enemyManager.spawnEnemyWave(baseRoute, 3);

      // Re-route all enemies by having EnemyManager query the updated grid.
      this.#enemyManager.reRouteAllEnemies({
        obstacles: this.#gameGrid.getObstacles(),
      });
      this.#waveCount++;
    });
  }

  update(timeSinceLastFrame: number, graphics: Phaser.GameObjects.Graphics) {
    const existingObstacles = this.#gameGrid.getObstacles();

    this.#enemyManager.update(timeSinceLastFrame, existingObstacles);
    const newProjectiles = this.#towerManager.updateTowers(
      this.#scene.time.now,
      this.#gameGrid.cellSize,
      this.#enemyManager.getEnemies(),
    );
    this.#projectiles = this.#projectiles.concat(newProjectiles);

    this.#projectiles = this.#projectiles.filter((projectile) => {
      // Update the projectile's position.
      projectile.update(timeSinceLastFrame);

      // Check each enemy for a collision.
      this.#enemyManager.getEnemies().forEach((enemy) => {
        const { pixelX, pixelY } = this.#gameGrid.gridToPixel(enemy.x, enemy.y);

        const dx = projectile.x - pixelX;
        const dy = projectile.y - pixelY;
        const distance = Math.hypot(dx, dy);

        // Use a threshold: sum of projectile radius and enemy visual radius (assumed to be 10 pixels).
        if (distance < projectile.radius + 10) {
          // Reduce enemy health by the projectile's damage.
          enemy.health -= projectile.damage;
          // Mark projectile as inactive.
          projectile.isActive = false;
        }
      });

      return projectile.isActive;
    });

    this.#enemyManager.removeDeadEnemies();

    this.#rendererService.renderScene({
      graphics,
      waypointManager: this.#waypointManager,
      enemyManager: this.#enemyManager,
      towerManager: this.#towerManager,
      projectiles: this.#projectiles,
    });
  }
}

export default GameManager;
