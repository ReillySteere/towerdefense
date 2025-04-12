// File: src/ui/engine/scenes/GameScene.ts
import Phaser from 'phaser';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { EnemyManager } from '../managers/EnemyManager';
import { Tower } from '../entities/tower/Tower';
import { Projectile } from '../entities/tower/Projectile';
import { TowerManager } from '../managers/TowerManager';
import { GameGrid } from '../core/GameGrid';

const GRID_SIZE = 20; // Grid cell size in pixels.
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export class GameScene extends Phaser.Scene {
  // Managers
  private waypointManager: WaypointManager;
  private enemyManager: EnemyManager;
  private towerManager: TowerManager;
  private gameGrid: GameGrid;

  private projectiles: Projectile[] = [];

  private enemyGraphics: Phaser.GameObjects.Graphics;
  private debugText: Phaser.GameObjects.Text;
  private debugErrorMessage: string = '';
  private waveCount: number = 1;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // No assets for now.
  }

  create(): void {
    // Compute grid dimensions.
    const gridWidth = CANVAS_WIDTH / GRID_SIZE; // e.g., 40 cells horizontally
    const gridHeight = CANVAS_HEIGHT / GRID_SIZE; // e.g., 30 cells vertically

    // Create the central game grid.
    this.gameGrid = new GameGrid(gridWidth, gridHeight);

    // Initialize the waypoint manager (waypoints are now in grid coordinates).
    this.waypointManager = new WaypointManager();
    // Initialize the enemy manager, now passing both the waypoint manager and the game grid.
    this.enemyManager = new EnemyManager(this.waypointManager, this.gameGrid);
    // Initialize the tower manager with the game grid so it can update obstacles directly.
    this.towerManager = new TowerManager(this.gameGrid);

    // Spawn an initial wave of enemies.
    this.enemyManager.spawnEnemyWave(3);

    // Set up graphics and HUD.
    this.enemyGraphics = this.add.graphics();
    this.debugText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.cameras.main.setBackgroundColor('#242424');

    // Tower placement: convert pointer pixel coordinates to grid coordinates.
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Convert pointer pixel position to grid coordinates.
      const gridX = Math.floor(pointer.worldX / GRID_SIZE);
      const gridY = Math.floor(pointer.worldY / GRID_SIZE);

      // Create a new Tower using grid coordinates.
      const newTower = new Tower(gridX, gridY);
      // TowerManager will update the GameGrid accordingly.
      const added = this.towerManager.addTower(newTower);

      if (!added) {
        this.debugErrorMessage =
          'Invalid tower placement: either already placed or blocking access.';
        return;
      }
      this.debugErrorMessage = '';
    });

    // New wave trigger on key "N".
    this.input?.keyboard?.on('keydown-N', () => {
      // Spawn a new wave of enemies.
      this.enemyManager.spawnEnemyWave(3);
      // Re-route all enemies by having EnemyManager query the updated grid.
      this.enemyManager.reRouteAllEnemies();
      this.waveCount++;
    });
  }

  update(time: number, delta: number): void {
    this.enemyManager.update(delta);
    this.drawScene();
    this.updateDebugHUD();
  }

  /**
   * Draws the game scene. All logic is performed in grid coordinates;
   * conversion to pixel coordinates happens for drawing.
   */
  private drawScene(): void {
    this.enemyGraphics.clear();

    // Draw base waypoint path.
    // Convert waypoints (grid) to pixel positions.
    const baseWaypoints = this.waypointManager.getWaypoints().map((wp) => ({
      x: wp.x * GRID_SIZE + GRID_SIZE / 2,
      y: wp.y * GRID_SIZE + GRID_SIZE / 2,
    }));
    this.enemyGraphics.lineStyle(2, 0x00ff00, 1);
    for (let i = 0; i < baseWaypoints.length - 1; i++) {
      this.enemyGraphics.strokeLineShape(
        new Phaser.Geom.Line(
          baseWaypoints[i].x,
          baseWaypoints[i].y,
          baseWaypoints[i + 1].x,
          baseWaypoints[i + 1].y,
        ),
      );
    }
    baseWaypoints.forEach((point) => {
      this.enemyGraphics.fillStyle(0x0000ff, 1);
      this.enemyGraphics.fillCircle(point.x, point.y, 4);
    });

    // Draw enemy routes and enemies.
    this.enemyManager.getEnemies().forEach((enemy) => {
      // Convert enemy route (grid) to pixel coordinates.
      const routePixels = enemy.currentWaypoints.map((wp) => ({
        x: wp.x * GRID_SIZE + GRID_SIZE / 2,
        y: wp.y * GRID_SIZE + GRID_SIZE / 2,
      }));

      // Draw enemy's route in light green.
      this.enemyGraphics.lineStyle(2, 0x00aa00, 1);
      for (let i = routePixels.length - 1; i > 0; i--) {
        this.enemyGraphics.strokeLineShape(
          new Phaser.Geom.Line(
            routePixels[i].x,
            routePixels[i].y,
            routePixels[i - 1].x,
            routePixels[i - 1].y,
          ),
        );
      }

      // Draw the enemy as a red circle.
      const enemyPixelPos = {
        x: enemy.x * GRID_SIZE + GRID_SIZE / 2,
        y: enemy.y * GRID_SIZE + GRID_SIZE / 2,
      };
      this.enemyGraphics.fillStyle(0xff0000, 1);
      this.enemyGraphics.fillCircle(enemyPixelPos.x, enemyPixelPos.y, 10);
    });

    // Draw towers.
    this.towerManager.draw(this.enemyGraphics);
  }

  /**
   * Updates the debug HUD showing enemy positions, routes, and other game state data.
   */
  private updateDebugHUD(): void {
    let debugInfo = '';
    this.enemyManager.getEnemies().forEach((enemy, index) => {
      debugInfo += `Enemy ${index + 1}: ${enemy.name}\n`;
      debugInfo += `  Pos (grid): (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})\n`;
      debugInfo += `  WP Index: ${enemy.currentWaypointIndex}/${enemy.currentWaypoints.length - 1}\n`;
      debugInfo += `  Next Orig Target: (${enemy
        .getNextOriginalTarget()
        .x.toFixed(2)}, ${enemy.getNextOriginalTarget().y.toFixed(2)})\n`;
      debugInfo += `  Current Path: ${enemy.currentWaypoints
        .map((w) => `(${w.x.toFixed(2)}, ${w.y.toFixed(2)})`)
        .join(' -> ')}\n`;
      debugInfo += `  Temp Segment: ${
        enemy.lastRerouteSegment
          .map((w) => `(${w.x.toFixed(2)}, ${w.y.toFixed(2)})`)
          .join(' -> ') || 'None'
      }\n\n`;
    });
    debugInfo += `Towers: ${this.towerManager.getTowers().length}\n`;
    debugInfo += `Projectiles: ${this.projectiles.length}\n\n`;
    if (this.debugErrorMessage) {
      debugInfo += `Error: ${this.debugErrorMessage}\n`;
    }
    this.debugText.setText(debugInfo);
  }
}
