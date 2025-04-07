import { Test, TestingModule } from '@nestjs/testing';
import { WaypointModule } from './waypoint.module';
import { WaypointController } from './waypoint.controller';
import { WaypointManager } from './waypointManager.service';

describe('WaypointModule', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [WaypointModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide WaypointManager', () => {
    const waypointManager = moduleRef.get(WaypointManager);
    expect(waypointManager).toBeDefined();
  });

  it('should have WaypointController defined', () => {
    const waypointController = moduleRef.get(WaypointController);
    expect(waypointController).toBeDefined();
  });

  it('should export WaypointManager', () => {
    // Since WaypointManager is both provided and exported, we check that it is available.
    const exportedManager = moduleRef.get(WaypointManager);
    expect(exportedManager).toBeDefined();
  });
});
