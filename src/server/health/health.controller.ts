import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enemy } from 'backend/enemy/enemy.entity';

@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(Enemy)
    private enemyRepository: Repository<Enemy>,
  ) {}

  @Get()
  async getEnemiesHealth(): Promise<{
    status: string;
    enemies: Enemy[];
  }> {
    const enemies = await this.enemyRepository.find();
    return { status: 'ok', enemies };
  }
}
