import { IWaypoint } from './IWaypoint';

export class WaypointManager {
  private waypoints: IWaypoint[];

  constructor(initialWaypoints?: IWaypoint[]) {
    // Use provided initial waypoints or default demonstration values (in integer grid coordinates)
    this.waypoints = initialWaypoints || [
      { x: 15, y: 1 },
      { x: 15, y: 15 },
      { x: 25, y: 15 },
      { x: 25, y: 5 },
      { x: 35, y: 5 },
      { x: 35, y: 30 },
      { x: 60, y: 30 },
    ];
  }

  public getWaypoints(): IWaypoint[] {
    return this.waypoints;
  }

  public getWaypoint(index: number): IWaypoint | undefined {
    return this.waypoints[index];
  }

  public addWaypoint(waypoint: IWaypoint): void {
    this.waypoints.push(waypoint);
  }

  public updateWaypoint(index: number, newWaypoint: IWaypoint): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints[index] = newWaypoint;
    } else {
      throw new Error('Waypoint index out of range');
    }
  }

  public removeWaypoint(index: number): void {
    if (index >= 0 && index < this.waypoints.length) {
      this.waypoints.splice(index, 1);
    } else {
      throw new Error('Waypoint index out of range');
    }
  }
}
