import Phaser from 'phaser';
import { WaypointManager } from '../entities/waypoint/WaypointManager';
import { MovingEnemy } from '../entities/enemy/MovingEnemy';
import { Tower } from '../entities/tower/Tower';
import { Projectile } from '../entities/tower/Projectile';
import { findPath, IGridPosition } from '../utilities/PathFinder';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export class GameScene extends Phaser.Scene {
  private enemies: MovingEnemy[] = [];
  private enemyGraphics: Phaser.GameObjects.Graphics;
  private debugText: Phaser.GameObjects.Text;
  private waypointManager: WaypointManager;
  private towers: Tower[] = [];
  private projectiles: Projectile[] = [];
  private debugErrorMessage: string = '';

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // No assets to load.
  }

  create(): void {
    this.waypointManager = new WaypointManager();
    // Create an enemy that loops along its route.
    const enemy = new MovingEnemy(
      'Enemy1',
      100,
      this.waypointManager.getWaypoints(),
      0.4,
      true,
    );
    this.enemies.push(enemy);
    this.checkAndReRouteAllEnemies();
    this.enemyGraphics = this.add.graphics();
    this.debugText = this.add.text(10, 10, '', {
      fontSize: '16px',
      fill: '#ffffff',
    });
    this.cameras.main.setBackgroundColor('#242424');

    // Register pointer event for tower placement.
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const snappedX =
        Math.floor(pointer.worldX / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const snappedY =
        Math.floor(pointer.worldY / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

      // Check if a tower is already in this cell.
      if (this.towers.some((t) => t.x === snappedX && t.y === snappedY)) {
        this.debugErrorMessage = 'Tower already placed in that cell.';
        return;
      }

      // Determine candidate tower's grid coordinates.
      const candidateGridX = this.pixelToGrid(snappedX);
      const candidateGridY = this.pixelToGrid(snappedY);
      const candidateGridKey = `${candidateGridX},${candidateGridY}`;

      // Build the candidate obstacle set: existing towers plus the candidate.
      const candidateObstacles = new Set<string>();
      this.towers.forEach((tower) => {
        const gridX = this.pixelToGrid(tower.x);
        const gridY = this.pixelToGrid(tower.y);
        candidateObstacles.add(`${gridX},${gridY}`);
      });
      candidateObstacles.add(candidateGridKey);

      const gridWidth = CANVAS_WIDTH / GRID_SIZE;
      const gridHeight = CANVAS_HEIGHT / GRID_SIZE;

      // Instead of checking only the enemy's current route, check every segment
      // of the immutable original route—but only if the candidate is near the segment.
      let placementValid = true;
      for (const enemy of this.enemies) {
        const orig = enemy.originalWaypoints;
        for (let i = 0; i < orig.length - 1; i++) {
          // Convert the original waypoints to grid coordinates.
          const startGrid = {
            x: this.pixelToGrid(orig[i].x),
            y: this.pixelToGrid(orig[i].y),
          };
          const endGrid = {
            x: this.pixelToGrid(orig[i + 1].x),
            y: this.pixelToGrid(orig[i + 1].y),
          };

          // Compute distance from candidate tower's grid center to the segment.
          const distance = this.pointLineDistance(
            candidateGridX,
            candidateGridY,
            startGrid.x,
            startGrid.y,
            endGrid.x,
            endGrid.y,
          );

          // Only check connectivity if candidate is close to the segment.
          if (distance < 0.7) {
            // Threshold can be adjusted (in grid cell units)
            const path = findPath(
              startGrid,
              endGrid,
              gridWidth,
              gridHeight,
              candidateObstacles,
            );
            if (path === null) {
              placementValid = false;
              this.debugErrorMessage = `Tower placement blocks route for enemy ${enemy.name} between waypoint ${i} and ${i + 1}.`;
              break;
            }
          }
        }
        if (!placementValid) break;
      }

      if (!placementValid) {
        return;
      }

      // Clear any previous error message.
      this.debugErrorMessage = '';

      // Valid placement: add the tower.
      const newTower = new Tower(snappedX, snappedY);
      this.towers.push(newTower);
      console.log(`Placed tower at (${snappedX}, ${snappedY})`);

      // After placement, re-route all enemies.
      this.checkAndReRouteAllEnemies();
    });
  }

  update(time: number, delta: number): void {
    this.enemies.forEach((enemy) => enemy.update(delta));

    // Update towers (and fire projectiles).
    this.towers.forEach((tower) => {
      if (this.enemies.length > 0) {
        const projectile = tower.update(this.enemies[0], time);
        if (projectile) {
          this.projectiles.push(projectile);
        }
      }
    });

    // Update projectiles.
    this.projectiles.forEach((proj) => {
      proj.update(delta);
      if (!proj.isActive) {
        // Apply damage to enemy.
        if (this.enemies.length > 0) {
          this.enemies[0].health -= proj.damage;
        }
      }
    });
    this.projectiles = this.projectiles.filter((proj) => proj.isActive);

    const obstacles = new Set<string>();
    this.towers.forEach((tower) => {
      const gridX = this.pixelToGrid(tower.x);
      const gridY = this.pixelToGrid(tower.y);
      obstacles.add(`${gridX},${gridY}`);
    });
    // For each enemy, if it just looped, re-route it based on current obstacles.
    this.enemies.forEach((enemy) => {
      if (enemy.hasLooped) {
        this.checkAndReRouteForEnemy(enemy, obstacles);
        enemy.hasLooped = false;
      }
    });

    this.drawScene();
    this.updateDebugHUD();
  }

  // ---------------- Helper methods ----------------

  // Helper to compute the distance from point (px,py) to the line segment (x1,y1)-(x2,y2)
  private pointLineDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) {
      // in case of 0 length line
      param = dot / len_sq;
    }

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private pixelToGrid(x: number): number {
    return Math.floor(x / GRID_SIZE);
  }

  private gridToPixel(x: number): number {
    return x * GRID_SIZE + GRID_SIZE / 2;
  }

  // Uses Bresenham's algorithm to return grid cells between start and end.
  private getLine(start: IGridPosition, end: IGridPosition): IGridPosition[] {
    const points: IGridPosition[] = [];
    let x0 = start.x,
      y0 = start.y;
    const x1 = end.x,
      y1 = end.y;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      points.push({ x: x0, y: y0 });
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    return points;
  }

  /**
   * Checks and re-routes a single enemy if its direct path to its next original waypoint is blocked.
   */
  private checkAndReRouteForEnemy(
    enemy: MovingEnemy,
    obstacles: Set<string>,
  ): void {
    // Compute enemy's current grid cell.
    const enemyGrid = {
      x: this.pixelToGrid(enemy.x),
      y: this.pixelToGrid(enemy.y),
    };
    if (enemy.nextOriginalIndex >= enemy.originalWaypoints.length) return; // No target remains.
    // Get the next original target waypoint.
    const targetPixel = enemy.originalWaypoints[enemy.nextOriginalIndex];
    const targetGrid = {
      x: this.pixelToGrid(targetPixel.x),
      y: this.pixelToGrid(targetPixel.y),
    };

    // Determine if the direct grid line from enemy to target is blocked.
    const line = this.getLine(enemyGrid, targetGrid);
    const collision = line.some((cell) => obstacles.has(`${cell.x},${cell.y}`));

    if (collision) {
      const gridWidth = CANVAS_WIDTH / GRID_SIZE;
      const gridHeight = CANVAS_HEIGHT / GRID_SIZE;
      const newPath = findPath(
        enemyGrid,
        targetGrid,
        gridWidth,
        gridHeight,
        obstacles,
      );
      if (newPath) {
        const newSegment = newPath.map((cell) => ({
          x: this.gridToPixel(cell.x),
          y: this.gridToPixel(cell.y),
        }));
        console.log(
          'Re-routing enemy',
          enemy.name,
          'with new segment:',
          newSegment,
        );
        enemy.reroute(newSegment);
      } else {
        console.log('No alternative path found for enemy', enemy.name);
      }
    }
  }

  /**
   * Re-evaluates and re-routes every enemy according to the current tower placements.
   */
  private checkAndReRouteAllEnemies(): void {
    const obstacles = new Set<string>();
    this.towers.forEach((tower) => {
      const gridX = this.pixelToGrid(tower.x);
      const gridY = this.pixelToGrid(tower.y);
      obstacles.add(`${gridX},${gridY}`);
    });
    this.enemies.forEach((enemy) => {
      this.checkAndReRouteForEnemy(enemy, obstacles);
    });
  }

  // ---------------- Drawing methods ----------------

  private drawScene(): void {
    this.enemyGraphics.clear();

    // Draw the base (original) waypoint path for reference.
    const baseWaypoints = this.waypointManager.getWaypoints();
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

    // Draw each enemy's current path in a light green.
    this.enemies.forEach((enemy) => {
      this.enemyGraphics.lineStyle(2, 0x00aa00, 1);
      for (let i = enemy.currentWaypoints.length - 1; i > 0; i--) {
        this.enemyGraphics.strokeLineShape(
          new Phaser.Geom.Line(
            enemy.currentWaypoints[i].x,
            enemy.currentWaypoints[i].y,
            enemy.currentWaypoints[i - 1].x,
            enemy.currentWaypoints[i - 1].y,
          ),
        );
      }
      // If a re-route segment exists, draw it in orange.
      if (enemy.lastRerouteSegment.length > 0) {
        this.enemyGraphics.lineStyle(2, 0xffa500, 1);
        for (let i = 0; i < enemy.lastRerouteSegment.length - 1; i++) {
          this.enemyGraphics.strokeLineShape(
            new Phaser.Geom.Line(
              enemy.lastRerouteSegment[i].x,
              enemy.lastRerouteSegment[i].y,
              enemy.lastRerouteSegment[i + 1].x,
              enemy.lastRerouteSegment[i + 1].y,
            ),
          );
        }
        enemy.lastRerouteSegment.forEach((point) => {
          this.enemyGraphics.fillStyle(0xffa500, 1);
          this.enemyGraphics.fillCircle(point.x, point.y, 5);
        });
      }
    });

    // Draw enemies.
    this.enemies.forEach((enemy) => {
      this.enemyGraphics.fillStyle(0xff0000, 1);
      this.enemyGraphics.fillCircle(enemy.x, enemy.y, 10);
    });

    // Draw towers.
    this.towers.forEach((tower) => {
      this.enemyGraphics.fillStyle(0x0000ff, 1);
      this.enemyGraphics.fillRect(
        tower.x - tower.size / 2,
        tower.y - tower.size / 2,
        tower.size,
        tower.size,
      );
    });

    // Draw projectiles.
    this.projectiles.forEach((proj) => {
      this.enemyGraphics.fillStyle(0xffff00, 1);
      this.enemyGraphics.fillCircle(proj.x, proj.y, proj.radius);
    });
  }

  private updateDebugHUD(): void {
    let debugInfo = '';
    this.enemies.forEach((enemy, index) => {
      debugInfo += `Enemy ${index + 1}: ${enemy.name}\n`;
      debugInfo += `  Pos: (${enemy.x.toFixed(1)}, ${enemy.y.toFixed(1)})\n`;
      debugInfo += `  Current WP Index: ${enemy.currentWaypointIndex}/${enemy.currentWaypoints.length - 1}\n`;
      debugInfo += `  Next Original Target: (${enemy.getNextOriginalTarget().x.toFixed(1)}, ${enemy.getNextOriginalTarget().y.toFixed(1)})\n`;
      debugInfo += `  Current Path: ${enemy.currentWaypoints.map((w) => `(${w.x.toFixed(1)}, ${w.y.toFixed(1)})`).join(' -> ')}\n`;
      debugInfo += `  Temp Segment: ${enemy.lastRerouteSegment.map((w) => `(${w.x.toFixed(1)}, ${w.y.toFixed(1)})`).join(' -> ') || 'None'}\n\n`;
    });
    debugInfo += `Towers: ${this.towers.length}\nProjectiles: ${this.projectiles.length}\n\n`;
    if (this.debugErrorMessage) {
      debugInfo += `Error: ${this.debugErrorMessage}\n`;
    }
    this.debugText.setText(debugInfo);
  }
}
