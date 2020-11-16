# post5

post5 is a library for p5 that enables you to do interesting post-processing
effects with the power of WebGL2. It wraps
[merge-pass](https://github.com/bandaloo/merge-pass) and
[postpre](https://github.com/bandaloo/postpre).

Check out the
[merge-pass live example](https://www.bandaloo.fun/merge-pass/example.html)
and the [postpre live example](https://www.bandaloo.fun/postpre/example.html)
to get an idea of how to nest and sequence these effects in interesting ways.
Also check out the included examples in this repo.

To get started, all you need to do is include the `post5.js` script after
the `p5` script and before your sketch script:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="p5.js"></script>
    <script src="post5.js"></script>
    <script src="instancesketch.js"></script>
  </head>
  <body></body>
</html>
```

## Building

(This build process will be replaced with an easier one soon. postpre will be
a submodule so the build process isn't divided between two different repos.)

This repo includes `p5bundle.js` produced by the `npm run p5` script in the
postpre package available [here](https://github.com/bandaloo/postpre).
Running `sh build.sh` literally justs concatenates `p5bundle.js` with
`p5extensions.js` (which does the extending of the p5 prototype) to produce
`post5.js`. This file is committed for convenience. also, `p5.js` version
1.1.9 is also included so that the examples work out the gate. The included
examples use `post5.js` so run `sh build.sh` after making changes to
`p5extensions.js`.
