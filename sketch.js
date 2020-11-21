var trex;
var trex_running,trex_jump;
var edges;
var ground;
var groundImage;
var invisibleGround;
var ran;
var cloud;
var cloudImage;
var obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score=0;
var PLAY=1;
var END=0;
var gameState=PLAY;
var obstaclesGroup;
var cloudsGroup;
var trex_collided;
var gameOver,restart,gameOverImage,restartImage;
var jumpSound,checkpointSound,dieSound;

function preload() {
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_jump=loadAnimation("trex1.png");
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  trex_collided=loadAnimation("trex_collided.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  

}

function setup() {
  createCanvas(600,200);
  //console.time()
  //creating the trex
  trex = createSprite(50,160,10,50);
  trex.addAnimation("trexrunning",trex_running);
  trex.addAnimation("trexcollided",trex_collided);
  trex.addAnimation("trex_jump",trex_jump);
  trex.scale=0.5;
  //trex.debug=true;
  trex.setCollider("circle",0,0,40);
 
  //creating the ground
  ground=createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  
  //creating invisible ground
  invisibleGround=createSprite(300,195,600,10);
  invisibleGround.visible=false;
  
  //creating game over and restart
  gameOver=createSprite(300,100,10,10);
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale=0.5;
  
  restart=createSprite(300,150,10,10);
  restart.addImage("restart",restartImage);
  restart.scale=0.5;
                     
  edges=createEdgeSprites();
//  console.timeEnd()
  
  ran=Math.round(random(1,100));
  //console.log(invisibleGround.depth);
  
  cloudsGroup=new Group();
  obstaclesGroup=new Group();
  
}

function draw() {
  background("white");
  text("Score: "+score,500,50)
  console.log(trex.y)
  //console.log(getFrameRate())
  //creating the Game state play
  if (gameState===PLAY) {
    
    trex.changeAnimation("trexrunning");
    //game over and restart should not be visible
    
    gameOver.visible=false;
    restart.visible=false;
    
    score=score+Math.round(getFrameRate()/60);
    
    if(score%100===0 && score>0 ){
      checkpointSound.play();
    }
    
  ground.velocityX=-(2 + score/100);
    
    //to reset the ground and create infinite screen
  if(ground.x<0) {
    ground.x=ground.width/2; 
  }
  
    //to change the trex animation when he jumps
    if(trex.y<166.5){
      trex.changeAnimation("trex_jump");
    }
    
  //to make the trex jump by space
   if(keyDown("space")&&trex.y>=167.5) {
     trex.velocityY=-10;
     jumpSound.play();
   } 
  
  //to make the  trex jump by up arroow
  if(keyDown("up")&&trex.y>=167.5) {
     trex.velocityY=-10;
     jumpSound.play(); 
   } 
  
  //to give gravity to trex
  trex.velocityY=trex.velocityY+0.5;
 
    spawnClouds();
  spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)) {
      gameState=END;
     dieSound.play();
     // trex.velocityY=-10;
       //jumpSound.play();
    }
  }
    else if(gameState===END)  {
      //to make gameOver and restart visible
      
      gameOver.visible=true;
      restart.visible=true;
      
      trex.changeAnimation("trexcollided");
      ground.velocityX=0;
      trex.velocityY=0;
      cloudsGroup.setVelocityXEach(0);
      obstaclesGroup.setVelocityXEach(0);
      //adding negative lifetime so that clouds and obstacles dont disappear
      cloudsGroup.setLifetimeEach(-1);
      obstaclesGroup.setLifetimeEach(-1);
      
      //reset trex when pressed over restart
      if(mousePressedOver(restart)) {
        reset();
      }
    }
  
 // console.time()
  
  
  //to support the trex from falling
  trex.collide(invisibleGround);
  
  
  drawSprites();
  
}

function reset() {
 gameState=PLAY
   cloudsGroup.destroyEach();
   obstaclesGroup.destroyEach();
 gameOver.visible= false;
  restart.visible= false;
  score=0;
  
}



function spawnClouds() {
  if(frameCount%100==0)  {
  cloud=createSprite(600,100,10,10);
  cloud.velocityX=-2;
    cloud.addImage("cloud",cloudImage);
    cloud.scale=0.5;
    cloud.y=Math.round(random(60,120));
   // console.log(cloud.depth);
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloud.lifetime=300;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount%80==0) {
    obstacle=createSprite(600,165,10,10);
    obstacle.velocityX=-(6 + score/100);
    ran=Math.round(random(1,6));
    switch(ran) {
      case 1:obstacle.addImage(obstacle1);
        break;
        
        case 2:obstacle.addImage(obstacle2);
        break;
    
        case 3:obstacle.addImage(obstacle3);
        break;
        
        case 4:obstacle.addImage(obstacle4);
        break;
        
        case 5:obstacle.addImage(obstacle5);
        break;
        
        case 6:obstacle.addImage(obstacle6);
        break;
        
        default:break;
        
    }
    obstacle.scale=0.5;
    obstacle.lifetime=100;
    obstaclesGroup.add(obstacle);
  }
}
