import Phaser, { Scenes } from 'phaser';
import { gameState } from 'ui/engine/modules/Game/GameState';
import { useGameState } from 'ui/react/hooks/useGameState';
import { deleteHandlers, emit, on } from 'ui/shared/eventBus';
import GameManager from '../modules/Game/GameManager';

export type DebugErrorEvent = {
  message: string;
  source: string;
};

export class GameScene extends Phaser.Scene {
  #gameManager: GameManager;
  #graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(): void {
    this.events.once(Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.events.once(Scenes.Events.DESTROY, this.shutdown, this);

    on('startNextWave', () => {
      this.#gameManager.startNextWave();
    });
  }

  preload(): void {
    // No assets for now.
  }

  create(): void {
    gameState.reset();
    useGameState.getState().reset();
    emit('debugError', {
      source: 'GameScene',
      message: 'Created',
    });
    this.#graphics = this.add.graphics();

    this.#gameManager = new GameManager(this);
    this.#gameManager.create();

    this.cameras.main?.setBackgroundColor('#242424');
  }

  update(_time: number, delta: number): void {
    this.#gameManager.update(delta, this.#graphics);
  }

  shutdown(): void {
    emit('debugError', {
      source: 'GameScene',
      message: 'Destroyed',
    });
    this.#graphics?.destroy();
    this.#graphics = undefined!;
    this.#gameManager = undefined!;
    this.events.removeAllListeners();
    deleteHandlers();
  }
}
