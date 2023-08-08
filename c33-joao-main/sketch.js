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

var boatSpriteSheet;
var brokenBoatAnimation = [];
var brokenBoatSpriteData;
var brokenBoatSpriteSheet;

var ballanimation = [];
var ballspritedata, ballspritesheet;

function preload() {

  bgImg = loadImage("./assets/background.gif");
  towerimg = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");
  brokenBoatSpriteData = loadJSON("./assets/boat/broken_boat.json");
  brokenBoatSpriteSheet = loadImage("./assets/boat/broken_boat.png");
  ballspritedata = loadJSON("./assets/water_splash/water_splash.json");
  ballspritesheet = loadImage("./assets/water_splash/water_splash.png");

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

  var brokenBoatFrames =  brokenBoatSpriteData.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
      var pos = brokenBoatFrames[i].position;
      var Img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
      brokenBoatAnimation.push(Img);
  }

  var waterframe = ballspritedata.frames;
  for (let i = 0; i < waterframe.length; i++) {
    var pos = waterframe [i].position;
    var img = ballspritesheet.get(pos.x,pos.y,pos.w,pos.h);
    ballanimation.push(img);
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
    ball.animate();
    if (ball.body.position.x>=width||ball.body.position.y>=height-50) {
      ball.remove(index);
      
    }
  }
}

function showBoats(){
  if (boats.length>0) {
    if (boats[boats.length-1]===undefined||
      boats[boats.length-1].body.position.x<width-300 ) {
      var positions=[-40,-60,-70,-20];
      var position=random(positions);
      var boat = new Boat(width-79,height-60,170,170,position,boatAnimation)
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0})
        boats[i].display();
        boats[i].animate();      
      }
      
    }
  } else {
    var boat = new Boat(width-79,height-60,170,170,-80,boatAnimation)
    boats.push(boat);
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