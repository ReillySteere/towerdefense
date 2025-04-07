import { WaypointManager } from './WaypointManager';
import { IWaypoint } from './IWaypoint';

describe('WaypointManager', () => {
  const defaultWaypoints: IWaypoint[] = [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
    { x: 200, y: 0 },
  ];

  it('should initialize with default waypoints when no initial waypoints are provided', () => {
    const manager = new WaypointManager();
    expect(manager.getWaypoints()).toEqual(defaultWaypoints);
  });

  it('should initialize with provided initial waypoints', () => {
    const initial: IWaypoint[] = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];
    const manager = new WaypointManager(initial);
    expect(manager.getWaypoints()).toEqual(initial);
  });

  it('should return a waypoint by index', () => {
    const initial: IWaypoint[] = [
      { x: 5, y: 5 },
      { x: 15, y: 15 },
    ];
    const manager = new WaypointManager(initial);
    expect(manager.getWaypoint(0)).toEqual({ x: 5, y: 5 });
    expect(manager.getWaypoint(1)).toEqual({ x: 15, y: 15 });
    expect(manager.getWaypoint(2)).toBeUndefined();
  });

  it('should add a new waypoint', () => {
    const initial: IWaypoint[] = [{ x: 0, y: 0 }];
    const manager = new WaypointManager(initial);
    const newWaypoint: IWaypoint = { x: 50, y: 50 };
    manager.addWaypoint(newWaypoint);
    expect(manager.getWaypoints()).toEqual([{ x: 0, y: 0 }, newWaypoint]);
  });

  it('should update an existing waypoint when index is valid', () => {
    const initial: IWaypoint[] = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const manager = new WaypointManager(initial);
    const updatedWaypoint: IWaypoint = { x: 10, y: 10 };
    manager.updateWaypoint(1, updatedWaypoint);
    expect(manager.getWaypoint(1)).toEqual(updatedWaypoint);
  });

  it('should throw error when updating a waypoint with an invalid index', () => {
    const manager = new WaypointManager();
    expect(() => {
      manager.updateWaypoint(-1, { x: 100, y: 100 });
    }).toThrow('Waypoint index out of range');
    expect(() => {
      manager.updateWaypoint(100, { x: 100, y: 100 });
    }).toThrow('Waypoint index out of range');
  });

  it('should remove a waypoint when index is valid', () => {
    const initial: IWaypoint[] = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const manager = new WaypointManager(initial);
    manager.removeWaypoint(1);
    expect(manager.getWaypoints()).toEqual([
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ]);
  });

  it('should throw error when removing a waypoint with an invalid index', () => {
    const manager = new WaypointManager();
    expect(() => {
      manager.removeWaypoint(-1);
    }).toThrow('Waypoint index out of range');
    expect(() => {
      manager.removeWaypoint(100);
    }).toThrow('Waypoint index out of range');
  });
});
