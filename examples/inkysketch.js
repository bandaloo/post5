// @ts-nocheck
let black = false;

function setup() {
  createCanvas(400, 400);
  background(255);
  addEffects(
    noiseDisplacement(),
    godrays({ samplerNum: -1, lightPos: nMouse() }),
    oldFilm(),
    vignette()
  );
}

function draw() {
  const col = black ? 255 : 0;
  fill(col, col, col);
  noStroke();
  ellipse(mouseX, mouseY, 20 + (r = 60 * Math.random()), 20 + r);
}

function mouseClicked() {
  black = !black;
}
