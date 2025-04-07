import { IWaypoint } from './IWaypoint';

/**
 * WaypointManager is responsible for managing a set of waypoints.
 * It provides methods to add, remove, update, and retrieve waypoints.
 */
export class WaypointManager {
  private waypoints: IWaypoint[];

  constructor(initialWaypoints?: IWaypoint[]) {
    // Use provided initial waypoints or default demonstration values.
    this.waypoints = initialWaypoints || [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 0 },
    ];
  }

  /**
   * Returns all waypoints.
   */
  public getWaypoints(): IWaypoint[] {
    return this.waypoints;
  }

  /**
   * Returns a waypoint by index.
   * @param index - Index of the waypoint.
   */
  public getWaypoint(index: number): IWaypoint | undefined {
    return this.waypoints[index];
  }

  /**
   * Adds a new waypoint.
   * @param waypoint - The waypoint to add.
   */
  public addWaypoint(waypoint: IWaypoint): void {
    this.waypoints.push(waypoint);
  }

  /**
   * Updates an existing waypoint.
   * @param index - Index of the waypoint to update.
   * @param newWaypoint - New waypoint data.
   */
  public updateWaypoint(index: number, newWaypoint: IWaypoint): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints[index] = newWaypoint;
    } else {
      throw new Error('Waypoint index out of range');
    }
  }

  /**
   * Removes a waypoint by index.
   * @param index - Index of the waypoint to remove.
   */
  public removeWaypoint(index: number): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints.splice(index, 1);
    } else {
      throw new Error('Waypoint index out of range');
    }
  }
}
