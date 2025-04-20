import { GameGrid } from '../../core/GameGrid';
import { Projectile } from '../Tower/Projectile';
import { WaypointManager } from '../../entities/waypoint/WaypointManager';
import { PathPlanningService } from '../../services/PathPlanningService';
import { RendererService } from '../../services/RendererService';
import EnemyManager from '../Enemy/EnemyManager';
import TowerManager from '../Tower/TowerManager';
import { GameState } from './GameState';
import { on } from 'shared/eventBus';

class GameManager {
  #endWaypoint!: { x: number; y: number };
  #enemyManager: EnemyManager;
  #gameGrid: GameGrid;
  #gameOverTriggered: boolean = false;
  #pathPlanningService: PathPlanningService;
  #projectiles: Projectile[] = [];
  #rendererService: RendererService;
  #scene: Phaser.Scene;
  #state: GameState;
  #towerManager: TowerManager;
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
      scene,
    });

    this.#rendererService = new RendererService({ gameGrid: this.#gameGrid });

    this.#state = GameState.getInstance();

    this.#towerManager = new TowerManager({
      gameGrid: this.#gameGrid,
      pathPlanningService: this.#pathPlanningService,
      scene,
    });

    this.#waypointManager = new WaypointManager();

    scene.events.on('obstaclesUpdated', () => {
      const obstacles = this.#gameGrid.getObstacles();
      this.#enemyManager.reRouteAllEnemies({ obstacles });
    });
  }

  create() {
    const baseRoute = this.#waypointManager.getWaypoints();
    this.#endWaypoint = baseRoute[baseRoute.length - 1];

    this.#scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const { gridX, gridY } = this.#gameGrid.pixelToGrid(pointer.x, pointer.y);

      this.#towerManager.addTower({
        baseRoute,
        gridX,
        gridY,
      });

      this.#scene.events.emit('debugError', {
        message: `Tower added at (${gridX}, ${gridY})`,
        source: 'GameManager',
      });
    });

    this.#scene.input?.keyboard?.on('keydown-N', () => this.startNextWave());
    on('startNextWave', () => this.startNextWave());
  }

  update(timeSinceLastFrame: number, graphics: Phaser.GameObjects.Graphics) {
    const existingObstacles = this.#gameGrid.getObstacles();

    this.#enemyManager.update(timeSinceLastFrame, existingObstacles);

    this.#enemyManager.getEnemies().forEach((enemy) => {
      const reachedBase =
        Math.abs(enemy.x - this.#endWaypoint.x) < 0.1 &&
        Math.abs(enemy.y - this.#endWaypoint.y) < 0.1;

      if (reachedBase) {
        this.#state.decrementLives();
        enemy.health = 0;
        this.#scene.events.emit('livesUpdate', this.#state.lives);
      }
    });

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

  private startNextWave() {
    const baseRoute = this.#waypointManager.getWaypoints();

    this.#enemyManager.spawnEnemyWave(baseRoute, 3);
    this.#enemyManager.reRouteAllEnemies({
      obstacles: this.#gameGrid.getObstacles(),
    });

    this.#state.incrementWave();
    this.#scene.events.emit('waveUpdate', this.#state.wave);
  }
}

export default GameManager;
