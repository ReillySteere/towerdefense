import { Test, TestingModule } from '@nestjs/testing';
import { EnemyService } from './enemy.service';
import { Enemy } from './enemy.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('EnemyService', () => {
  let service: EnemyService;
  let repository: Repository<Enemy>;

  const mockEnemyRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnemyService,
        {
          provide: getRepositoryToken(Enemy),
          useValue: mockEnemyRepository,
        },
      ],
    }).compile();

    service = module.get<EnemyService>(EnemyService);
    repository = module.get<Repository<Enemy>>(getRepositoryToken(Enemy));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of enemies', async () => {
      const result: Enemy[] = [{ id: 1, name: 'Goblin', health: 10 }];
      mockEnemyRepository.find.mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
      expect(mockEnemyRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new enemy', async () => {
      const createDto = { name: 'Orc', health: 20 };
      const enemyEntity = { id: 2, ...createDto };

      mockEnemyRepository.create.mockReturnValue(enemyEntity);
      mockEnemyRepository.save.mockResolvedValue(enemyEntity);

      expect(await service.create(createDto)).toEqual(enemyEntity);
      expect(mockEnemyRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEnemyRepository.save).toHaveBeenCalledWith(enemyEntity);
    });
  });
});
