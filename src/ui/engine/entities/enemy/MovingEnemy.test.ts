import { MovingEnemy } from './MovingEnemy';
import { IWaypoint } from '../../entities/waypoint/IWaypoint';

const createWaypoint = (x: number, y: number): IWaypoint => ({ x, y });

describe('MovingEnemy', () => {
  describe('Constructor', () => {
    it('should initialize position with the first waypoint', () => {
      const waypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(10, 10),
      ];
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints);
      expect(enemy.x).toBe(0);
      expect(enemy.y).toBe(0);
      expect(enemy.waypointIndex).toBe(0);
    });

    it('should throw an error if waypoints array is empty', () => {
      expect(() => new MovingEnemy('TestEnemy', 100, [])).toThrow(
        'MovingEnemy must have at least one waypoint',
      );
    });
  });

  describe('update', () => {
    it('should not update position if at the final waypoint', () => {
      const waypoints: IWaypoint[] = [createWaypoint(0, 0)];
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints);
      enemy.update(1000);
      expect(enemy.x).toBe(0);
      expect(enemy.y).toBe(0);
      expect(enemy.waypointIndex).toBe(0);
    });

    it('should move enemy proportionally toward the next waypoint', () => {
      const waypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(10, 0),
      ];
      // speed set to 0.01 so that moveDistance = 5 for delta = 500
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints, 0.01);
      enemy.update(500);
      expect(enemy.x).toBeCloseTo(5);
      expect(enemy.y).toBeCloseTo(0);
      expect(enemy.waypointIndex).toBe(0);
    });

    it('should snap enemy to target waypoint and increment index when moveDistance >= distance', () => {
      const waypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(3, 4),
      ];
      // With speed = 1 and delta = 10, moveDistance = 10, which is more than the distance (5)
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints, 1);
      enemy.update(10);
      expect(enemy.x).toBe(3);
      expect(enemy.y).toBe(4);
      expect(enemy.waypointIndex).toBe(1);
    });

    it('should update enemy position correctly through multiple updates', () => {
      const waypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(10, 0),
        createWaypoint(10, 10),
      ];
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints, 0.01);
      // First, move from (0,0) to (10,0)
      enemy.update(1000); // moveDistance = 10, equal to distance, so snap
      expect(enemy.x).toBe(10);
      expect(enemy.y).toBe(0);
      expect(enemy.waypointIndex).toBe(1);
      // Next, move from (10,0) towards (10,10)
      enemy.update(500); // moveDistance = 5, should move proportionally
      expect(enemy.x).toBeCloseTo(10);
      expect(enemy.y).toBeCloseTo(5);
      expect(enemy.waypointIndex).toBe(1);
    });
  });

  describe('updatePath', () => {
    it('should update the path and reset enemy position', () => {
      const initialWaypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(10, 0),
      ];
      const enemy = new MovingEnemy('TestEnemy', 100, initialWaypoints);
      enemy.update(1000); // advance the enemy to the next waypoint
      expect(enemy.waypointIndex).toBe(1);

      const newWaypoints: IWaypoint[] = [
        createWaypoint(5, 5),
        createWaypoint(15, 15),
      ];
      enemy.updatePath(newWaypoints);
      expect(enemy.x).toBe(5);
      expect(enemy.y).toBe(5);
      expect(enemy.waypointIndex).toBe(0);
    });

    it('should throw an error if newPoints array is empty', () => {
      const waypoints: IWaypoint[] = [
        createWaypoint(0, 0),
        createWaypoint(10, 10),
      ];
      const enemy = new MovingEnemy('TestEnemy', 100, waypoints);
      expect(() => enemy.updatePath([])).toThrow(
        'New path must contain at least one waypoint',
      );
    });
  });
});
