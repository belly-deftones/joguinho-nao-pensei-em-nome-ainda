import Phaser from 'phaser';

export class TimeManager {
  private scene: Phaser.Scene;
  private timerEvent: Phaser.Time.TimerEvent;
  
  public minutes: number = 0;
  public hours: number = 6; // Starts at 6:00 AM
  public day: number = 1;
  public season: string = 'Primavera';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // 1 in-game minute = 700 real ms. 1 in-game hour (60 min) = 42 seconds.
    this.timerEvent = this.scene.time.addEvent({
      delay: 700, 
      callback: this.tick,
      callbackScope: this,
      loop: true
    });
  }

  private tick() {
    this.minutes += 10; // Advance in 10-minute increments for faster pacing
    
    if (this.minutes >= 60) {
      this.minutes = 0;
      this.hours += 1;
      
      if (this.hours >= 24) {
        this.hours = 0;
        this.day += 1;
        
        // 28 days per season
        if (this.day > 28) {
          this.day = 1;
          this.advanceSeason();
        }
      }
    }
    
    // Emit an event so the UI can update
    this.scene.events.emit('time-updated', this.getTimeString(), this.getDateString());
  }

  private advanceSeason() {
    // Only spring for now, but we can cycle
    const seasons = ['Primavera', 'Verão', 'Outono', 'Inverno'];
    const idx = seasons.indexOf(this.season);
    this.season = seasons[(idx + 1) % seasons.length];
  }

  public getTimeString(): string {
    const ampm = this.hours >= 12 ? 'PM' : 'AM';
    let displayHour = this.hours % 12;
    if (displayHour === 0) displayHour = 12;
    
    const minStr = this.minutes.toString().padStart(2, '0');
    const hrStr = displayHour.toString().padStart(2, '0');
    
    return `${hrStr}:${minStr} ${ampm}`;
  }

  public getDateString(): string {
    return `Dia ${this.day} - ${this.season}`;
  }
}
