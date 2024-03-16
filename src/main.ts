import './style.css'

import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
  TextureStyle
} from 'pixi.js';

import {
  Howl,
} from 'howler';

import {
  ApplicationState,
  AudioState,
  // ScoreState
} from './modules/state';

import {
  mapValues
} from './modules/utilities';

import Explosion from './modules/explosion_gen';
import Invader from './modules/invader_gen';

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

// the following array should result in 6 returned winning sets
// due to the dual s3 values in a single drum in the test array there was an implied possibility of duplicate sequences
const testArr2 = [
  ["s1", "s2", "s3"], // 0
  ["s3", "s3", "s1"], // 1
  ["s4", "s1", "s3"], // 2
  ["s4", "s3", "s3"], // 3
  ["s4", "s3", "s1"]  // 4
];

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

  // audio objects
  const themeTrack = new Howl({
    html5: true,
    loop: false, // does the loop actually screw with the audio logic?
    sprite: {
      intro: [0.30, 2192],
      intro2: [2192, 9275],
      loop: [9275, 104070]
    },
    src: ['/sound/these-80s-182328.mp3'],
    volume: 0.5
  });

  const soundEffects = new Howl({
    src: ['/sound/soundsSprite.wav'],
    html5: true,
    sprite: {
      chain: [0.000, 0.725],
      lose: [0.925, 2.488],
      ufo_highpitch: [2.688, 2.851],
      ufo_lowpitch: [3.051, 5.392],
      start_1: [5.592, 7.340],
      start_2: [8.726, 9.861],
      start_3: [7.540, 8.526],
      get: [10.061, 10.557],
      jackpot: [10.757, 12.112],
      invaderkilled: [12.312, 12.618],
      button: [12.818, 12.918],
      shoot: [13.118, 13.488],
      explosion: [13.688, 14.480],
      fastinvader3: [14.969, 15.065],
      fastinvader1: [14.680, 14.769],
      fastinvader2: [15.265, 15.359],
      fastinvader4: [15.559, 15.659],
    },
    loop: false,
    volume: 0.5
  });

  themeTrack.on('end', () => {
    console.log("current audio sprite:", audioState.getSprite());
    if (audioState.getSprite() == "intro") {
      themeTrack.play('intro'); // fake the loop
    }
    if (audioState.getSprite() == "intro2") {
      console.log("stop intro2 and move to the main theme");
      applicationState.toggleMenu();
      applicationState.toggleGame();
      switchToMainMusicSprite();
    }
    if (audioState.getSprite() == "loop") {
      themeTrack.play('loop'); // fake the loop
    }
  });

  // game objects
  const bgTexture = await Assets.load('/images/background.png');
  const bg = new Sprite(bgTexture);
        bg.width = app.screen.width;
        bg.height = app.screen.height;
        bg.x = 0;
        bg.y = 0;

  app.stage.addChild(bg); // Add the background after the container

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
  
  const playTexture = await Assets.load('/images/play.svg');
  const play = new Sprite(playTexture);
        play.width = playTexture.width / 3;
        play.height = playTexture.height / 3;
        play.anchor.set(0.5);
        play.x = (app.screen.width / 2) - 75;
        play.y = app.screen.height / 2;
        play.eventMode = 'static';
        play.cursor = 'pointer';
        play.on('pointerdown', switchToIntro2Sprite);

  const musicTexture = await Assets.load('/images/music.svg');
  const music = new Sprite(musicTexture);
        music.width = musicTexture.width / 3;
        music.height = musicTexture.height / 3;
        music.anchor.set(0.5);
        music.x = (app.screen.width / 2) + 75;
        music.y = app.screen.height / 2;
        music.eventMode = 'static';
        music.cursor = 'pointer';
        music.on('pointerdown', toggleMusic);

  audioState.setSprite('intro');
  if (audioState.getAudio()) {
    themeTrack.play('intro'); // sprite is set by default in the state constructor
  }

  function checkAudioState(nowplay: string) {
    if (audioState.getAudio()) {
      themeTrack.volume(0.5);
    } else {
      themeTrack.volume(0.0);
    }
    themeTrack.play(nowplay);
  }

  function stopTrack() {
    themeTrack.fade(0.5, 0.0, 100);
    themeTrack.stop();
    if (audioState.getAudio()) {
      console.log("audio is on");
      themeTrack.volume(0.5);
    } else {
      console.log("audio is off");
    }
  }

  function switchToIntro2Sprite() {
    play.off('pointerdown', switchToIntro2Sprite); // remove the event from the button
    stopTrack();
    checkAudioState('intro2');
    audioState.setSprite('intro2');
    // themeTrack.play('intro2');
  };

  function switchToMainMusicSprite() {
    stopTrack();
    checkAudioState('loop');
    audioState.setSprite('loop');
    // themeTrack.play('loop');
  };

  function toggleMusic() {
    audioState.toggleAudio();
    if (audioState.getAudio()) {
      themeTrack.fade(0.0, 0.5, 100);
    } else {
      themeTrack.fade(0.5, 0.0, 100);
    }
  };
  
  heroContainer.addChild(hero);
  heroContainer.addChild(play);
  heroContainer.addChild(music);
  app.stage.addChild(heroContainer);

  const playStageContainer = new Container(); // main stage container
        playStageContainer.x = 0;
        playStageContainer.y = 0;

  const drumsContainer = new Container(); // all drums container
        drumsContainer.x = (app.stage.width / 2) - (162 * 2.5);
        drumsContainer.y = 100;
  
  const sprites = await Assets.load('/images/sprites.json').then(() => {
    return Assets.cache.get('/images/sprites.json');
  });

  const playerTexture = await Assets.load('/images/player.svg');
  const player: Sprite = new Sprite(playerTexture);
        player.anchor.set(0.5);
        player.width = 160;
        player.height = 160;
        player.tint = 0xffffff;
        player.x = 411;
        player.y = app.screen.height - 200;
  
  playStageContainer.addChild(player);

  const shotTexture = await Assets.load('/images/shot.svg');
  const shot: Sprite = new Sprite(shotTexture);
        shot.anchor.set(0.5);
        shot.height = 160;
        shot.width = 160;
        shot.x = 0;
        shot.y = app.screen.height - 200;

  playStageContainer.addChild(shot);
  
  const drums: any = [];
  
  for (let i = 0; i < 5; i++) {
    const drumContainer = new Container(); // individual drum container
    drums.push(drumContainer);
  }

  drums.forEach((drum: Container, index: number) => {
    drum.x = index * 160;
    // in case you want to go from end backwards
    /*
    testArr[index].reverse().forEach((symbol, index) => {
      const invader = returnSymbol(symbol, index);
      if (invader) {
        drum.addChild(invader);
      }
    });
    */
    testArr[index].forEach((symbol, index) => {
      const invader = new Invader(sprites).generateInvader(symbol, index);
      if (invader) {
        drum.addChild(invader);
      }
    });
    drumsContainer.addChild(drum);
  });

  playStageContainer.addChild(drumsContainer);

  app.stage.addChild(playStageContainer);

  let frameCount: number = 0.0;
  
  const fadeAmount: number = 0.03;

  app.ticker.add((time) => {
    frameCount += time.deltaTime / 60;
    heroContainer.position.y += Math.sin(frameCount) * 0.5;
    if (applicationState.getMenu()) {
      heroContainer.alpha = heroContainer.alpha > 0 ? heroContainer.alpha - fadeAmount : 0;
      // play container
      playStageContainer.alpha = playStageContainer.alpha < 1 ? playStageContainer.alpha + fadeAmount : 1;
    }
    if (applicationState.getGame()) {
      // main game loop
      heroContainer.alpha = heroContainer.alpha < 1 ? heroContainer.alpha + fadeAmount : 1;
      // play container
      playStageContainer.alpha = playStageContainer.alpha > 0 ? playStageContainer.alpha - fadeAmount : 0;
    }
    if (audioState.getAudio()) {
      themeTrack.volume(themeTrack.volume() > 0 ? themeTrack.volume() - 0.1 : 0.0);
    } else {
      themeTrack.volume(themeTrack.volume() < 0.5 ? themeTrack.volume() + 0.1 : 0.5);
    }

    if (applicationState.getAnimateShot()) {
      shot.visible = true;
      shot.x = applicationState.getShotSpawn();
      if (shot.y > -(app.screen.height - 200)) {
        shot.y = shot.y - 8;
      } else {
        applicationState.setShotSpawn(playStageContainer.x);
        shot.y = app.screen.height - 200;
      }
    } else {
      shot.visible = false;
      shot.y = app.screen.height - 200;
    }
    // playerContainer.position.x += mapValues(Math.sin(frameCount), -1, 1, -5.3, 5.3); // do this between spins
  });

  // keyboard controls 
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyM') {
      applicationState.toggleMenu();
      applicationState.toggleGame();
    }
    if (event.code === 'KeyN') {
      audioState.toggleAudio();
    }
    if (event.code === 'KeyB') {
      console.log("shot spawn:", playStageContainer.x)
      applicationState.setShotSpawn(playStageContainer.x);
      applicationState.toggleAnimateShot();
    }
    if (event.code === 'ArrowLeft') {
      if (player.x > 450) {
        player.x = player.x - 160;
      } else {
        player.x = 411;
      }
    }
    if (event.code === 'ArrowRight') {
      if (player.x < (250 + (160 * 5))) {
        player.x = player.x + 160;
      } else {
        player.x = app.stage.width - 411;
      }
    }
    if (event.code === 'Space') {
      // we're going to try and find our winners here
      if (!applicationState.getRevealWinners()) {
        applicationState.toggleRevealWinners();
        WinningSets(testArr).forEach((set) => {
  
          for (let i = 0; i < set.positions.length; i++) {
            const anwinrar = (Array.from(drums) as any)[set.positions[i].drum].children[set.positions[i].index];
            applicationState.addWinner(anwinrar);
            const explosion = new Explosion(sprites).generateExplosion();
                  explosion.x = set.positions[i].drum * 160;
                  explosion.y = set.positions[i].index * 116;
            applicationState.addExplosion(explosion);
          }
        });
        applicationState.getWinners().forEach((anwinrar) => {
          anwinrar.visible = false;
        });
        applicationState.getExplosions().forEach((explosion) => {
          drumsContainer.addChild(explosion);
        });
      } else {
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
    }
    // explosions.forEach((explosion) => {
    //   drumsContainer.addChild(explosion);
    // });
    // explosions.forEach((explosion) => {
    //   explosion.destroy();
    // });
  });

})();
