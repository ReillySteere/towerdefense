import { WaypointManager, IWaypoint } from './waypointManager.service';

describe('WaypointManager', () => {
  let waypointManager: WaypointManager;

  beforeEach(() => {
    waypointManager = new WaypointManager();
  });

  it('should initialize with default waypoints', () => {
    const waypoints = waypointManager.getWaypoints();
    expect(waypoints).toHaveLength(3);
  });

  it('should add a waypoint', () => {
    const newWaypoint: IWaypoint = { x: 300, y: 300 };
    waypointManager.addWaypoint(newWaypoint);
    const waypoints = waypointManager.getWaypoints();
    expect(waypoints).toContainEqual(newWaypoint);
  });

  it('should update a waypoint', () => {
    const updatedWaypoint: IWaypoint = { x: 50, y: 50 };
    waypointManager.updateWaypoint(0, updatedWaypoint);
    expect(waypointManager.getWaypoint(0)).toEqual(updatedWaypoint);
  });

  it('should remove a waypoint', () => {
    waypointManager.removeWaypoint(0);
    const waypoints = waypointManager.getWaypoints();
    expect(waypoints).toHaveLength(2);
  });

  it('should throw error when updating out-of-bound index', () => {
    expect(() => {
      waypointManager.updateWaypoint(10, { x: 0, y: 0 });
    }).toThrow('Waypoint index out of range');
  });

  it('should throw error when removing out-of-bound index', () => {
    expect(() => {
      waypointManager.removeWaypoint(10);
    }).toThrow('Waypoint index out of range');
  });
});
