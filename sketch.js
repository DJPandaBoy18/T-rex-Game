//variable declaration
var PLAY = 1;
var END = 0;
var gameState = PLAY;

   var message ="Hi!";
var trex, trex_running, trexcollide;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var cloudsGroup, cloudImage;
var cloud;

var jumpSound, checkPointSound, dieSound;

var obstacle;
var score = 0;

var gameOver
var restart

function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trexcollide = loadAnimation("trexcollide.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  background(220)
  createCanvas(600, 200)
 
  
  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trexcollide);
  trex.scale = 0.5;

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 140);
  restart.addImage("restart", restartImg);
  restart.scale = 0.5;
  restart.visible = false;


  //creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //generate random num
  var rand = Math.round(random(1, 100))
  //console.log(rand)

  //create Obstacle and Cloud Groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

}

function draw() {
  //set background color
  background(220);
console.log(trex.depth);
//console.log(trex.y)

  console.log(message);

      if(score>0 && score%100===0){
        checkPointSound.play();
      }


  if (gameState === PLAY) {
    ground.velocityX = -4;
    text("Score: " + score, 100, 50);
    score = score + Math.round(frameCount / 300);
    score.depth = trex.depth
    trex.depth = trex.depth + 1;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //Spawn Clouds
    spawnClouds();

    //Spawn Obstacles
    spawnObstacles();

    // jump when the space key is pressed
    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -12;
    jumpSound.play();
    }
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    dieSound.play();
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    //To stop the ground from moving
    ground.velocityX = 0;
    //stop the trex during collision
    trex.velocityY = 0;
    //stop the obstacles and clouds during collision
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collide", trexcollide);
    //set lifetime of the game objects so that they never destroy
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
  }


  trex.setCollider("rectangle",0,0,90,90);
  //trex.debug = true;

  //Gravity
  trex.velocityY = trex.velocityY + 0.6


  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  //stop trex from falling down
  trex.collide(invisibleGround);

  console.log(World.frameCount);
if(mousePressedOver(restart)){
  reset(); 
}

  drawSprites();
}

//function to spawn the clouds
function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(400, 10, 40, 10);
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -4;
    cloud.y = Math.round(random(10, 60));
    cloud.x = 601;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 201;
    //Add each cloud to the group
    cloudsGroup.add(cloud);

  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 145, 10, 40);
    obstacle.y = 170
    obstacle.x = 601;
    obstacle.velocityX = ground.velocityX;
    obstacle.visible = true;
    obstacle.addImage(obstacle1);
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;

      default:
        break;
    }
    obstacle.scale = 0.4;
    obstacle.lifetime = 201;
    trex.depth = trex.depth + 1;
    obstacle.lifetime = 201;
    //Add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}