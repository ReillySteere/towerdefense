import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEnemyDto } from './dto/create-enemy.dto';
import { Enemy } from './enemy.entity';
import { EnemyService } from './enemy.service';

@ApiTags('Enemies')
@Controller('enemies')
export class EnemyController {
  constructor(private readonly enemyService: EnemyService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all enemies' })
  @ApiResponse({
    status: 200,
    description: 'Enemies retrieved successfully',
    type: [Enemy],
  })
  async findAll(): Promise<Enemy[]> {
    return this.enemyService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new enemy' })
  @ApiResponse({
    status: 201,
    description: 'Enemy created successfully',
    type: Enemy,
  })
  async create(@Body() createEnemyDto: CreateEnemyDto): Promise<Enemy> {
    try {
      return await this.enemyService.create(createEnemyDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      // Standardized error response with appropriate status code
      throw new HttpException(
        { message: 'Enemy creation failed', error: errorMessage },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
