import './style.css'

import {
  Application,
  Assets,
  Container,
  // Graphics,
  // GraphicsContext,
  Sprite,
  // Text
} from 'pixi.js';

import {
  Howl,
  // Howler
} from 'howler';

import {
  ApplicationState,
  AudioState,
  // ScoreState
} from './modules/state';

/*
import {
  degreesToRadians,
  mapValues
} from './modules/utilities';
*/

import { WinningSets } from './modules/winningset';

const testArr = [
  ["s1", "s2", "s5"],
  ["s3", "s3", "s1"],
  ["s4", "s1", "s2"],
  ["s4", "s2", "s5"],
  ["s4", "s5", "s1"]
]; // this should result in 2 returned sets

// the following array should result in 6 returned sets
// inspired by the duplicate s3 values in the previous array
// if a pair of values can appear in the same drum then that implies duplicate branching sequences
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

WinningSets(testArr).forEach((set) => {
  console.log(set.symbol, set.positions);
});

(async () => {
  const app = new Application();
  
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
    loop: true,
    sprite: {
      intro: [0.30, 2192],
      intro2: [2192, 9275],
      loop: [9275, 104070]
    },
    src: ['/sound/these-80s-182328.mp3'],
    volume: 0.5
  });

  const soundTrack = new Howl({
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

  /* debug audio states
  themeTrack.on('play', () => {
    if (audioState.getSprite() === 'intro') {
      console.log("we're in the intro");
    }
    if (audioState.getSprite() === 'intro2') {
      console.log("we're in intro2, moving to the loop");
    }
    if (audioState.getSprite() === 'loop') {
      console.log("we're in the loop");
    }
  });
  */

  themeTrack.on('end', () => {
    console.log("current audio sprite:", audioState.getSprite());
    if (audioState.getSprite() == "intro2") {
      console.log("stop intro2 and move to the main theme");
      switchToMainMusicSprite();
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
    audioState.setSprite('intro2');
    checkAudioState('intro2');
    // themeTrack.play('intro2');
  };

  function switchToMainMusicSprite() {
    stopTrack();
    audioState.setSprite('loop');
    checkAudioState('loop');
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

  const sprites = await Assets.load('/images/sprites.png');

  const container = new Container();

  const invader = new Sprite(sprites);

  container.x = (app.screen.width / 3) * 2;
  container.y = (app.screen.height / 3) * 2;

  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  let frameCount = 0.0;
  app.ticker.add((time) => {
    frameCount += time.deltaTime / 60;
    heroContainer.position.y += Math.sin(frameCount) * 0.5;
  });

  if (applicationState.getGame()) {
    console.log("game is on");
  }

  app.stage.addChild(container);

})();
