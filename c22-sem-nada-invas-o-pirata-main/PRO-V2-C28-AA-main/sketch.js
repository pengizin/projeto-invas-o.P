const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world;
var bgImg;
var boats = [];
var balls = [];
var cannon;
var angle = 20;

var tower, towerimg;
var boatAnimation = [];
var boatSpriteData, boatSpriteSheet;

function preload() {

  bgImg = loadImage("./assets/background.gif");
  towerimg = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");


}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  angleMode(DEGREES);
  angle = 15

  cannon = new Cannon(180, 110, 130, 100, angle);

  var boatFrames = boatSpriteData.frames;
  for (let i = 0; i < boatFrames.length; i++) {
  var pos = boatFrames[i].position;
  var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
  boatAnimation.push(img);

  }
}


function draw() {

  background("darkblue")
  image(bgImg, 0, 0, 1200, 600)
  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);

  push();
  imageMode(CENTER);
  image(towerimg, tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.display();
  showBoats();
  for (let i = 0; i < balls.length; i++) {
    showCannonballs(balls[i], i);

    colisionBoats(i);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonball = new Cannonball(cannon.x, cannon.y);
    balls.push(cannonball);
  }
}

function showCannonballs(ball, index) {
  if (ball) {
    ball.display();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] === undefined ||
      boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -20, -70];
      var position = random(positions);
      var boat = new Boat(width - 79, height - 60, 170, 170, position);
      boats.push(boat)
    }
    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, { x: -0.9, y: 0 });
        boats[i].display();
      }
    }

  } else {
    var boat = new Boat(width - 79, height - 60, 170, 170, -80);
    boats.push(boat)
  }
}

function colisionBoats(index) {
  for (let i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      if (collision.collided) {
        boats[i].remove(i);

        Matter.World.remove(world, balls[index].body);
        delete balls[index]
      }
    }

  }
}