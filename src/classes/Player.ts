import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private speed: number = 150;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);
    
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    } else {
      throw new Error('Keyboard input is not enabled');
    }
    
    // Set smaller body for better movement around tiles
    this.body.setSize(20, 16);
    this.body.setOffset(6, 16);
  }

  update() {
    this.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      this.anims.play('walk-left', true);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      this.anims.play('walk-right', true);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
      this.anims.play('walk-up', true);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
      this.anims.play('walk-down', true);
    }

    // Stop animation if not moving
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.anims.stop();
    }
  }
}
