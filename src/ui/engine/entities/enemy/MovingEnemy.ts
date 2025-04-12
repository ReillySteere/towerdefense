// File: src/entities/enemy/MovingEnemy.ts
import { IWaypoint } from '../../entities/waypoint/IWaypoint';

export class MovingEnemy {
  public name: string;
  public health: number;
  public speed: number; // Grid-cells per millisecond

  // Immutable original route (in grid coordinates).
  public originalWaypoints: IWaypoint[];
  // The current route the enemy is following (may include temporary re‑route segments).
  public currentWaypoints: IWaypoint[];
  // Index into currentWaypoints that the enemy has reached.
  public currentWaypointIndex: number;
  // Index into originalWaypoints for the next “real” target.
  public nextOriginalIndex: number;

  // Enemy position in grid coordinates.
  public x: number;
  public y: number;

  // For debugging: store the most recent temporary re‑route segment.
  public lastRerouteSegment: IWaypoint[] = [];

  // Reroute control
  private hasJustRerouted: boolean = false;
  private lastReroutePosition: { x: number; y: number };
  private static readonly MIN_MOVE_AFTER_REROUTE = 0.25; // in grid cells, adjust as needed

  constructor(
    name: string,
    health: number,
    waypoints: IWaypoint[], // these are now grid coordinates
    speed: number = 0.001, // default speed in grid cells per ms (adjust as appropriate)
  ) {
    if (waypoints.length === 0) {
      throw new Error('MovingEnemy must have at least one waypoint');
    }
    this.name = name;
    this.health = health;
    this.speed = speed;
    // Save an immutable copy of the original route.
    this.originalWaypoints = [...waypoints];
    // Initially, current route equals the original route.
    this.currentWaypoints = [...waypoints];
    this.currentWaypointIndex = 0;
    // Starting position is the first waypoint.
    this.x = waypoints[0].x;
    this.y = waypoints[0].y;
    // Next original target starts at index 1.
    this.nextOriginalIndex = 1;
    // Initialize the last reroute position.
    this.lastReroutePosition = { x: this.x, y: this.y };
  }

  /**
   * Update enemy position along the current route.
   * When the enemy reaches the final waypoint, it stops moving.
   */
  public update(delta: number): void {
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      return; // at final waypoint.
    }

    const target = this.currentWaypoints[this.currentWaypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);
    const moveDistance = this.speed * delta; // movement in grid-cells

    if (moveDistance >= distance) {
      // Snap to the target.
      this.x = target.x;
      this.y = target.y;
      this.currentWaypointIndex++;
      // Advance the next original index if within threshold.
      if (
        this.nextOriginalIndex < this.originalWaypoints.length &&
        Math.abs(target.x - this.originalWaypoints[this.nextOriginalIndex].x) <
          0.1 &&
        Math.abs(target.y - this.originalWaypoints[this.nextOriginalIndex].y) <
          0.1
      ) {
        this.nextOriginalIndex++;
      }
    } else {
      // Move fractionally toward the target.
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }

    // If enemy was just rerouted, check if it has moved sufficiently away from the reroute position.
    if (this.hasJustRerouted) {
      const movedDistance = Math.hypot(
        this.x - this.lastReroutePosition.x,
        this.y - this.lastReroutePosition.y,
      );
      if (movedDistance > MovingEnemy.MIN_MOVE_AFTER_REROUTE) {
        this.hasJustRerouted = false;
      }
    }
  }

  /**
   * Returns true if the enemy's current position is considered close enough to its next waypoint.
   */
  public hasReachedWaypoint(): boolean {
    if (this.hasJustRerouted) {
      return false;
    }
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      return true;
    }
    const nextWaypoint = this.currentWaypoints[this.currentWaypointIndex + 1];
    const dx = nextWaypoint.x - this.x;
    const dy = nextWaypoint.y - this.y;
    const distance = Math.hypot(dx, dy);
    return distance < 0.25; // threshold in grid-cells
  }

  /**
   * Returns the next original target waypoint.
   */
  public getNextOriginalTarget(): IWaypoint {
    if (this.nextOriginalIndex < this.originalWaypoints.length) {
      return this.originalWaypoints[this.nextOriginalIndex];
    }
    return { x: this.x, y: this.y };
  }

  /**
   * Re-route the enemy by inserting a new temporary segment from its current position
   * to the next original waypoint. The new segment is merged in front of the remainder of
   * the original route.
   *
   * @param newSegment - Array of waypoints (in grid coordinates) representing the new segment.
   */
  public reroute(newSegment: IWaypoint[]): void {
    // Save new segment for debugging.
    this.lastRerouteSegment = newSegment;
    this.lastReroutePosition = { x: this.x, y: this.y };
    this.hasJustRerouted = true;

    // Get remaining route after the next original target.
    const remainder = this.originalWaypoints.slice(this.nextOriginalIndex + 1);
    // Build new route; remove a duplicate if the first point of newSegment matches current position.
    let newSegmentAdjusted = newSegment;
    if (
      newSegment.length > 0 &&
      Math.abs(newSegment[0].x - this.x) < 0.1 &&
      Math.abs(newSegment[0].y - this.y) < 0.1
    ) {
      newSegmentAdjusted = newSegment.slice(1);
    }
    // Prepend the current position.
    const newRoute = [{ x: this.x, y: this.y }, ...newSegmentAdjusted];
    this.currentWaypoints = newRoute.concat(remainder);
    this.currentWaypointIndex = 0;
  }
}
