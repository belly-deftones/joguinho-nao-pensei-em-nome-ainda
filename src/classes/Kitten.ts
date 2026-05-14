import Phaser from 'phaser';

export class Kitten extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private moveTimer!: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cats');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);
    
    // Set a smaller body for the kitten
    this.body.setSize(12, 12);
    this.body.setOffset(2, 4);

    this.startWandering();
  }

  private startWandering() {
    this.moveTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000),
      callback: this.changeDirection,
      callbackScope: this,
      loop: true
    });
    
    // Initial movement
    this.changeDirection();
  }

  private changeDirection() {
    // 0: idle, 1: up, 2: down, 3: left, 4: right
    const dir = Phaser.Math.Between(0, 4);
    const speed = 40;

    this.body.setVelocity(0);

    switch (dir) {
      case 1:
        this.body.setVelocityY(-speed);
        break;
      case 2:
        this.body.setVelocityY(speed);
        break;
      case 3:
        this.body.setVelocityX(-speed);
        break;
      case 4:
        this.body.setVelocityX(speed);
        break;
      case 0:
      default:
        // Idle
        break;
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // Simple mock animation: just change frame slightly if moving
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      // Very basic frame flip for testing
      const frame = Math.floor(time / 200) % 2;
      this.setFrame(frame);
    } else {
      this.setFrame(0);
    }
  }

  destroy(fromScene?: boolean) {
    if (this.moveTimer) this.moveTimer.destroy();
    super.destroy(fromScene);
  }
}
