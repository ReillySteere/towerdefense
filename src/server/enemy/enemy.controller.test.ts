import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enemy } from './enemy.entity';
import { EnemyModule } from './enemy.module';
import { EnemyService } from './enemy.service';

describe('EnemyController (Integration)', () => {
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
        EnemyModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/enemies (GET) should return an empty array initially', async () => {
    const response = await request(app.getHttpServer()).get('/enemies');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('/enemies (POST) should create a new enemy', async () => {
    const newEnemy = { name: 'Dragon', health: 100 };
    const postResponse = await request(app.getHttpServer())
      .post('/enemies')
      .send(newEnemy);
    expect(postResponse.status).toBe(HttpStatus.CREATED);
    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body.name).toEqual(newEnemy.name);
    expect(postResponse.body.health).toEqual(newEnemy.health);

    // Verify that GET now returns an array with the newly created enemy
    const getResponse = await request(app.getHttpServer()).get('/enemies');
    expect(getResponse.status).toBe(HttpStatus.OK);
    expect(getResponse.body.length).toBeGreaterThan(0);
  });

  it('/enemies (POST) should return a BAD_REQUEST error when enemy creation fails', async () => {
    // Get the EnemyService instance to override its behavior
    const enemyService = app.get<EnemyService>(EnemyService);
    // Force enemyService.create() to throw an error
    jest
      .spyOn(enemyService, 'create')
      .mockRejectedValue(new Error('Test error'));

    const response = await request(app.getHttpServer())
      .post('/enemies')
      .send({ name: 'Orc', health: 50 });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Enemy creation failed');
    expect(response.body).toHaveProperty('error', 'Test error');

    // Restore original behavior
    jest.restoreAllMocks();
  });

  it('/enemies (POST) should return a BAD_REQUEST error with a generic error message when error is not an instance of Error', async () => {
    const enemyService = app.get<EnemyService>(EnemyService);
    // Simulate a rejection with a non-Error value (e.g. a string)
    jest
      .spyOn(enemyService, 'create')
      .mockRejectedValue('Non-Error instance error');

    const response = await request(app.getHttpServer())
      .post('/enemies')
      .send({ name: 'Goblin', health: 30 });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Enemy creation failed');
    expect(response.body).toHaveProperty(
      'error',
      'An unexpected error occurred',
    );

    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });
});
