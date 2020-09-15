// @ts-nocheck
let black = false;

function setup() {
  createCanvas(400, 400);
  addEffects(blur2d(2, 2, 13), motionBlur());
  addChannels(null);
}

function draw() {
  background(255);
  fill(255, 0, 0);
  noStroke();
  ellipse(mouseX, mouseY, 70, 70);
}
