# Conjurer

Conjurer is a web app that allows one to design audiovisual experiences for the [Canopy of Luminous Conjury](https://se.cretfi.re/canopy/), a large LED art piece by [The Servants of the Secret Fire](https://se.cretfi.re/).

## Overview

You can think of Conjurer as an in-browser Digital Audio Visual Workstation, similar to the concept of a [Digital Audio Workstation (DAW)](https://en.wikipedia.org/wiki/Digital_audio_workstation). Whereas a DAW is used to arrange and produce audio compositions, Conjurer aims to provide the ability to arrange audio and visuals into an "experience" which can be saved and played at a later time.

## Developing

We manage dependencies with `yarn`.

```bash
# install dependencies
yarn

# run the app with hot reloading on save
yarn dev
```

### Tips

- In this repo, patterns/effects at their core are just fragment shaders. They may seem scary at first, but with a proper introduction like in [The Book of Shaders](https://thebookofshaders.com/), you too could wield their considerable power!
- We use [Chakra](https://chakra-ui.com/) for our UI in this repo. Check out the [available components here](https://chakra-ui.com/docs/components) as well as the [default theme](https://chakra-ui.com/docs/styled-system/theme#gray)
- We use [MobX](https://github.com/mobxjs/mobx) for state management. It's not Redux!
- We use [ThreeJS](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) to render the shaders/3D canopy.
- We use [`react-icons`](https://react-icons.github.io/react-icons/search) - just search for what you want and import the icon from the correct place.
- We use [`recharts`](https://recharts.org/en-US/api) to do some simple graphs.

## Major todos

(in no particular order)

- Audio
  - Store audio files in S3
  - Allow selecting any audio file that is hosted in the S3 bucket
  - Provide an uploading interface?
- Persisting experiences
  - Persist to local storage, auto save every X minutes
  - Persist arrangement to a backend (maybe just S3?)
  - Allow sharing via base64 encoded strings
- Effects
  - Shaders that accept a texture and apply an effect, outputting a new texture that can be rendered to the screen or fed into another effect
  - Similar to patterns, except that effects operate on patterns
  - Turns out this is very difficult
- Parameter variations
  - changes over time applied to pattern/effect parameters (shader uniforms)
  - Add more types of parameter variations, like [some of these easing functions](https://easings.net/)
- Websocket API
  - Build websocket API to send frame data to Unity app
  - Can leverage [work that we did here](https://github.com/SotSF/canopy-values/blob/master/src/modules/events.ts) in `canopy-values`
- Make all the patterns! Make all the effects!
