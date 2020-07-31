// @ts-nocheck
// p5 sketch running in 'global mode'
let black = false;

function setup() {
  createCanvas(400, 400);
  background(255);
  post5.effects = [
    post5.noisedisplacement(),
    post5.godrays({ samplerNum: -1, lightPos: post5.nmouse() }),
    post5.oldfilm(),
    post5.vignette(),
  ];
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
