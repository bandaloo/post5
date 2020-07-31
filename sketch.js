// @ts-nocheck
function setup() {
  createCanvas(400, 400);
  mpg.merger = [MP.vignette()];
}

function draw() {
  background(220);
  ellipse(50, 50, 80, 80);
}

function mouseClicked() {
  console.log("test");
}
