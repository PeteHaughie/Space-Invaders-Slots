import { Container, Sprite } from 'pixi.js';

class Hundo {
  private container: Container;
  private sprite: any;
  private string: string;
  private HUNDO: Sprite[] = [];

  constructor(sprite: any) {
    this.container = new Container();
    this.sprite = sprite;
    this.string = "100";
    this.HUNDO = [];
  }

  generateHundo(): Container {
    for (let i = 0; i < this.string.length; i++) {
      const number = new Sprite(this.sprite[this.string.charAt(i).toString() + '.svg']);
      number.scale.set(5, 5); // Correct scale assignment
      number.anchor.set(0.5);
      number.tint = 0xffffff; // Correct tint assignment
      number.x = 0;
      number.y = 0;
      this.HUNDO.push(number);
    }

    this.HUNDO.forEach((number, index) => {
      number.x = 40 * index;
      number.y = 0;
      this.container.addChild(number);
    });

    return this.container;
  }
}

export default Hundo;
