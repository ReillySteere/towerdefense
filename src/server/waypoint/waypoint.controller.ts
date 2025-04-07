import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WaypointManager, IWaypoint } from './waypointManager.service';
import ErrorMessage from 'backend/util/ErrorMessage';

@ApiTags('Waypoints')
@Controller('waypoints')
export class WaypointController {
  constructor(private readonly waypointManager: WaypointManager) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all waypoints' })
  @ApiResponse({
    status: 200,
    description: 'List of waypoints retrieved successfully',
  })
  getAllWaypoints(): IWaypoint[] {
    return this.waypointManager.getWaypoints();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific waypoint by id' })
  @ApiResponse({ status: 200, description: 'Waypoint retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Waypoint not found' })
  getWaypoint(@Param('id') id: string): IWaypoint {
    const index = parseInt(id, 10);
    const waypoint = this.waypointManager.getWaypoint(index);
    if (!waypoint) {
      throw new NotFoundException(`Waypoint with index ${id} not found`);
    }
    return waypoint;
  }

  @Post()
  @ApiOperation({ summary: 'Add a new waypoint' })
  @ApiResponse({ status: 201, description: 'Waypoint created successfully' })
  addWaypoint(@Body() waypoint: IWaypoint): IWaypoint[] {
    this.waypointManager.addWaypoint(waypoint);
    return this.waypointManager.getWaypoints();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing waypoint' })
  @ApiResponse({ status: 200, description: 'Waypoint updated successfully' })
  @ApiResponse({ status: 404, description: 'Waypoint not found' })
  updateWaypoint(
    @Param('id') id: string,
    @Body() waypoint: IWaypoint,
  ): IWaypoint[] {
    const index = parseInt(id, 10);
    try {
      this.waypointManager.updateWaypoint(index, waypoint);
    } catch (error) {
      throw new NotFoundException(ErrorMessage(error));
    }
    return this.waypointManager.getWaypoints();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existing waypoint' })
  @ApiResponse({ status: 200, description: 'Waypoint removed successfully' })
  @ApiResponse({ status: 404, description: 'Waypoint not found' })
  removeWaypoint(@Param('id') id: string): IWaypoint[] {
    const index = parseInt(id, 10);
    try {
      this.waypointManager.removeWaypoint(index);
    } catch (error) {
      throw new NotFoundException(ErrorMessage(error));
    }
    return this.waypointManager.getWaypoints();
  }
}
