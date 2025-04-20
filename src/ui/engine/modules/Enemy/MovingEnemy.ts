import { PathPlanningService } from 'ui/engine/services/PathPlanningService';
import { IWaypoint } from '../../entities/waypoint/IWaypoint';

export class MovingEnemy {
  public name: string;
  public health: number;
  public speed: number; // Speed in grid-cells per millisecond

  public originalWaypoints: IWaypoint[];
  public currentWaypoints: IWaypoint[];
  public currentWaypointIndex: number;
  public nextOriginalIndex: number;

  // Enemy position in grid coordinates (can be fractional for smooth movement)
  public x: number;
  public y: number;

  // For debugging: store the most recent re-route segment.
  public lastRerouteSegment: IWaypoint[] = [];
  public readonly reward = 1;

  /**
   *
   * @param name
   * @param health
   * @param waypoints
   * @param speed - grid-cells per millisecond
   */
  constructor(
    name: string,
    health: number,
    waypoints: IWaypoint[], // All waypoints in grid coordinates
    speed: number = 0.01,
  ) {
    if (waypoints.length === 0) {
      throw new Error('MovingEnemy must have at least one waypoint');
    }
    this.name = name;
    this.health = health;
    this.speed = speed;
    // Save the original route.
    this.originalWaypoints = [...waypoints];
    // Start with the original route as the current route.
    this.currentWaypoints = [...waypoints];
    this.currentWaypointIndex = 0;
    this.x = waypoints[0].x;
    this.y = waypoints[0].y;
    this.nextOriginalIndex = 1;
  }

  /**
   * Updates the enemy's position along its current route.
   *
   * This update method naturally supports diagonal movement because:
   * - It computes the Euclidean distance (via Math.hypot) between its current position and the target waypoint.
   * - The movement is done proportionally using the ratio of the movement distance to the total distance.
   *
   * Thus, whether the next waypoint lies diagonally or orthogonally relative to the enemy,
   * the enemy will move smoothly.
   *
   * @param delta - Elapsed time in milliseconds.
   */
  public update(delta: number): void {
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      return; // Already at the final waypoint.
    }
    const target = this.currentWaypoints[this.currentWaypointIndex + 1];
    // Calculate differences; these values can be non-integer, allowing smooth, diagonal movement.
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    // Euclidean distance ensures proper handling of diagonal moves.
    const distance = Math.hypot(dx, dy);
    // Compute the movement distance in grid cells.
    const moveDistance = this.speed * delta;

    if (moveDistance >= distance) {
      // Snap to the target if we would overshoot.
      this.x = target.x;
      this.y = target.y;
      this.currentWaypointIndex++;

      // Advance original route index if the reached waypoint is close to the next original point.
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
      const ratio = moveDistance / distance;
      // Update position proportionally; this works correctly for both diagonal and orthogonal moves.
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }

  /**
   * Returns true if the enemy is close enough to its next waypoint.
   */
  public hasReachedWaypoint(): boolean {
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      return true;
    }
    const nextWaypoint = this.currentWaypoints[this.currentWaypointIndex + 1];
    const dx = nextWaypoint.x - this.x;
    const dy = nextWaypoint.y - this.y;
    return Math.hypot(dx, dy) < 0.25;
  }

  /**
   * Returns the next target waypoint in the original route.
   */
  public getNextOriginalTarget(): IWaypoint {
    if (this.nextOriginalIndex < this.originalWaypoints.length) {
      return this.originalWaypoints[this.nextOriginalIndex];
    }
    return { x: this.x, y: this.y };
  }

  /**
   * Checks whether the enemy's immediate route segment is blocked by obstacles.
   * It does so by computing the line from the enemy's current grid cell
   * to the next waypoint and checking for any obstacle along the line.
   */
  public isRouteBlocked(obstacles: Set<string>): boolean {
    if (this.currentWaypointIndex >= this.currentWaypoints.length - 1) {
      return false;
    }
    const currentGrid = { x: Math.floor(this.x), y: Math.floor(this.y) };
    const nextWaypoint = this.currentWaypoints[this.currentWaypointIndex + 1];
    const line = PathPlanningService.getLine(currentGrid, nextWaypoint);
    return line.some((cell) => obstacles.has(`${cell.x},${cell.y}`));
  }

  /**
   * Recalculates the fastest route from the enemy's current position directly to the current target waypoint.
   * Replacing the entire current route with this newly calculated path.
   *
   * @param newSegment - The newly calculated fastest path in grid coordinates.
   */
  public reroute(newSegment: IWaypoint[]): void {
    this.lastRerouteSegment = newSegment;
    // Replace the current route entirely, starting at the enemy's current position.
    this.currentWaypoints = [{ x: this.x, y: this.y }, ...newSegment];
    this.currentWaypointIndex = 0;
  }
}
