import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    // Load assets
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('cats', 'assets/cats.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('tileset', 'assets/tileset.png', { frameWidth: 16, frameHeight: 16 });
    
    // UI Assets (to be generated/added later)
    // this.load.image('ui_box', 'assets/ui_box.png');
  }

  create() {
    // Define animations
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    // Add other animations...

    this.scene.start('MainGameScene');
  }
}
