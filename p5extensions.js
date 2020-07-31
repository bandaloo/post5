// @ts-nocheck
{
  p5.prototype.post5 = MP;
  p5.prototype.post5.__info = {
    replaced: false,
    orig: null,
    canvas: null,
    gl: null,
    verbosity: 1,
    startTime: 0,
    mousePos: { x: 0, y: 0 },
  };

  p5.prototype.post5.effects = [];
  p5.prototype.post5.channels = [];

  const mpg = p5.prototype.post5.__info;

  function mpInit() {
    if (mpg.verbosity > 0) console.log("mp init");
  }

  function mpPre() {
    if (mpg.replaced) return;
    if (mpg.verbosity > 0) console.log("mp pre x1");

    mpg.startTime = new Date().getTime();

    mpg.orig = document.getElementById("defaultCanvas0");

    if (!mpg.orig) throw new Error("mergepass couldn't get the p5 canvas");
    const parent = mpg.orig.parentElement;
    parent.style.position = "relative";

    mpg.canvas = document.createElement("canvas");

    mpg.canvas.width = mpg.orig.width;
    mpg.canvas.height = mpg.orig.height;
    mpg.canvas.style.width = mpg.orig.style.width;
    mpg.canvas.style.height = mpg.orig.style.height;

    mpg.gl = mpg.canvas.getContext("webgl2");
    if (!mpg.gl) throw new Error("mergepass couldn't get the webgl2 context");

    parent.appendChild(mpg.canvas);

    mpg.merger = new MP.Merger(p5.prototype.post5.effects, mpg.orig, mpg.gl, {
      channels: p5.prototype.post5.channels,
    });

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
      mpg.mousePos.x =
        (mpg.canvas.width * (e.clientX - rect.left)) / rect.width;
      mpg.mousePos.y =
        (mpg.canvas.height * (rect.height - (e.clientY - rect.top))) /
        rect.height;
    });

    mpg.replaced = true;
  }

  function mpPost(t) {
    if (mpg.verbosity > 1) console.log("mp post");
    if (!mpg.merger) return;
    const time = mpg.startTime - new Date().getTime();
    mpg.merger.draw(time / 1000, mpg.mousePos.x, mpg.mousePos.y);
  }

  p5.prototype.registerMethod("pre", mpPre);
  p5.prototype.registerMethod("init", mpInit);
  p5.prototype.registerMethod("post", mpPost);
}
