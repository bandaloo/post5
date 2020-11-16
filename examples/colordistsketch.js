// @ts-nocheck
let white = false;

function setup() {
  createCanvas(400, 400);
  background(255);
  addEffects(
    godrays({ samplerNum: -1, lightPos: nMouse(), density: 0.5 }),
    channel(
      -1,
      op(pos(), "+", op(get2Comp(fColor(), "rg"), "*", op(nMouse(), "-", 0.5)))
    )
  );
}

function draw() {
  if (white) {
    colorMode(RGB);
    fill(255, 255, 255);
  } else {
    colorMode(HSB, 100);
    fill(Math.random() * 100, 100, 100);
  }
  noStroke();
  ellipse(mouseX, mouseY, 20 + (r = 60 * Math.random()), 20 + r);
}

function mouseClicked() {
  white = !white;
}
