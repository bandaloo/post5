# post5

post5 is a library for p5 that enables you to do interesting post-processing
effects with the power of WebGL2. You can build it or download it from the
"releases" section on the sidebar in GitHub. It wraps
[merge-pass](https://github.com/bandaloo/merge-pass) and
[postpre](https://github.com/bandaloo/postpre).

Check out the
[merge-pass live example](https://www.bandaloo.fun/merge-pass/example.html)
and the [postpre live example](https://www.bandaloo.fun/postpre/example.html)
to get an idea of how to nest and sequence these effects in interesting ways.
Also check out the included examples in this repo or the examples
[in the web editor](https://editor.p5js.org/bandaloo/collections/KKmpKHP-V).

To get started, all you need to do is include the `post5.js` script after
the `p5` script and before your sketch script:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
    <script src="post5.js"></script>
    <script src="instancesketch.js"></script>
  </head>
  <body></body>
</html>
```

## Mappings from merge-pass and postpre to post5

This library is really just a thin wrapper for merge-pass and postpre.
(Although the default arguments for the provided functions will get you
pretty far, a number of things could be done to make this easier to use
without TypeScript and the surrounding tooling.) As mentioned previously,
check out the
[merge-pass live example](https://www.bandaloo.fun/merge-pass/example.html)
and the [postpre live example](https://www.bandaloo.fun/postpre/example.html)
for examples on how to use this library. Below is a table to keep track of
the mappings in post5; you want to use the names in the left column. Most are
just changed to camelCase, but some names had to change totally due to naming
conflicts with p5.

| post5             | merge-pass/postpre |
| ----------------- | ------------------ |
| foggyRays         | foggyrays          |
| vignette          | vignette           |
| blurAndTrace      | blurandtrace       |
| lightBands        | lightbands         |
| noiseDisplacement | noisedisplacement  |
| oldFilm           | oldfilm            |
| kaleidoscope      | kaleidoscope       |
| effectLoop        | loop               |
| gauss             | gauss              |
| fColor            | fcolor             |
| vec2              | vec2               |
| vec3              | vec3               |
| vec4              | vec4               |
| pVec2             | pvec2              |
| pVec3             | pvec3              |
| pVec4             | pvec4              |
| op                | op                 |
| blur2d            | blur2d             |
| len               | len                |
| normalize         | norm               |
| pixel             | pixel              |
| pos               | pos                |
| center            | center             |
| input             | input              |
| bright            | brightness         |
| contrast          | contrast           |
| grain             | grain              |
| getComp           | getcomp            |
| get2Comp          | get2comp           |
| get3Comp          | get3comp           |
| get4Comp          | get4comp           |
| changeComp        | changecomp         |
| rgbToHsv          | rgb2hsv            |
| hsvToRgb          | hsv2rgb            |
| time              | time               |
| a1                | a1                 |
| a2                | a2                 |
| fxaa              | fxaa               |
| channel           | channel            |
| depthOfField      | dof                |
| trueDepth         | truedepth          |
| godrays           | godrays            |
| depthToOcclusion  | depth2occlusion    |
| resolution        | resolution         |
| mouse             | mouse              |
| rotate2d          | rotate             |
| translate2d       | translate          |
| nMouse            | nmouse             |
| perlin            | perlin             |
| simplex           | simplex            |
| motionBlur        | motionblur         |
| randomFloat       | random             |
| sobel             | sobel              |
| bloom             | bloom              |
| monochrome        | monochrome         |
| invert            | invert             |
| edge              | edge               |
| edgeColor         | edgecolor          |
| ternary           | ternary            |
| region            | region             |
| cFloat            | cfloat             |
| cVec2             | cvec2              |
| cVec3             | cvec3              |
| cVec4             | cvec4              |
| mut               | mut                |
| basicFloat        | float              |
| pFloat            | pfloat             |
| tag               | tag                |
| celShade          | celshade           |

## Building

Run `sh build.sh`. This will automatically run `npm install` if
`node_modules` does not exist in the postpre submodule and generate
`post5.js`, which is the file you include as a script. Run `sh build.sh` to
run postpre's `npm install` regardless.
