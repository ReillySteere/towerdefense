import { MovingEnemy } from '../../entities/enemy/MovingEnemy';

/**
 * Projectile represents a simple projectile fired by a tower.
 * It moves in a straight line toward a target enemy.
 */
export class Projectile {
  public x: number;
  public y: number;
  public speed: number; // Projectile speed (pixels per millisecond)
  public target: MovingEnemy;
  public radius: number = 5; // Visual size
  public damage: number = 10;
  public isActive: boolean = true;

  constructor(x: number, y: number, target: MovingEnemy, speed: number) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = speed;
  }

  /**
   * Updates the projectile's position.
   * @param delta - The elapsed time in milliseconds.
   */
  public update(delta: number): void {
    // Compute vector towards target's current position.
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      return;
    }

    const moveDistance = this.speed * delta;

    if (moveDistance >= distance || distance < 5) {
      // If we've reached (or nearly reached) the target, mark projectile inactive.
      this.x = this.target.x;
      this.y = this.target.y;
      this.isActive = false;
    } else {
      // Move proportionally towards the enemy.
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }
}
