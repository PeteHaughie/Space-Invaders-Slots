import { AnimatedSprite } from "pixi.js";

class ApplicationState {
  private menu:          boolean;
  private game:          boolean;
  private spinning:      boolean;
  private playerWander:  boolean;
  private revealWinners: boolean;
  private explosions:    AnimatedSprite[];
  private winners:       AnimatedSprite[];

  constructor() {
    this.menu = true;
    this.game = false;
    this.spinning = false;
    this.playerWander = false;
    this.revealWinners = false;
    this.explosions = [];
    this.winners = [];
  }

  public getMenu(): boolean {
    return this.menu;
  }

  public toggleMenu(): void {
    this.menu = !this.menu;
  }

  public setMenu(menu: boolean): void {
    this.menu = menu;
  }

  public getGame(): boolean {
    return this.game;
  }

  public toggleGame(): void {
    this.game = !this.game;
  }

  public setGame(game: boolean): void {
    this.game = game;
  }

  public getSpinning(): boolean {
    return this.spinning;
  }

  public toggleSpinning(): void {
    this.spinning = !this.spinning;
  }

  public setSpinning(spinning: boolean): void {
    this.spinning = spinning;
  }

  public getPlayerWander(): boolean {
    return this.playerWander;
  }

  public togglePlayerWander(): void {
    this.playerWander = !this.playerWander;
  }

  public setPlayerWander(playerWander: boolean): void {
    this.playerWander = playerWander;
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
}

class AudioState {
  private audio: boolean;
  private sprite: string;

  constructor() {
    this.audio = true;
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