import Phaser from 'phaser';
import { GameScene } from 'ui/engine/scenes';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './core/GameGrid';

let game: Phaser.Game | null = null;
let containerEl: HTMLElement | null = null;

export function initGame(container: HTMLElement): Phaser.Game {
  if (game) return game;
  containerEl = container;

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    parent: container,
    scene: [GameScene],
    backgroundColor: '#242424',
  });

  return game;
}

export function resetGame(): void {
  if (!game || !containerEl) return;
  // destroy all scenes, systems, listeners, DOM nodes, etc.
  game.destroy(true);
  game = null;
  // re‑initialize
  initGame(containerEl);
}
