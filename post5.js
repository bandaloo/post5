// @ts-nocheck
const mpg = {
  replaced: false,
  orig: null,
  canvas: null,
  gl: null,
  verbosity: 1,
  merger: [],
  __merger: null,
  __startTime: 0,
  __date: null,
  __mousePos: { x: 0, y: 0 },
};

function mpInit() {
  if (mpg.verbosity > 0) console.log("mp init");
}

function mpPre() {
  if (mpg.replaced) return;
  if (mpg.verbosity > 0) console.log("mp pre x1");

  mpg.__startTime = new Date().getTime();

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

  mpg.canvas.addEventListener("mousemove", (e) => {
    const rect = mpg.orig.getBoundingClientRect();
    mpg.__mousePos.x =
      (mpg.canvas.width * (e.clientX - rect.left)) / rect.width;
    mpg.__mousePos.y =
      (mpg.canvas.height * (rect.height - (e.clientY - rect.top))) /
      rect.height;

    console.log(mpg.__mousePos);
  });

  mpg.replaced = true;
}

function mpPost(t) {
  if (mpg.verbosity > 1) console.log("mp post");
  if (!mpg.merger) return;
  const time = mpg.__startTime - new Date().getTime();
  mpg.__merger.draw(time / 1000, mpg.__mousePos.x, mpg.__mousePos.y);
}

p5.prototype.registerMethod("pre", mpPre);
p5.prototype.registerMethod("init", mpInit);
p5.prototype.registerMethod("post", mpPost);
