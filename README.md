# Space Invaders Slots

This is a coding competency test for MrQ.

The underlying tech is based on Vite, TypeScript, PixiJS, Anime.js, and Howler.js

I wanted to evoke the feeling of the original Space Invaders game as well as the nostalgic feel of the arcade itself. This is why I chose to use the original sprites, artwork, and sounds as much as possible and then attempted to blend them with an 80s inspired audio track. The hope was that it would be exciting but not too domineering for extended periods of play.

## Screenshots

![Screenshot](/screenshots/intro.png)
*Caption: The intro screen.*

![Screenshot](/screenshots/playfield.png)
*Caption: The main playing screen.*

![Screenshot](/screenshots/spinning.png)
*Caption: The drums spinning with the symbols blurred .*

![Screenshot](/screenshots/reveal.png)
*Caption: The reveal of the winning symbols and incrementing score.*

## Installation

`npm i`

## Running

`npm run dev`

## Building

`npm run build` - this will provide a bundled package in the `./dist` folder.

## Graphics

Almost all of the art is from the resource site [Classic Gaming](https://www.classicgaming.cc/classics/space-invaders/graphics)

## Audio

"These 80s" by [Artur Aravidi](https://pixabay.com/users/arturaravidimusic-37133175/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=182328) from [Pixabay](https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=182328)

Voice samples and menu sounds from the Nintento DS game [Space Invaders Extreme II](https://www.sounds-resource.com/ds_dsi/spaceinvadersextreme2/sound/9439/)

All other sounds from the original Taito arcade game

## TODO:

An ever expanding list of things to implement, do better, or just reflections:

- Investigate why the intro screen duplicates the toggle `music button` instead of displaying the `play` button on my laptop.
- Turn the buttons into an actual object that can take a text string and not just be an SVG
- Turn that ^ button object into a class for sprite generation
- Generators for player sprites
- Generators for drums (I probably should have thought of that on day 2)
- I would have liked to abstract out even more functions to make the entire architecture more modular and thereby portable/reusable but as it was for a one-off project it wasn't worth the time investment.
- Replace the dummy invaders after a spin - currently this only happens on game initialisation. It's not that hard to implement as we already have the winning array, we just have to move the drums' position quietly in the background so that the old winning array is now the bottom of the new array and destroy and replace the other (5 * 2997) sprites.
- Fix the theme tune playback audio sprite - it works but it's not meant for looping…
- Make the `WinningSets` algorithm return a multidimensional array so that the `revealWinners` function and animation loop can clear between reveals. I did try but for some reason the pixijs objects lost their positional vector when being brought back in. Fixing it would have added additional time which I just did not have.
- I would like to refactor with a design grid in mind to ensure layout across multiple platforms
- I'm sure there are more…
