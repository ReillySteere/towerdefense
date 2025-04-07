import { IWaypoint } from '../../entities/waypoint/IWaypoint';

/**
 * MovingEnemy represents an enemy that moves along a set of waypoints using interpolation.
 */
export class MovingEnemy {
  public name: string; // Identifier or display name for the enemy
  public health: number; // Enemy health or other game-relevant property
  public x: number; // Current x position
  public y: number; // Current y position
  public speed: number; // Speed in pixels per millisecond
  public waypointIndex: number; // Index of the current target waypoint
  private waypoints: IWaypoint[];

  /**
   * Constructs a MovingEnemy.
   * @param name - Enemy name.
   * @param health - Enemy health.
   * @param waypoints - Array of waypoints that define the movement path.
   * @param speed - Movement speed (default: 0.1 pixels/ms).
   */
  constructor(
    name: string,
    health: number,
    waypoints: IWaypoint[],
    speed: number = 0.1,
  ) {
    if (waypoints.length === 0) {
      throw new Error('MovingEnemy must have at least one waypoint');
    }
    this.name = name;
    this.health = health;
    this.waypoints = waypoints;
    this.speed = speed;
    this.waypointIndex = 0;
    // Start at the first waypoint.
    this.x = waypoints[0].x;
    this.y = waypoints[0].y;
  }

  /**
   * Update the enemy's position based on the elapsed time.
   * @param delta - Elapsed time in milliseconds since the last update.
   */
  public update(delta: number): void {
    // If at the final waypoint, do nothing.
    if (this.waypointIndex >= this.waypoints.length - 1) {
      return;
    }

    // Determine the next waypoint.
    const target = this.waypoints[this.waypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);

    // Calculate how far to move.
    const moveDistance = this.speed * delta;

    if (moveDistance >= distance) {
      // Snap to the target waypoint and increment the index.
      this.x = target.x;
      this.y = target.y;
      this.waypointIndex++;
    } else {
      // Move proportionally toward the target.
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }

  /**
   * Updates the enemy's path to a new set of waypoints.
   * @param newWaypoints - New array of waypoints.
   */
  public updatePath(newWaypoints: IWaypoint[]): void {
    if (newWaypoints.length === 0) {
      throw new Error('New path must contain at least one waypoint');
    }
    this.waypoints = newWaypoints;
    this.waypointIndex = 0;
    // Reset position to the first waypoint of the new path.
    this.x = newWaypoints[0].x;
    this.y = newWaypoints[0].y;
  }
}
