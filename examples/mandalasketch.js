// @ts-nocheck
let black = false;

function setup() {
  createCanvas(400, 400);
  background(0);
  const intensity = op(getComp(nMouse(), "y"), "*", 0.03);
  const tracing = op(op(getComp(nMouse(), "x"), "-", 0.5), "*", 2);
  addEffects(
    noiseDisplacement(0.05, 1, intensity),
    blurAndTrace(tracing, 2),
    kaleidoscope(),
    godrays({ samplerNum: -1, lightPos: nMouse(), density: 0.5 })
  );
  addChannels(null);
}

function draw() {
  if (black) {
    fill(0);
  } else {
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }
  noStroke();
  ellipse(mouseX, mouseY, 20 + (r = 60 * Math.random()), 20 + r);
}

function mouseClicked() {
  black = !black;
}
