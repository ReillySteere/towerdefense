import { MovingEnemy } from '../../entities/enemy/MovingEnemy';
import { Projectile } from './Projectile';

/**
 * Tower represents a stationary tower that automatically fires at enemies.
 */
export class Tower {
  public x: number;
  public y: number;
  public range: number = 100; // Tower firing range in pixels.
  public firingRate: number = 1000; // Firing interval in milliseconds.
  private lastFired: number = 0; // Timestamp when the tower last fired.
  public size: number = 20; // Tower size (20x20, same as enemy diameter).

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Check if an enemy is within this tower's range.
   * @param enemy - The moving enemy.
   * @returns True if enemy is in range.
   */
  public isEnemyInRange(enemy: MovingEnemy): boolean {
    const dx = enemy.x - this.x;
    const dy = enemy.y - this.y;
    return Math.hypot(dx, dy) <= this.range;
  }

  /**
   * Update the tower. If an enemy is in range and firing cooldown has passed,
   * fire a projectile.
   * @param enemy - The enemy to target.
   * @param currentTime - The current time in milliseconds.
   * @returns A Projectile if fired; otherwise, null.
   */
  public update(enemy: MovingEnemy, currentTime: number): Projectile | null {
    if (
      this.isEnemyInRange(enemy) &&
      currentTime - this.lastFired >= this.firingRate
    ) {
      this.lastFired = currentTime;
      return this.fireProjectile(enemy);
    }
    return null;
  }

  /**
   * Fires a projectile aimed at the target enemy.
   * @param enemy - The target enemy.
   * @returns A new Projectile instance.
   */
  private fireProjectile(enemy: MovingEnemy): Projectile {
    // Projectile starts at the center of the tower.
    const startX = this.x;
    const startY = this.y;
    // Create projectile with a placeholder speed.
    return new Projectile(startX, startY, enemy, 0.5);
  }
}
