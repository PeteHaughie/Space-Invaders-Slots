import { Sprite } from 'pixi.js';

class Shot {
  private sprite: Sprite

  constructor(sprite: any) {
    this.sprite = sprite;
  }

  generateShot(): Sprite {
    const shot: Sprite = new Sprite(this.sprite);
          shot.anchor.set(0.5);
          shot.height = 160;
          shot.width = 160;
          shot.x = 0;
          shot.y = 0;
    return shot;
  }
}

export default Shot;