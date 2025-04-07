import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { Enemy } from 'backend/enemy/enemy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enemy])],
  controllers: [HealthController],
})
export class HealthModule {}
