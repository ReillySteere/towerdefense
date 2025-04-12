// src/ui/engine/managers/WaveManager.ts

import { EnemyManager } from './EnemyManager';

export class WaveManager {
  private enemyManager: EnemyManager;
  private currentWave: number = 0;

  constructor(enemyManager: EnemyManager) {
    this.enemyManager = enemyManager;
  }

  /**
   * Spawns a new wave of enemies.
   * @param count Number of enemies in the wave.
   */
  public spawnWave(count: number): void {
    this.currentWave++;
    this.enemyManager.spawnEnemyWave(count);
    console.log(`Spawned wave ${this.currentWave} with ${count} enemies.`);
  }

  public getCurrentWave(): number {
    return this.currentWave;
  }
}
