import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Enemy } from './enemy/enemy.entity';
import { HealthModule } from './health/health.module';
import { EnemyModule } from './enemy/enemy.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite',
      entities: [Enemy],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    EnemyModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
