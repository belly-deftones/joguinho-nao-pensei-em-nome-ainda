export type RarityLevel = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
export type Variation = 'Nenhuma' | 'Dourada' | 'Arco-Íris';

export interface CropData {
  name: string;
  rarity: RarityLevel;
  variation: Variation;
}

export class CropManager {
  private springCrops: string[] = ['Morango', 'Couve-Flor', 'Batata', 'Vagem', 'Ruibarbo'];

  public getRandomSpringSeed(): string {
    const index = Math.floor(Math.random() * this.springCrops.length);
    return this.springCrops[index];
  }

  public harvestCrop(cropName: string): CropData {
    const rand = Math.random();
    let rarity: RarityLevel = 'Comum';
    let variation: Variation = 'Nenhuma';

    if (rand > 0.95) {
      rarity = 'Lendário';
      variation = Math.random() > 0.5 ? 'Dourada' : 'Arco-Íris';
    } else if (rand > 0.85) {
      rarity = 'Épico';
    } else if (rand > 0.65) {
      rarity = 'Raro';
    } else if (rand > 0.40) {
      rarity = 'Incomum';
    }

    return {
      name: cropName,
      rarity,
      variation
    };
  }

  public getRarityPawText(rarity: RarityLevel): string {
    switch (rarity) {
      case 'Comum': return '';
      case 'Incomum': return '🐾 (Bronze)';
      case 'Raro': return '🐾 (Prata)';
      case 'Épico': return '🐾 (Ouro)';
      case 'Lendário': return '🐾 (Colorida)';
      default: return '';
    }
  }

  public getRarityColor(rarity: RarityLevel): number {
     switch (rarity) {
      case 'Comum': return 0xffffff;
      case 'Incomum': return 0xcd7f32; // Bronze
      case 'Raro': return 0xc0c0c0; // Silver
      case 'Épico': return 0xffd700; // Gold
      case 'Lendário': return 0xff69b4; // Pink for colorful
      default: return 0xffffff;
    }
  }
}
