import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateEnemyDto } from './dto/create-enemy.dto';
import { Enemy } from './enemy.entity';
import { EnemyService } from './enemy.service';

@Controller('enemies')
export class EnemyController {
  constructor(private readonly enemyService: EnemyService) {}

  @Get()
  async findAll(): Promise<Enemy[]> {
    return this.enemyService.findAll();
  }

  @Post()
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
