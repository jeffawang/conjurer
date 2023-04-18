# Conjurer

Conjurer is a web app that allows one to design audiovisual experiences for the [Canopy of Luminous Conjury](https://se.cretfi.re/canopy/).

## Developing

We manage dependencies with `yarn`.

```bash
# install dependencies
yarn

# run the app with hot reloading on save
yarn dev
```

### Tips

- We use the [default theme](https://chakra-ui.com/docs/styled-system/theme#gray) of [Chakra](https://chakra-ui.com/) for our UI in this repo.
- We use [MobX](https://github.com/mobxjs/mobx) for state management. It's not Redux!

## Major todos

- Persist arrangement to local storage
  - Potentially allow sharing via base64 encoded strings?
- Persist arrangement to a backend (S3?)
- Add effects - shaders that accept a texture and apply an effect, outputting a new texture that can be rendered to the screen or fed into another effect
  - Turns out this is very difficult
- Add more types of parameter variations - easing functions that can be applied to pattern or effect parameters (shader uniforms)
- Build websocket API to talk with unity app
- Make all the patterns! Make all the effects!
