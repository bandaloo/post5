// @ts-nocheck
let white = false;

function setup() {
  createCanvas(400, 400);
  background(0);
  addEffects(blurAndTrace());
  addChannels(null);
}

function draw() {
  if (white) {
    fill(0);
  } else {
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }
  noStroke();
  ellipse(mouseX, mouseY, 20 + (r = 60 * Math.random()), 20 + r);
}

function mouseClicked() {
  white = !white;
}
