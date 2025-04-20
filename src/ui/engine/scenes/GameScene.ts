import Phaser from 'phaser';
import { GameManager } from '../managers';
import { useGameState } from 'ui/react/hooks/useGameState';

export type DebugErrorEvent = {
  message: string;
  source: string;
};

export class GameScene extends Phaser.Scene {
  #gameManager: GameManager;
  #graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
    console.log('[Phaser] GameScene constructor called');
  }

  init(): void {
    this.events.once('shutdown', this.shutdown, this);
  }

  preload(): void {
    // No assets for now.
  }

  create(): void {
    this.#gameManager = new GameManager(this);
    this.#gameManager.create();
    this.#graphics = this.add.graphics();
    this.cameras.main.setBackgroundColor('#242424');

    this.events.on('updateFPS', (fps: number) => {
      useGameState.getState().setFPS(fps);
    });

    this.events.on('waveUpdate', (wave: number) => {
      useGameState.getState().setWaveNumber(wave);
    });

    this.events.on('moneyUpdate', (money: number) => {
      useGameState.getState().setMoney(money);
    });

    this.events.on('livesUpdate', (lives: number) => {
      useGameState.getState().setLives(lives);
    });

    this.events.on('debugError', ({ source, message }: DebugErrorEvent) => {
      useGameState.getState().addDebugLog(`${source}: ${message}`);
    });

    this.events.on('gameOver', () => {
      useGameState.getState().setStatus('gameOver');
    });

    this.events.on('gameWon', () => {
      useGameState.getState().setStatus('victory');
    });
  }

  update(_time: number, delta: number): void {
    this.#gameManager.update(delta, this.#graphics);
    const fps = Math.round(1000 / delta);
    this.events.emit('updateFPS', fps);
  }

  shutdown(): void {
    this.events.removeAllListeners();
  }
}
