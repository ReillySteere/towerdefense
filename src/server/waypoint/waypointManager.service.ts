import { Injectable } from '@nestjs/common';

/**
 * Interface representing a coordinate pair (waypoint).
 */
export interface IWaypoint {
  x: number;
  y: number;
}

/**
 * WaypointManager is responsible for managing a set of waypoints.
 * It allows adding, removing, updating, and retrieving waypoints.
 */
@Injectable()
export class WaypointManager {
  private waypoints: IWaypoint[];

  constructor() {
    // Initialize with a basic demonstration set of waypoints.
    this.waypoints = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 0 },
    ];
  }

  /**
   * Retrieves the full list of waypoints.
   * @returns {IWaypoint[]} Array of waypoints.
   */
  public getWaypoints(): IWaypoint[] {
    return this.waypoints;
  }

  /**
   * Retrieves a waypoint by its index.
   * @param index - The index of the waypoint.
   * @returns {IWaypoint | undefined} The waypoint at the given index or undefined if out of bounds.
   */
  public getWaypoint(index: number): IWaypoint | undefined {
    return this.waypoints[index];
  }

  /**
   * Adds a new waypoint to the list.
   * @param waypoint - The waypoint to add.
   */
  public addWaypoint(waypoint: IWaypoint): void {
    this.waypoints.push(waypoint);
  }

  /**
   * Updates an existing waypoint at the specified index.
   * @param index - The index of the waypoint to update.
   * @param newWaypoint - The new waypoint data.
   * @throws Will throw an error if the index is out of range.
   */
  public updateWaypoint(index: number, newWaypoint: IWaypoint): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints[index] = newWaypoint;
    } else {
      throw new Error('Waypoint index out of range');
    }
  }

  /**
   * Removes a waypoint at the specified index.
   * @param index - The index of the waypoint to remove.
   * @throws Will throw an error if the index is out of range.
   */
  public removeWaypoint(index: number): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints.splice(index, 1);
    } else {
      throw new Error('Waypoint index out of range');
    }
  }
}
