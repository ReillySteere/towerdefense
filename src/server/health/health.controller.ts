import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enemy } from 'backend/enemy/enemy.entity';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(Enemy)
    private enemyRepository: Repository<Enemy>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get health status and enemy list' })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully.',
  })
  async getEnemiesHealth(): Promise<{
    status: string;
    enemies: Enemy[];
  }> {
    const enemies = await this.enemyRepository.find();
    return { status: 'ok', enemies };
  }
}
