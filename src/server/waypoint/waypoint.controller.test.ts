import { Test, TestingModule } from '@nestjs/testing';
import { WaypointController } from './waypoint.controller';
import { WaypointManager, IWaypoint } from './waypointManager.service';
import { NotFoundException } from '@nestjs/common';

describe('WaypointController', () => {
  let waypointController: WaypointController;
  let waypointManager: WaypointManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaypointController],
      providers: [WaypointManager],
    }).compile();

    waypointManager = module.get<WaypointManager>(WaypointManager);
    waypointController = module.get<WaypointController>(WaypointController);
  });

  describe('getAllWaypoints', () => {
    it('should return all waypoints', () => {
      const waypoints = waypointController.getAllWaypoints();
      expect(waypoints).toHaveLength(3);
    });
  });

  describe('getWaypoint', () => {
    it('should return a waypoint by index', () => {
      const waypoint = waypointController.getWaypoint('0');
      expect(waypoint).toEqual({ x: 0, y: 0 });
    });

    it('should throw NotFoundException for invalid index', () => {
      expect(() => waypointController.getWaypoint('10')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('addWaypoint', () => {
    it('should add a waypoint and return updated list', () => {
      const newWaypoint: IWaypoint = { x: 400, y: 400 };
      const waypoints = waypointController.addWaypoint(newWaypoint);
      expect(waypoints).toContainEqual(newWaypoint);
    });
  });

  describe('updateWaypoint', () => {
    it('should update a waypoint and return updated list', () => {
      const updatedWaypoint: IWaypoint = { x: 10, y: 10 };
      const waypoints = waypointController.updateWaypoint('0', updatedWaypoint);
      expect(waypoints[0]).toEqual(updatedWaypoint);
    });

    it('should throw NotFoundException for invalid index update', () => {
      expect(() =>
        waypointController.updateWaypoint('10', { x: 0, y: 0 }),
      ).toThrow(NotFoundException);
    });
  });

  describe('removeWaypoint', () => {
    it('should remove a waypoint and return updated list', () => {
      const initialLength = waypointController.getAllWaypoints().length;
      const waypoints = waypointController.removeWaypoint('0');
      expect(waypoints.length).toBe(initialLength - 1);
    });

    it('should throw NotFoundException for invalid index removal', () => {
      expect(() => waypointController.removeWaypoint('10')).toThrow(
        NotFoundException,
      );
    });
  });
});
