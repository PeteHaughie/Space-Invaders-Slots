import './style.css'

import {
  Application,
  Assets,
  BlurFilter,
  Container,
  Graphics,
  Sprite,
  TextureStyle
} from 'pixi.js';

import anime from 'animejs';

import {
  Howl,
} from 'howler';

import {
  ApplicationState,
  AudioState,
  ScoreState,
} from './modules/state';

import Explosion from './modules/explosion_gen';
import Invader from './modules/invader_gen';
import Shot from './modules/shot_gen';
import Hundo from './modules/100_gen';

import { WinningSets } from './modules/winningset';

const testArr = [
  ["s1", "s2", "s5"],
  ["s3", "s3", "s1"],
  ["s4", "s1", "s2"],
  ["s4", "s2", "s5"],
  ["s4", "s5", "s1"]
]; // this should result in 2 returned winning sets

/* 
s1: [0][0], [1][2], [2][1]
s4: [2][0], [3][0], [4][0]
*/

/*
WinningSets(testArr).forEach((set) => {
  console.log(set.symbol, set.positions);
});
*/


// the following array should result in 6 returned winning sets
// due to the dual s3 values in a single drum in the test array there was an implied possibility of duplicate sequences

/*
const testArr = [
  ["s1", "s2", "s3"], // 0
  ["s3", "s3", "s1"], // 1
  ["s4", "s1", "s3"], // 2
  ["s4", "s3", "s3"], // 3
  ["s4", "s3", "s1"]  // 4
];
*/

/*
s1: [0][0], [1][2], [2][1]
s3: [0][2], [1][0], [2][2], [3][2], [4][1]
s3: [0][2], [1][0], [2][2], [3][1], [4][1]
s3: [0][2], [1][1], [2][2], [3][2], [4][1]
s3: [0][2], [1][1], [2][2], [3][1], [4][1]
s4: [2][0], [3][0], [4][0]
*/

/*
WinningSets(testArr).forEach((set) => {
  console.log(set.symbol, set.positions);
});
*/

(async () => {
  const app = new Application();

  // I presume you'll want to poke about in the app guts - don't do this in production
  (globalThis as any).__PIXI_APP__ = app;

  TextureStyle.defaultOptions.scaleMode = 'nearest';
  
  await app.init({
    // application variables
    background: 0x1099bb,
    resizeTo: window,
    // events
    eventMode: 'passive',
    eventFeatures: {
      click: true,
      globalMove: false,
      move: false,
      wheel: false
    },
  });

  // add canvas to the body
  document.body.appendChild(app.canvas);

  // state objects
  const audioState = new AudioState();
  const applicationState = new ApplicationState();
  const scoreState = new ScoreState();

  // audio objects
  const themeTrack = new Howl({
    html5: true,
    loop: false, // don't use the default loop - we'll fake it and use states to play what we want when we want
    sprite: {
      intro: [0.30, 2192],
      intro2: [2192, 9275],
      loop: [11500, 104070]
    },
    src: ['/sound/these-80s-182328.mp3'],
    volume: 0.5
  });

  const shotSound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/shoot.wav'],
    volume: 0.5
  });

  const explosionSound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/explosion.wav'],
    volume: 0.5
  });

  const buttonSound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/button.wav'],
    volume: 0.5
  });

  const buttonDisabledSound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/button-disabled.wav'],
    volume: 0.5
  });

  const getReadySound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/start_1.wav'],
    volume: 0.5
  });

  const letsDoItSound = new Howl({
    html5: true,
    loop: false,
    src: ['/sound/start_2.wav'],
    volume: 0.5
  });

  const thuds = ["/sound/fastinvader1.wav", "/sound/fastinvader2.wav", "/sound/fastinvader3.wav", "/sound/fastinvader4.wav"];
  const howls: Record<string, Howl> = {};

  thuds.forEach((thud) => {
    howls[thud] = new Howl({
      html5: true,
      loop: false,
      src: thud,
      volume: 0.5
    });
  });

  const symbolLibrary: string[] = ["s1", "s2", "s3", "s4", "s5"];

  // main game objects
  const bgTexture = await Assets.load('/images/background.png');
  const bg = new Sprite(bgTexture);
        bg.width = app.screen.width;
        bg.height = app.screen.height;
        bg.x = 0;
        bg.y = 0;

  app.stage.addChild(bg); // Add the background after the container
  // end main game objects

  // intro objects
  const heroContainer = new Container();
        heroContainer.width = app.screen.width;
        heroContainer.height = app.screen.height;
        heroContainer.x = 0;
        heroContainer.y = 0;

  const heroTexture = await Assets.load('/images/hero.svg');
        heroTexture.scaleMode = 'linear';
  const hero = new Sprite(heroTexture);
        hero.width = heroTexture.width / 3;
        hero.height = heroTexture.height / 3;
        hero.anchor.set(0.5);
        hero.x = app.screen.width / 2;
        hero.y = app.screen.height / 4;
  // end intro objects
  
  // buttons
  // play button
  const playTexture = await Assets.load('/images/play.svg');
  const play = new Sprite(playTexture);
        play.width = playTexture.width / 2;
        play.height = playTexture.height / 2;
        play.anchor.set(0.5);
        play.x = (app.screen.width / 2) - 85;
        play.y = app.screen.height / 2;
        play.interactive = true; // Add this line
        play.cursor = 'pointer';
        play.on('pointerdown', () => {
          if (!applicationState.getGame()) {
            anime({
              targets: heroContainer,
              duration: 1000,
              easing: 'linear',
              alpha: 0,
              complete: () => {
                setTimeout(() => {
                  anime({
                    targets: playStageContainer,
                    duration: 500,
                    easing: 'linear',
                    alpha: 1
                  });
                }, 1500);
              }
            })
            switchToIntro2Sprite();
            buttonSound.play();
            setTimeout(() => {
              getReadySound.play();
            }, 1200); // the timing of this will change based on the intro2 sprite
          } else {
            buttonDisabledSound.play();
          }
        });

  // toggle music button
  const musicTexture = await Assets.load('/images/music.svg');
  const music = new Sprite(musicTexture);
        music.width = musicTexture.width / 2;
        music.height = musicTexture.height / 2;
        music.interactive = true;
        music.anchor.set(0.5);
        music.x = (app.screen.width / 2) + 85;
        music.y = app.screen.height / 2;
        music.cursor = 'pointer';
        music.on('pointerdown', () => toggleMusic());
        music.on('pointerdown', () => buttonSound.play());

  const playMusic = new Sprite(musicTexture);
        playMusic.width = musicTexture.width / 2;
        playMusic.height = musicTexture.height / 2;
        playMusic.interactive = true;
        playMusic.anchor.set(0.5);
        playMusic.x = -(app.screen.width / 2) + (playMusic.width / 2) + 80;
        playMusic.y = app.screen.height / 2 + 50;
        playMusic.cursor = 'pointer';
        playMusic.on('pointerdown', () => {
          buttonSound.play();
          toggleMusic();
        });

  // spin button
  const spinTexture = await Assets.load('/images/spin.svg');
  const spin = new Sprite(spinTexture);
        spin.width = spinTexture.width / 2;
        spin.height = spinTexture.height / 2;
        spin.anchor.set(0.5);
        spin.x = app.screen.width / 4 + 100;
        spin.y = app.screen.height / 2 + 50;
        spin.interactive = true;
        spin.cursor = 'pointer';
        spin.on('pointerdown', () => {
          if (!applicationState.getSpinning()) {
            applicationState.setSpinning(true);
            spinDrums();
            buttonSound.play();
            setTimeout(() => {
              letsDoItSound.play();
            }, 500);
          } else {
            buttonDisabledSound.play();
          }
        });
  // end buttons

  // audio playback
  themeTrack.on('play', () => {
    // console.log("current audio sprite:", audioState.getSprite());
    if (audioState.getSprite() == "intro2") {
      setTimeout(() => {
        applicationState.toggleMenu();
        applicationState.toggleGame();
      }, 1000);
    }
  });
  themeTrack.on('end', () => {
    if (audioState.getSprite() == "intro") {
      themeTrack.play('intro'); // fake the loop
    }
    if (audioState.getSprite() == "intro2") {
      switchToMainMusicSprite();
    }
    if (audioState.getSprite() == "loop") {
      themeTrack.play('loop'); // fake the loop
    }
  });

  audioState.setSprite('intro'); // set the default audio sprite

  if (audioState.getAudio()) {
    themeTrack.play('intro'); // sprite is set by default in the state constructor
  }

  function stopTrack() {
    themeTrack.stop();
  }

  function switchToIntro2Sprite() {
    play.off('pointerdown', switchToIntro2Sprite); // remove the event from the button
    stopTrack();
    themeTrack.play('intro2');
    audioState.setSprite('intro2');
  };

  function switchToMainMusicSprite() {
    stopTrack();
    themeTrack.play('loop');
    audioState.setSprite('loop');
  };

  function toggleMusic() {
    audioState.toggleAudio();
    const currentVolume = themeTrack.volume();
    if (audioState.getAudio()) {
      themeTrack.fade(currentVolume, 0.5, 500);
    } else {
      themeTrack.fade(currentVolume, 0.0, 500);
    }
  };
  // end audio
  
  heroContainer.addChild(hero);
  heroContainer.addChild(play);
  heroContainer.addChild(music);
  app.stage.addChild(heroContainer);

  const playStageContainer = new Container(); // main stage container
        playStageContainer.x = app.stage.width / 2;
        playStageContainer.y = 0;

  playStageContainer.addChild(playMusic);

  const drumsContainer = new Container(); // all drums container
        drumsContainer.x = -((160 * 5) / 2);
        drumsContainer.y = 100;
        
  const mask = new Graphics();
        mask.rect(app.stage.width / 2 - ((160 * 5) / 2), 50, 160 * 5, 120 * 3);
        mask.fill(0xffffff);
        
  drumsContainer.mask = mask;
  
  // spritesheets
  // animated spritesheet
  const sprites = await Assets.load('/images/spritesheet.json').then(() => {
    return Assets.cache.get('/images/spritesheet.json');
  });

  // text spritesheet
  const textSprites = await Assets.load('/images/text.json').then(() => {
    return Assets.cache.get('/images/text.json');
  });

  // end spritesheets

  // alphanumeric objects
  const scoreContainer = new Container();
        scoreContainer.x = -app.stage.width / 2 + 80;
        scoreContainer.y = 80;

  const scoreTextContainer = new Container();
        scoreTextContainer.x = 0;
        scoreTextContainer.y = 0;

  const textString = "SCORE";
  const SCORE: Sprite[] = [];
  for (let i = 0; i < textString.length; i++) {
    const letter = new Sprite(textSprites.textures[textString.charAt(i) + '.svg']);
          letter.scale = 5;
          letter.anchor.set(0.5);
          letter.tint = "0xffffff";
          letter.x = 0;
          letter.y = 0;
    SCORE.push(letter);
  }
  const colon = new Sprite(textSprites.textures['colon.svg']);
        colon.scale = 5;
        colon.anchor.set(0.5);
        colon.tint = "0xffffff";
        colon.x = 0;
        colon.y = 0;
  SCORE.push(colon);

  SCORE.forEach((letter, index) => {
    letter.x = 40 * index;
    letter.y = 0;
    scoreTextContainer.addChild(letter);
  });

  const scoreValueContainer = new Container();
        scoreValueContainer.x = 0;
        scoreValueContainer.y = 42;

  const numString = "0123456789";
  const NUMBERS: Sprite[] = [];
  for (let i = 0; i < numString.length; i++) {
    const number = new Sprite(textSprites.textures[numString.charAt(i) + '.svg']);
          number.scale = 5;
          number.anchor.set(0.5);
          number.tint = "0xffffff";
          number.x = 0;
          number.y = 0;
    NUMBERS.push(number);
  }

  NUMBERS.forEach((number, index) => {
    number.x = 40 * index;
    number.y = 46;
  });

  function updateScore() {
    scoreValueContainer.removeChildren();
    scoreState.getScore().toString().split('').forEach((number, index) => {
      const num = new Sprite(textSprites.textures[number + '.svg']);
            num.scale = 5;
            num.anchor.set(0.5);
            num.tint = "0xffffff";
            num.x = 40 * index;
            num.y = 0;
      scoreValueContainer.addChild(num);
    });
  };
  updateScore();

  scoreContainer.addChild(scoreTextContainer);
  scoreContainer.addChild(scoreValueContainer);

  // end alphanumeric objects
  
  playStageContainer.addChild(scoreContainer);

  // game objects
  const playerTexture = await Assets.load('/images/player.svg');
  const player: Sprite = new Sprite(playerTexture);
        player.anchor.set(0.5);
        player.width = 160;
        player.height = 160;
        player.tint = "0xffffff";
        player.x = 0;
        player.y = app.screen.height - 200;
  
  playStageContainer.addChild(player);
  playStageContainer.addChild(spin);

  const shotTexture = await Assets.load('/images/shot.svg');
  
  const drums: any = [];
  
  for (let i = 0; i < 5; i++) {
    const drumContainer = new Container(); // individual drum container
    drums.push(drumContainer);
  }

  const arr = testArr;

  drums.forEach((drum: Container, index: number) => {
    const numberOfDummyInvaders: number = 2997; // sprites are essentially free because they share the same texture
    // add the actual winning set to the array
    arr[index].forEach((symbol: string, index: number) => {
      const invader = new Invader(sprites).generateInvader(symbol, index);
      drum.addChild(invader);
    });
    const dummyInvaders: string[] = [];
    for (let i = 0; i < numberOfDummyInvaders; i++) {
      dummyInvaders.push(symbolLibrary[Math.floor(Math.random() * symbolLibrary.length)]); // push 150 symbols to the array
    }
    dummyInvaders.forEach((invader: string, index: number) => {
      const dummyInvader = new Invader(sprites).generateInvader(invader, index, 3); // generate a dummy invader for each symbol
      drum.addChild(dummyInvader); // add the dummy invader to the drum
    });
    drum.x = index * 160; // this should probably really be moved to the drumContainer object but it's here now so we'll live with it
    drumsContainer.y = - 120 * (drum.children.length - 3) + 30; // this puts the last three symbols of each drum on screen 
    drumsContainer.addChild(drum);
  });

  playStageContainer.addChild(drumsContainer);
  playStageContainer.alpha = 0;

  app.stage.addChild(playStageContainer);
  // end game objects

  // game loop
  let frameCount: number = 0.0;
  
  // main game loop
  app.ticker.add((time) => {
    frameCount += time.deltaTime / 60;
    heroContainer.position.y += Math.sin(frameCount) * 0.5; // bounce the menu about a bit
    if (applicationState.getSpinning()) {
      spin.alpha = 0.5;
    } else {
      spin.alpha = 1;
    }
  });

  function playerWander() {
    const amt = (Math.floor(Math.random() * drumsContainer.width)) - (drumsContainer.width / 2);
    anime({
      targets: player,
      x: amt,
      easing: 'easeOutExpo',
      duration: Math.floor(Math.random() * 1000) + 500,
      complete: () => {
        if (applicationState.getPlayerWander()) {
          playerWander();
        }
      }
    });
  }

  function spinDrums() {
    playerWander();
    applicationState.setPlayerWander(true);
    drums.forEach((drum: Container, index: number) => {
      setTimeout(() => {
        // notch the drum
        anime({
          targets: drum,
          y: -120,
          duration: 200,
          easing: 'easeInElastic',
          complete: () => {
            // drop all symbols downwards for three seconds
            anime({
              targets: drum,
              y: drumsContainer.children[0].height,
              duration: 3000 + Math.floor(Math.random() * 300),
              easing: 'linear',
              begin: () => {
                const blur = new BlurFilter();
                      blur.quality = 4;
                      blur.blurX = 0;
                      blur.blurY = 24;
                drum.filters = [blur];
              },
              // offset the end by the height of three symbols
              complete() {
                drum.filters = [];
                anime({
                  targets: drum,
                  y: drumsContainer.children[0].height - (130 * 3),
                  duration: 200,
                  easing: 'easeOutElastic',
                  complete: () => {
                    howls[thuds[Math.floor(Math.random() * thuds.length)]].play();
                  }
                });
              },
            });
          }
        });
      }, (index * 500)); // stagger the start time of each drum by half a second
    });
    setTimeout(() => {
      revealWinners(arr);
    }, 4100); // this should be the same as the duration of the last animation call
  }

  function revealWinners(arr: string[][] = []) {
    applicationState.setPlayerWander(false);
    WinningSets(arr).forEach((set) => {
      for (let i = 0; i < set.positions.length; i++) {
        const anwinrar = (Array.from(drums) as any)[set.positions[i].drum].children[set.positions[i].index];
        applicationState.addWinner(anwinrar);
        const explosion = new Explosion(sprites).generateExplosion();
              explosion.x = set.positions[i].drum * 160;
              explosion.y = (drumsContainer.children[0].height - 400) - (-set.positions[i].index * 116); // the explosion is smaller than the invader sprite
              explosion.tint = set.color;
              console.log(set.color);
        applicationState.addExplosion(explosion);
      }
    });
    const playerOffset = (160 * 5) / 2;
    for (let i = 0; i < applicationState.getWinners().length; i++) {
      setTimeout(() => {
        // move the player sprite to the winning position over 1 second
        const shot = new Shot(shotTexture).generateShot();
              shot.visible = false;
              shot.x = player.x;
              shot.y = player.y;
        const hundo = new Hundo(textSprites.textures).generateHundo();
              hundo.visible = false;
              hundo.x = applicationState.getExplosions()[i].x + (hundo.width / 2) - (applicationState.getExplosions()[i].width / 4) + (hundo.width / 4);
              hundo.y = applicationState.getExplosions()[i].y + (hundo.height / 2) + (applicationState.getExplosions()[i].height / 4);
        anime({
          targets: player,
          x: applicationState.getExplosions()[i].x - playerOffset + 80,
          duration: 1000,
          easing: 'easeOutElastic',
          complete: () => {
            shot.x = player.x;
            scoreState.increaseScore(100);
            updateScore();
            anime({
              targets: shot,
              y: Math.abs(-((drumsContainer.children[0].height  - 280) - applicationState.getExplosions()[i].y)),
              duration: 100,
              easing: 'linear',
              begin: () => {
                playStageContainer.addChild(shot);
                shotSound.play();
                shot.visible = true;
              },
              complete: () => {
                shot.destroy();
                applicationState.getWinners()[i].visible = false;
                explosionSound.play();
                drumsContainer.addChild(applicationState.getExplosions()[i]);
                drumsContainer.addChild(hundo);
                anime({
                  targets: hundo,
                  x: hundo.x - (hundo.width / 4),
                  y: hundo.y - (hundo.height / 8),
                  scale: 1.1,
                  opacity: 0,
                  duration: 750,
                  easing: 'linear',
                  begin: () => {
                    hundo.visible = true;
                  },
                  complete: () => {
                    hundo.destroy();
                  }
                });
              }
            });
          }
        });
      }, (i + 1) * 1000); // Pause for 1 second before applying the effect to each pair of objects
    }
    setTimeout(() => {
      resetSymbols();
      applicationState.setSpinning(false);
      applicationState.setPlayerWander(false);
    }, ((applicationState.getWinners().length + 2) * 1000) + 1000);
  }

  function resetSymbols() {
    applicationState.toggleRevealWinners();
    applicationState.getWinners().forEach((anwinrar) => {
      anwinrar.visible = true;
      applicationState.clearWinners();
    });
    applicationState.getExplosions().forEach((explosion) => {
      explosion.destroy();
      applicationState.clearExplosions();
    });
  }
})();
