const mpg = {
  replaced: false,
  orig: null,
  canvas: null,
  gl: null,
  verbosity: 1,
  merger: [],
  __merger: null,
};

function mpInit() {
  if (mpg.verbosity > 0) console.log("mp init");
}

function mpPre() {
  if (mpg.replaced) return;
  if (mpg.verbosity > 0) console.log("mp pre x1");

  mpg.orig = document.getElementById("defaultCanvas0");

  if (!mpg.orig) throw new Error("mergepass couldn't get the p5 canvas");
  const parent = mpg.orig.parentElement;

  mpg.canvas = document.createElement("canvas");

  mpg.canvas.width = mpg.orig.width;
  mpg.canvas.height = mpg.orig.height;
  mpg.canvas.style.width = mpg.orig.style.width;
  mpg.canvas.style.height = mpg.orig.style.height;

  //style="position: absolute; left: 0; top: 0; z-index: 0;"

  mpg.gl = mpg.canvas.getContext("webgl2");
  if (!mpg.gl) throw new Error("mergepass couldn't get the webgl2 context");

  parent.appendChild(mpg.canvas);

  console.log(mpg.merger);
  mpg.__merger = new MP.Merger(mpg.merger, mpg.orig, mpg.gl);
  console.log(mpg.__merger);

  const align = (c, z) => {
    c.style.position = "absolute";
    c.style.left = 0;
    c.style.top = 0;
    c.style.zIndex = z;
  };

  align(mpg.canvas, 0);
  align(mpg.orig, 1);

  mpg.orig.style.visibility = "hidden";

  mpg.replaced = true;
}

function mpPost() {
  if (mpg.verbosity > 1) console.log("mp post");
  if (!mpg.merger) return;

  mpg.__merger.draw(0);
}

p5.prototype.registerMethod("pre", mpPre);
p5.prototype.registerMethod("init", mpInit);
p5.prototype.registerMethod("post", mpPost);
