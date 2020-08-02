// @ts-nocheck
new p5(function (sketch) {
  sketch.black = false;

  sketch.setup = () => {
    const c = sketch.createCanvas(400, 400);
    sketch.background(255);
    sketch.addEffects(
      sketch.noiseDisplacement(),
      sketch.godrays({ samplerNum: -1, lightPos: sketch.nMouse() }),
      sketch.oldFilm(),
      sketch.vignette()
    );
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
