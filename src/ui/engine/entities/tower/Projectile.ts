import { MovingEnemy } from '../../entities/enemy/MovingEnemy';
import { gridToPixel } from '../../utilities/GridUtils';

export class Projectile {
  public x: number;
  public y: number;
  public speed: number; // Projectile speed in pixels per millisecond.
  public target: MovingEnemy;
  public radius: number = 5; // Visual size.
  public damage: number = 10;
  public isActive: boolean = true;
  private gridSize: number;

  /**
   * Creates a projectile.
   * @param x - The starting x-coordinate in pixels.
   * @param y - The starting y-coordinate in pixels.
   * @param target - The target enemy.
   * @param speed - The projectile speed - grid-cells per millisecond .
   * @param gridSize - The size of one grid cell in pixels.
   */
  constructor(
    x: number,
    y: number,
    target: MovingEnemy,
    speed: number,
    gridSize: number,
  ) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = speed;
    this.gridSize = gridSize;
  }

  /**
   * Updates the projectile's position towards the target.
   * @param delta - The elapsed time in milliseconds.
   */
  public update(delta: number): void {
    // Get the target's current position in pixel coordinates.
    const targetPos = gridToPixel(this.target.x, this.target.y, this.gridSize);
    const dx = targetPos.pixelX - this.x;
    const dy = targetPos.pixelY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      return;
    }

    const moveDistance = this.speed * delta;

    if (moveDistance >= distance || distance < 5) {
      // Snap to target and mark the projectile inactive.
      this.x = targetPos.pixelX;
      this.y = targetPos.pixelY;
      this.isActive = false;
    } else {
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }
}
