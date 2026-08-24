import Phaser from 'phaser';

export const LOGICAL_WIDTH = 360;
export const LOGICAL_HEIGHT = 640;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#0b0b12',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    zoom: Phaser.Scale.MAX_ZOOM,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  input: {
    activePointers: 2,
  },
  scene: [],
};
