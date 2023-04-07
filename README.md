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

- We use Chakra for our UI in this repo. It can help to familiarize yourself with the [default theme of Chakra](https://chakra-ui.com/docs/styled-system/theme#gray) which we use.

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
