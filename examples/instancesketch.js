// @ts-nocheck
// p5 sketch running in 'instance mode'
new p5(function (sketch) {
  sketch.black = false;

  sketch.setup = () => {
    const c = sketch.createCanvas(400, 400);
    c.par;
    sketch.background(255);
    sketch.post5.effects = [
      sketch.post5.noisedisplacement(),
      sketch.post5.godrays({ samplerNum: -1, lightPos: sketch.post5.nmouse() }),
      sketch.post5.oldfilm(),
      sketch.post5.vignette(),
    ];
  };

  sketch.draw = () => {
    const col = sketch.black ? 255 : 0;
    sketch.fill(col, col, col);
    sketch.noStroke();
    sketch.ellipse(
      sketch.mouseX,
      sketch.mouseY,
      20 + (r = 60 * Math.random()),
      20 + r
    );
  };

  sketch.mouseClicked = () => {
    sketch.black = !sketch.black;
  };
});
