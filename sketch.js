// @ts-nocheck
function setup() {
  createCanvas(400, 400);
  mpg.merger = [new MP.NoiseDisplacement(), MP.vignette()];
}

function draw() {
  background(220);
  ellipse(50, 50, 80, 80);
}

function mouseClicked() {
  console.log("test");
}

function mouseMoved() {
  //ellipse(mouseX, mouseY, 5, 5);
  //console.log("p5", mouseX, mouseY);
  // prevent default
  return false;
}
