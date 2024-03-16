import { AnimatedSprite } from "../types";

class ApplicationState {
  private menu: boolean;
  private game: boolean;
  private revealWinners: boolean;
  private explosions: AnimatedSprite[];
  private winners: AnimatedSprite[];
  private animateShot: boolean;
  private shotSpawn: number;

  constructor() {
    this.menu = true;
    this.game = false;
    this.revealWinners = false;
    this.explosions = [];
    this.winners = [];
    this.animateShot = false;
    this.shotSpawn = 0;
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

  public getRevealWinners(): boolean {
    return this.revealWinners;
  }

  public toggleRevealWinners(): void {
    this.revealWinners = !this.revealWinners;
  }

  public getExplosions(): AnimatedSprite[] {
    return this.explosions;
  }

  public addExplosion(explosion: AnimatedSprite): void {
    this.explosions.push(explosion);
  }

  public removeExplosion(explosion: AnimatedSprite): void {
    const index = this.explosions.indexOf(explosion);
    this.explosions.splice(index, 1);
  }

  public clearExplosions(): void {
    this.explosions = [];
  }

  public getWinners(): AnimatedSprite[] {
    return this.winners;
  }

  public addWinner(winner: AnimatedSprite): void {
    this.winners.push(winner);
  }

  public removeWinner(winner: AnimatedSprite): void {
    const index = this.winners.indexOf(winner);
    this.winners.splice(index, 1);
  }

  public clearWinners(): void {
    this.winners = [];
  }

  public getAnimateShot(): boolean {
    return this.animateShot;
  }

  public toggleAnimateShot(): void {
    this.animateShot = !this.animateShot;
  }

  public getShotSpawn(): number {
    return this.shotSpawn;
  }

  public setShotSpawn(value: number): void {
    this.shotSpawn = value;
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