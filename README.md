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

- We use [default theme](https://chakra-ui.com/docs/styled-system/theme#gray) of [Chakra](https://chakra-ui.com/) for our UI in this repo.
- We use [MobX](https://github.com/mobxjs/mobx) for state management. It's not Redux!

## Concepts

- timeline
- pattern
  - shader source code (frag?)
  - uniforms definition (generic + )
- effect
- block

  - abstract container of a pattern or effect

- uniforms
  - u_time
  - u_global_time
  - u_resolution
  - generic other stuff defined
