import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enemy } from './enemy.entity';
import { EnemyController } from './enemy.controller';
import { EnemyService } from './enemy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enemy])],
  controllers: [EnemyController],
  providers: [EnemyService],
  exports: [EnemyService],
})
export class EnemyModule {}
