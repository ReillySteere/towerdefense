import Phaser from 'phaser';
import { GameScene } from 'ui/engine/scenes';

let game: Phaser.Game | null = null;

export function initGame(container: HTMLElement): Phaser.Game {
  if (game) return game;

  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: container,
    scene: [GameScene],
    backgroundColor: '#242424',
  });

  return game;
}
