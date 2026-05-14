import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load minimal assets for the loading screen (e.g., logo)
  }

  create() {
    this.scene.start('PreloaderScene');
  }
}
