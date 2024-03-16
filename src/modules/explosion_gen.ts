import { AnimatedSprite } from 'pixi.js';

class Explosion {
  private sprites: any;

  constructor(sprites: any) {
    this.sprites = sprites;
  }

  generateExplosion(): AnimatedSprite {
    const explosion: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['exp']);
    explosion.scale.set(10);
    explosion.animationSpeed = 1 / 30;
    explosion.play();
    return explosion;
  }
}

export default Explosion;