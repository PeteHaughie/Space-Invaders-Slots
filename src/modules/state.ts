class ApplicationState {
  private menu: boolean;
  private game: boolean;

  constructor() {
    this.menu = true;
    this.game = false;
  }

  public getMenu(): boolean {
    return this.menu;
  }

  public getGame(): boolean {
    return this.game;
  }

  public toggleMenu(): void {
    this.menu = !this.menu;
  }

  public toggleGame(): void {
    this.game = !this.game;
  }
}

class AudioState {
  private audio: boolean;
  private sprite: string;

  constructor() {
    this.audio = false;
    this.sprite = "intro";
  }

  public getAudio(): boolean {
    return this.audio;
  }

  public toggleAudio(): void {
    this.audio = !this.audio;
  }

  public getSprite(): string {
    return this.sprite;
  }

  public setSprite(sprite: string): void {
    this.sprite = sprite;
  }
}

class ScoreState {
  private score: number;

  constructor() {
    this.score = 0;
  }

  public getScore(): number {
    return this.score;
  }

  public increaseScore(points: number): void {
    this.score += points;
  }

  public decreaseScore(points: number): void {
    this.score -= points;
  }

  public resetScore(): void {
    this.score = 0;
  }
}

export {
  ApplicationState,
  AudioState,
  ScoreState
};