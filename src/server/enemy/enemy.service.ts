import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enemy } from './enemy.entity';
import { CreateEnemyDto } from './dto/create-enemy.dto';

@Injectable()
export class EnemyService {
  constructor(
    @InjectRepository(Enemy)
    private enemyRepository: Repository<Enemy>,
  ) {}

  async findAll(): Promise<Enemy[]> {
    return this.enemyRepository.find();
  }

  async create(createEnemyDto: CreateEnemyDto): Promise<Enemy> {
    const enemy = this.enemyRepository.create(createEnemyDto);
    return this.enemyRepository.save(enemy);
  }
}
