import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from 'backend/health/health.module';
import { Enemy } from 'backend/enemy/enemy.entity';
import { EnemyModule } from 'backend/enemy/enemy.module';

describe('HealthController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Use an in-memory SQLite database for testing
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Enemy],
          synchronize: true,
        }),
        HealthModule,
        EnemyModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET) returns status ok and empty enemies array', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.status).toEqual('ok');
    expect(Array.isArray(response.body.enemies)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
