import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { MainGameScene } from './scenes/MainGameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#d2e8ca', // Pastel green
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [BootScene, PreloaderScene, MainGameScene]
};

new Phaser.Game(config);
