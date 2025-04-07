import { Module } from '@nestjs/common';
import { WaypointController } from './waypoint.controller';
import { WaypointManager } from './waypointManager.service';

@Module({
  controllers: [WaypointController],
  providers: [WaypointManager],
  exports: [WaypointManager],
})
export class WaypointModule {}
