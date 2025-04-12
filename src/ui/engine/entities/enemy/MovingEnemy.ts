import { IWaypoint } from '../../entities/waypoint/IWaypoint';

export class MovingEnemy {
  public name: string;
  public health: number;
  public speed: number; // Pixels per millisecond

  // Immutable route that remains unchanged.
  public originalWaypoints: IWaypoint[];
  // The current route the enemy is following (may include temporary re‑route segments)
  public currentWaypoints: IWaypoint[];
  // Index into currentWaypoints of the last reached waypoint.
  public currentWaypointIndex: number;
  // Index into originalWaypoints of the next “real” target.
  public nextOriginalIndex: number;

  public x: number;
  public y: number;

  public loop: boolean;
  // Flag indicating that the enemy has just looped.
  public hasLooped: boolean = false;

  // For debugging: store the most recent temporary segment.
  public lastRerouteSegment: IWaypoint[] = [];

  constructor(
    name: string,
    health: number,
    waypoints: IWaypoint[],
    speed: number = 0.4,
    loop: boolean = false,
  ) {
    if (waypoints.length === 0) {
      throw new Error('MovingEnemy must have at least one waypoint');
    }
    this.name = name;
    this.health = health;
    this.speed = speed;
    // Keep an immutable copy of the original waypoints.
    this.originalWaypoints = [...waypoints];
    // Initially, the current route equals the original.
    this.currentWaypoints = [...waypoints];
    this.currentWaypointIndex = 0;
    this.x = waypoints[0].x;
    this.y = waypoints[0].y;
    // The next original target is initially at index 1.
    this.nextOriginalIndex = 1;
    this.loop = loop;
  }

  /**
   * Update the enemy’s position along its current route.
   */
  public update(delta: number): void {
    // If at the final waypoint...
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      if (this.loop) {
        // Reset the current route to the original route.
        this.currentWaypoints = [...this.originalWaypoints];
        this.currentWaypointIndex = 0;
        // Always reset position to the first waypoint of the original route.
        this.x = this.originalWaypoints[0].x;
        this.y = this.originalWaypoints[0].y;
        this.nextOriginalIndex = 1;
        this.hasLooped = true;
      }
      return;
    }
    const target = this.currentWaypoints[this.currentWaypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);
    const moveDistance = this.speed * delta;

    if (moveDistance >= distance) {
      this.x = target.x;
      this.y = target.y;
      this.currentWaypointIndex++;
      // If the reached waypoint is the same as the next original target, advance the pointer.
      if (
        this.nextOriginalIndex < this.originalWaypoints.length &&
        Math.abs(target.x - this.originalWaypoints[this.nextOriginalIndex].x) <
          1 &&
        Math.abs(target.y - this.originalWaypoints[this.nextOriginalIndex].y) <
          1
      ) {
        this.nextOriginalIndex++;
      }
    } else {
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }

  /**
   * Returns the next original target waypoint (from the immutable route).
   */
  public getNextOriginalTarget(): { x: number; y: number } {
    if (this.nextOriginalIndex < this.originalWaypoints.length) {
      return this.originalWaypoints[this.nextOriginalIndex];
    }
    return { x: this.x, y: this.y };
  }

  /**
   * Reroute the enemy by inserting a new temporary segment (computed from its current position
   * to its next original waypoint) at the front of the remaining route.
   * The remaining original waypoints are preserved.
   *
   * @param newSegment - Array of waypoints (in pixel coordinates) representing the new route segment.
   */
  public reroute(newSegment: IWaypoint[]): void {
    // Save the new segment for debugging visualization.
    this.lastRerouteSegment = newSegment;

    // The remainder of the original route starts at (nextOriginalIndex + 1).
    const remainder = this.originalWaypoints.slice(this.nextOriginalIndex + 1);
    // Construct a new route: start with the enemy's current position,
    // then follow the newly computed segment (which must end at the next original waypoint),
    // then continue with the remainder.
    const newRoute = [{ x: this.x, y: this.y }, ...newSegment.slice(1)];
    // Merge the new route segment with the remainder.
    this.currentWaypoints = newRoute.concat(remainder);
    // Reset the current waypoint index so that the enemy now follows the new route.
    this.currentWaypointIndex = 0;
  }
}
