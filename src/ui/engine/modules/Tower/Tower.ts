import { MovingEnemy } from '../Enemy/MovingEnemy';
import { Projectile } from './Projectile';
import { gridToPixel } from '../../utilities/GridUtils';

export class Tower {
  public x: number;
  public y: number;
  public range: number = 200; // Tower firing range in pixels.
  public firingRate: number = 1000; // Firing interval in milliseconds.
  private lastFired: number = 0; // Timestamp when the tower last fired.
  public size: number = 20; // Tower size (20x20, same as enemy diameter).

  public readonly cost = 5;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Determines if an enemy is within range using grid-to-pixel conversion.
   * @param enemy - The enemy to check.
   * @param gridSize - The size of one grid cell in pixels.
   * @returns True if within range; otherwise false.
   */
  public isEnemyInRange(enemy: MovingEnemy, gridSize: number): boolean {
    const towerPos = gridToPixel(this.x, this.y, gridSize);
    const enemyPos = gridToPixel(enemy.x, enemy.y, gridSize);
    const dx = enemyPos.pixelX - towerPos.pixelX;
    const dy = enemyPos.pixelY - towerPos.pixelY;
    const distance = Math.hypot(dx, dy);

    return distance <= this.range;
  }

  /**
   * Update the tower: if an enemy is in range and the firing cooldown
   * has passed, fire a projectile.
   * @param enemy - The enemy to target.
   * @param currentTime - The current time in milliseconds.
   * @param gridSize - The size of one grid cell in pixels.
   * @returns A Projectile if fired; otherwise, null.
   */
  public update(
    enemy: MovingEnemy,
    currentTime: number,
    gridSize: number,
  ): Projectile | null {
    if (
      this.isEnemyInRange(enemy, gridSize) &&
      currentTime - this.lastFired >= this.firingRate
    ) {
      this.lastFired = currentTime;
      return this.fireProjectile(enemy, gridSize);
    }
    return null;
  }

  /**
   * Fires a projectile aimed at the target enemy.
   * @param enemy - The enemy to target.
   * @param gridSize - The size of one grid cell in pixels.
   * @returns A new Projectile instance.
   */
  private fireProjectile(enemy: MovingEnemy, gridSize: number): Projectile {
    // Calculate the center of the tower in pixel coordinates.
    const towerPos = gridToPixel(this.x, this.y, gridSize);
    // Create a projectile with the specified speed and pass the gridSize for further conversions.
    return new Projectile(
      towerPos.pixelX,
      towerPos.pixelY,
      enemy,
      0.7,
      gridSize,
    );
  }
}
