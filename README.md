# Space Invaders Slots

This is a coding competency test for MrQ.

The underlying tech is based on Vite, TypeScript, PixiJS, Anime.js, and Howler.js

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

An ever expanding list of things to implement or do better:

- Turn the buttons into an actual object that can take a text string and not just be an SVG
- Fix the theme tune playback audio sprite - it works but it's not meant for looping…
- Make the WinningSets algorithm return a multidimensional array so that the revealWinners function and animation loop can clear between reveals. I did try but for some reason the pixijs objects lost their positional vector when being brought back in. Fixing it would have added additional time which I just did not have.
- I would have liked to abstract out even more functions to make the entire architecture more modular and thereby portable/reusable but as it was for a one-off project it wasn't worth the time investment.
- I'm sure there are more…
