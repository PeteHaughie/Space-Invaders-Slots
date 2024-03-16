import { AnimatedSprite } from 'pixi.js';

class Invader {
  private sprites: any;
  private symbol: string;
  private index: number;

  constructor(sprites: any) {
    this.sprites = sprites;
    this.symbol = "";
    this.index = 0;
  }

  generateInvader(string: string, index: number): AnimatedSprite {
    const spriteOffsetY = index * 120;
    switch (string) {
      case "s1":
        const invader_s1: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['s1']);
              invader_s1.scale.set(10);
              invader_s1.animationSpeed = 1 / 30;
              invader_s1.play();
              invader_s1.x = 23;
              invader_s1.y = spriteOffsetY;
        return invader_s1;
      case "s2":
        const invader_s2: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['s2']);
              invader_s2.scale.set(10);
              invader_s2.animationSpeed = 1 / 30;
              invader_s2.play();
              invader_s2.x = 0;
              invader_s2.y = spriteOffsetY;
        return invader_s2;
      case "s3":
        const invader_s3: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['s3']);
              invader_s3.scale.set(10);
              invader_s3.animationSpeed = 1 / 30;
              invader_s3.play();
              invader_s3.x = 0;
              invader_s3.y = spriteOffsetY;
        return invader_s3;
      case "s4":
        const invader_s4: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['s4']);
              invader_s4.scale.set(10);
              invader_s4.animationSpeed = 1 / 30;
              invader_s4.play();
              invader_s4.x = 23;
              invader_s4.y = spriteOffsetY;
        return invader_s4;
      case "s5":
        const invader_s5: AnimatedSprite = AnimatedSprite.fromFrames(this.sprites.data.animations['s5']);
              invader_s5.scale.set(10);
              invader_s5.animationSpeed = 1 / 30;
              invader_s5.play();
              invader_s5.x = 0;
              invader_s5.y = spriteOffsetY;
        return invader_s5;
      default:
        return new AnimatedSprite(this.sprites.data.animations['s1']);
    }
  };
}


export default Invader;