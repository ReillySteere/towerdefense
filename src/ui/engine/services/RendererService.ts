import Phaser from 'phaser';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { EnemyManager, TowerManager } from '../managers';
import { Projectile } from '../modules/Tower/Projectile';
import { GameGrid } from '../core/GameGrid';

interface RendererServiceProps {
  gameGrid: GameGrid;
}

interface RenderProps {
  graphics: Phaser.GameObjects.Graphics;
  waypointManager: WaypointManager;
  enemyManager: EnemyManager;
  towerManager: TowerManager;
  projectiles: Projectile[];
}

export class RendererService {
  #gameGrid: GameGrid;

  constructor({ gameGrid }: RendererServiceProps) {
    this.#gameGrid = gameGrid;
  }

  /**
   * Renders the entire game scene.
   *
   * @param graphics - The Phaser graphics object used for drawing.
   * @param waypointManager - Provides the base waypoints.
   * @param enemyManager - Provides enemy routes and positions.
   * @param towerManager - Responsible for drawing towers.
   * @param projectiles - Array of projectiles to draw.
   */
  public renderScene({
    graphics,
    waypointManager,
    enemyManager,
    towerManager,
    projectiles,
  }: RenderProps): void {
    // Clear previous drawings.
    graphics.clear();

    // --- Draw Base Waypoints ---
    const baseWaypoints = waypointManager
      .getWaypoints()
      .map((wp) => this.#gameGrid.gridToPixel(wp.x, wp.y));

    graphics.lineStyle(2, 0x00ff00, 1);
    for (let i = 0; i < baseWaypoints.length - 1; i++) {
      graphics.strokeLineShape(
        new Phaser.Geom.Line(
          baseWaypoints[i].pixelX,
          baseWaypoints[i].pixelY,
          baseWaypoints[i + 1].pixelX,
          baseWaypoints[i + 1].pixelY,
        ),
      );
    }
    baseWaypoints.forEach((point) => {
      graphics.fillStyle(0x0000ff, 1);
      graphics.fillCircle(point.pixelX, point.pixelY, 4);
    });

    // --- Draw Enemies and their Routes ---
    enemyManager.draw(graphics);

    // --- Draw Towers ---
    // TowerManager already provides a draw method that uses the provided gridSize.
    towerManager.draw(graphics);

    // --- Draw Projectiles ---
    // We assume that projectile positions are already in pixel space.
    projectiles.forEach((projectile) => {
      graphics.fillStyle(0xffa500, 1);
      graphics.fillCircle(projectile.x, projectile.y, projectile.radius);
    });
  }
}
