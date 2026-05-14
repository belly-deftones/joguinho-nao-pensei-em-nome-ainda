import Phaser from 'phaser';
import { Player } from '../classes/Player';
import { TimeManager } from '../classes/TimeManager';
import { CropManager } from '../classes/CropManager';
import { Kitten } from '../classes/Kitten';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;
  private timeManager!: TimeManager;
  private cropManager!: CropManager;
  private timeText!: Phaser.GameObjects.Text;
  private dateText!: Phaser.GameObjects.Text;
  private structures!: Phaser.Physics.Arcade.StaticGroup;
  private kittens!: Phaser.Physics.Arcade.Group;
  private farmGrid: Map<string, { state: string, sprite: Phaser.GameObjects.Sprite }> = new Map();
  private tileSize: number = 32;

  constructor() {
    super('MainGameScene');
  }

  create() {
    // Create a basic background with grass tiles
    this.createGround();

    // Create Structures (House, Shop)
    this.createStructures();

    // Add Player
    this.player = new Player(this, 400, 300);

    // Add Kittens
    this.kittens = this.physics.add.group();
    const k1 = new Kitten(this, 300, 300);
    const k2 = new Kitten(this, 350, 350);
    this.kittens.add(k1);
    this.kittens.add(k2);

    // Collisions
    this.physics.add.collider(this.player, this.structures);
    this.physics.add.collider(this.kittens, this.structures);
    this.physics.add.collider(this.kittens, this.player);
    this.physics.add.collider(this.kittens, this.kittens);

    // Setup input
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleInteraction(pointer);
    });

    // Time Management & UI
    this.timeManager = new TimeManager(this);
    this.cropManager = new CropManager();
    this.createUI();

    this.events.on('time-updated', (timeStr: string, dateStr: string) => {
      this.timeText.setText(timeStr);
      this.dateText.setText(dateStr);
    });

    // Instructions
    this.add.text(10, 10, 'Use as setas para mover. Clique para arar/plantar.', {
      fontSize: '16px',
      color: '#4a4a4a', // Darker pastel-friendly text
      backgroundColor: '#ffdac1', // Pastel orange/peach
      padding: { x: 5, y: 5 }
    }).setScrollFactor(0);
  }

  private createUI() {
    // Pastel UI Box for Time/Date in the top right
    const uiWidth = 200;
    const uiHeight = 60;
    const padding = 10;
    const x = this.cameras.main.width - uiWidth - padding;
    const y = padding;

    const bg = this.add.graphics();
    bg.fillStyle(0xffb7b2, 0.9); // Pastel pink
    bg.fillRoundedRect(x, y, uiWidth, uiHeight, 10);
    bg.lineStyle(2, 0xff9a9e, 1);
    bg.strokeRoundedRect(x, y, uiWidth, uiHeight, 10);
    bg.setScrollFactor(0);

    this.dateText = this.add.text(x + uiWidth / 2, y + 15, this.timeManager.getDateString(), {
      fontSize: '18px',
      color: '#4a4a4a',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    this.timeText = this.add.text(x + uiWidth / 2, y + 40, this.timeManager.getTimeString(), {
      fontSize: '16px',
      color: '#4a4a4a'
    }).setOrigin(0.5).setScrollFactor(0);
  }

  private createStructures() {
    this.structures = this.physics.add.staticGroup();

    // Shop Structure (Pastel Peach)
    const shop = this.add.rectangle(100, 100, 160, 120, 0xffdac1).setOrigin(0);
    this.add.text(180, 160, 'LOJA', { fontSize: '20px', color: '#4a4a4a', fontStyle: 'bold' }).setOrigin(0.5);
    this.structures.add(shop);

    // House Structure (Pastel Green/Yellow)
    const house = this.add.rectangle(550, 100, 160, 160, 0xe2f0cb).setOrigin(0);
    this.add.text(630, 180, 'CASA', { fontSize: '20px', color: '#4a4a4a', fontStyle: 'bold' }).setOrigin(0.5);
    this.structures.add(house);
  }

  private createGround() {
    // For now, let's just fill the screen with grass
    for (let x = 0; x < 800; x += this.tileSize) {
      for (let y = 0; y < 600; y += this.tileSize) {
        this.add.image(x, y, 'tileset', 0).setOrigin(0).setScale(2);
      }
    }
  }

  private handleInteraction(pointer: Phaser.Input.Pointer) {
    const worldX = pointer.worldX;
    const worldY = pointer.worldY;
    
    // Prevent interacting with the UI area
    if (worldX > this.cameras.main.width - 220 && worldY < 80) return;

    // Check if clicked on the Shop
    if (worldX >= 100 && worldX <= 260 && worldY >= 100 && worldY <= 220) {
      // It's the shop!
      const isShopOpen = this.timeManager.day % 2 !== 0; // Odd days
      const statusText = isShopOpen ? 'A loja está ABERTA!' : 'A loja está FECHADA hoje.';
      
      const shopMsg = this.add.text(180, 80, statusText, {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: isShopOpen ? '#a8e6cf' : '#ff8b94', // Pastel green / red
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5);

      this.time.delayedCall(2000, () => shopMsg.destroy());
      return; // Do not till soil if clicking on shop
    }

    // Check if clicked on House
    if (worldX >= 550 && worldX <= 710 && worldY >= 100 && worldY <= 260) {
      return; // Can't farm in the house
    }

    // Grid alignment
    const gridX = Math.floor(worldX / this.tileSize) * this.tileSize;
    const gridY = Math.floor(worldY / this.tileSize) * this.tileSize;
    const key = `${gridX},${gridY}`;

    if (!this.farmGrid.has(key)) {
      // Till soil
      const sprite = this.add.sprite(gridX, gridY, 'tileset', 1).setOrigin(0).setScale(2);
      this.farmGrid.set(key, { state: 'tilled', sprite });
    } else {
      const tile = this.farmGrid.get(key)!;
      if (tile.state === 'tilled') {
        // Plant something
        const seed = this.cropManager.getRandomSpringSeed();
        tile.state = 'planted';
        // Let's store the seed name in the sprite name for now
        tile.sprite.setName(seed);
        tile.sprite.setFrame(2); // Assuming frame 2 is a sprout
        
        // Auto grow after 3 seconds for testing purposes
        this.time.delayedCall(3000, () => {
          if (this.farmGrid.has(key) && this.farmGrid.get(key)!.state === 'planted') {
            this.farmGrid.get(key)!.state = 'ready';
            this.farmGrid.get(key)!.sprite.setFrame(3); // Assuming frame 3 is grown
          }
        });
        
      } else if (tile.state === 'ready') {
        // Harvest
        const seedName = tile.sprite.name;
        const crop = this.cropManager.harvestCrop(seedName);
        
        // Show floating text with pastel rarity colors
        const color = this.cropManager.getRarityColor(crop.rarity);
        const pawStr = this.cropManager.getRarityPawText(crop.rarity);
        const variationStr = crop.variation !== 'Nenhuma' ? ` [${crop.variation}]` : '';
        const textStr = `${crop.name}${variationStr}\n${crop.rarity} ${pawStr}`;
        
        const floatingText = this.add.text(gridX, gridY - 20, textStr, {
          fontSize: '14px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
          align: 'center'
        }).setOrigin(0.5);
        
        floatingText.setTint(color);

        this.tweens.add({
          targets: floatingText,
          y: gridY - 50,
          alpha: 0,
          duration: 2000,
          onComplete: () => floatingText.destroy()
        });

        // Reset to tilled
        tile.state = 'tilled';
        tile.sprite.setFrame(1);
      }
    }
  }

  update() {
    this.player.update();
  }
}
