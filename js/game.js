var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
};

var game = new Phaser.Game(config);
var _scene;
var width, height;

function create() {
  _scene = this;
  width = _scene.game.config.width;
  height = _scene.game.config.height;
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  score = 0;
  level = START_LEVEL;
  lives = 3;
  objectData = _scene.cache.json.get('levelData');
  walls = _scene.add.group()
  player = _scene.matter.add.sprite(xStart, yStart, 'player');
  player.setOrigin(0.5).setScale(.6);
  //player.body.collideWorldBounds = true;
  player.body.label = 'player';
  player.dying = false;
  player.shooting = false;
   highScore = localStorage.getItem(localStorageName) == null ? 0 :
  localStorage.getItem(localStorageName);


   _scene.anims.create({
    key: 'run',
    frames: _scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 2
    }),
    frameRate: 10,
    repeat: -1
  });

  cat1 = _scene.matter.world.nextCategory();
  cat2 = _scene.matter.world.nextCategory();
  cat3 = _scene.matter.world.nextCategory();
  cat4 = _scene.matter.world.nextCategory();
  cat5 = _scene.matter.world.nextCategory();

  player.setFixedRotation();
  player.anims.load('run');
  player.setCollisionCategory(cat1);
 // player.setCollidesWith([cat1, cat2]);
 // player.setCollidesWith([cat1, cat3]);
 // player.setCollidesWith([cat1, cat4]);
  playerXSpeed = 0;
  playerYSpeed = 0;
  player.setDepth(1)
 // _scene.matter.world.setBounds(0, 0, width, height);
  maxxdaddy.visible = false;

  resetOTTOTimer();
  buildLevel();

  guardCount = numGuards = level + 4;
 // spawnEnemies();
 
  scoreText = _scene.add.text(
    width * 0.31,
    height * 0.9,
    'SCORE: 0', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  livesText = _scene.add.text(
    width * 0.47,
    height * 0.9,
    'LIVES: 3', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  levelText = _scene.add.text(
    width * 0.6,
    height * 0.9,
    'LEVEL: '+level, {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  _scene.input.keyboard.on('keydown_LEFT', function (event) {
    if (player.dying) return;
    movePlayer(-1, 0);
    player.flipX = true;
  });

  _scene.input.keyboard.on('keydown_RIGHT', function (event) {
    if (player.dying) return;
    
    movePlayer(1, 0);
    player.flipX = false;
  });

  _scene.input.keyboard.on('keydown_UP', function (event) {
    if (player.dying) return;
    movePlayer(0, -1)
  });

  _scene.input.keyboard.on('keydown_DOWN', function (event) {
    if (player.dying) return;
    movePlayer(0, 1);
  });

  _scene.input.keyboard.on('keydown_SPACE', function (event) {
    Fire();
  }, _scene);

  // _scene.input.keyboard.on('keyup_SPACE', function (event) {
  //   shooting = false;
  // });

  function onObjectClicked(pointer,gameObject){
    
    if(pointer.y>400)
   {
      switch (gameObject.name) {
    case 'right':
      movePlayer(1, 0);
      break;
    case 'left':
      movePlayer(-1, 0);
      break;
    case 'up':
      movePlayer(0, -1);
      break;
    case 'down':
      movePlayer(0, 1);
      break;
    default:
      break;
  }
}

 
}
  
 setUpArrows();
  _scene.input.on('pointerdown', function(pointer){
    if(pointer.y<400)
    Fire();
 });
  _scene.input.on('gameobjectdown',onObjectClicked);
  _scene.matter.world.on('collisionstart', handleCollision);

  gameOverText = _scene.add.image(width/2,height/2, 'game over');
  gameOverText.visible = false;
  gameOverText.setDepth(1);
}

function handleCollision(event){
    for (var i = 0; i < event.pairs.length; i++) {
      var bodyA = getRootBody(event.pairs[i].bodyA);
      var bodyB = getRootBody(event.pairs[i].bodyB);
      //kill bullet when it hits an obstacle
      if (bodyA.label == 'bullet' && bodyB.label == 'obstacle'
          || bodyB.label == 'bullet' && bodyA.label == 'obstacle') {
        var bullet = bodyA.label=='bullet' ? bodyA : bodyB;
        if (bullet.gameObject != null)
     {   bullet.gameObject.destroy();
        _scene.matter.world.remove(bullet);
      }
    } 
      //bullet hits guard
      else if (bodyA.label == 'bullet' && bodyB.label == 'guard'
      ||
      bodyB.label == 'bullet' && bodyA.label == 'guard') {
        var guard = bodyA.label=='guard' ? bodyA : bodyB;
        var bullet = bodyA.label=='bullet' ? bodyA : bodyB;
        killGuard(guard);
        if (bullet.gameObject != null)
          bullet.gameObject.destroy();
        _scene.matter.world.remove(bullet);
      } 
      else if ((bodyA.label == 'player' && bodyB.label == 'obstacle') ||
      (bodyB.label == 'player' && bodyA.label == 'obstacle')) {
        fryPlayer();
      } 
      else if (bodyA.label == 'player' && bodyB.label == 'guard' ||
               bodyB.label == 'player' && bodyA.label == 'guard') {
      var guard = bodyA.label=='guard' ? bodyA : bodyB;
        fryPlayer();
      killGuard(guard);
    } 
      else if (bodyA.label == 'bullet' && bodyB.label == 'player' 
      || bodyB.label == 'bullet' && bodyA.label == 'player') {
        var bullet = bodyA.label=='bullet' ? bodyA : bodyB;
        fryPlayer();
        if (bullet.gameObject != null){
        bullet.gameObject.destroy();
        _scene.matter.world.remove(bullet);
        }
      } 
       else if(bodyA.label == 'OTTO' && bodyB.label == 'guard' 
       || bodyB.label == 'OTTO' && bodyA.label == 'guard' ) {
        var guard = bodyA.label=='guard' ? bodyA : bodyB;
        killGuard(guard);
         }
      else if(bodyA.label == 'OTTO' && bodyB.label == 'player'
      || bodyB.label == 'OTTO' && bodyA.label == 'player' ) {
        fryPlayer();
        }
     //else if (bodyA.label == 'player' && bodyB.label == 'wall') {
      //   fryPlayer();
      //   resetWalls();
      // }
      // else if (bodyA.label == 'boss' && bodyB.label == 'bullet') {
      //  destroyWorld();
      //   }
    }
}
function destroyWorld(){
  player.destroy();
  _scene.matter.world.remove(player);
  OTTO.destroy();
  _scene.matter.world.remove(OTTO);
  boss.destroy();
  _scene.matter.world.remove(boss);
  bodyB.gameObject.destroy();
  _scene.matter.world.remove(bodyB);
  gameEnding = true;
}
function setUpArrows(){
  var y = height-10;
  for (let index = 0; index < arrows.length; index++) {
   var arrow = arrowStats[index];
   arrows[index] = _scene.add.image(0,0,'arrow');
   arrows[index].setOrigin(0.5).setScale(.25);
   arrows[index].xOffset = arrow.xOffset;  
   arrows[index].yOffSet = arrow.yOffset;  
    arrows[index].x = 60+arrows[index].width*.25+40+arrow.xOffset;
    arrows[index].y = y- arrows[index].width*.25+arrow.yOffset;
    arrows[index].name= arrow.direction;
    arrows[index].setInteractive();
   arrows[index].angle =arrow.angle;  
  }
}
function killGuard(guard)
{
  guard.dying = true;
  _scene.time.delayedCall(500, () => {
    if (guard.gameObject != null)
      guard.gameObject.destroy();
    _scene.matter.world.remove(guard);
    guardCount--;
    score += 50;
  });
}
function setFrame(xv, yv) {
  if (yv == 0 && xv != 0)
    return 0;
  else if (xv == 0 && yv != 0)
    return 1;
  else if ((xv > 0 && yv > 0) || (xv < 0 && yv < 0))
    return 2;
  else
    return 3;
}
function Fire(){
  if (player.dying) return;
  bulletDirection = {
    xv: playerXSpeed * 5,
    yv: playerYSpeed * 5
  };
  player.anims.pause(player.anims.currentAnim.frames[0]);
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'bullet';
  if (bulletDirection.xv != 0 || bulletDirection.yv != 0)
      shootBullet(bullet, bulletDirection);
  playerXSpeed = 0;
  playerYSpeed = 0;
  player.shooting = true;
}

function movePlayer(xv, yv) {
  player.shooting= false;
  if (xv != 0) {
    if (playerXSpeed === -xv) {
      playerXSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerXSpeed === 0) {
      playerXSpeed = xv;
      player.anims.play('run');
    }
  }
  if (yv != 0) {
    if (playerYSpeed === -yv) {
      playerYSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerYSpeed === 0) {
      playerYSpeed = yv;
      player.anims.play('run');
    }
  }
}

function shootBullet(bullet, direction) {
  var offsetX = 0;
  var offsetY = 0;
  offsetY = direction.yv * 4;
  offsetX = direction.xv * 2;
  bullet.setPosition(player.x + offsetX + direction.xv, player.y + offsetY + direction.yv);
  bullet.setVelocityX(direction.xv);
  bullet.setVelocityY(direction.yv);
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat2);
  setBulletAngle(bullet,direction);
}

function setBulletAngle(bullet, direction){
  var angle = Math.abs(direction.xv+direction.yv);
   if(angle==10)
    bullet.angle = 45;
  else if(angle==0)
    bullet.angle = 135;
  else 
    bullet.angle=Math.abs(direction.yv)*18;
}

function guardShoot(guard) {
  var bulletDirection = Math.atan((player.x - guard.x) / (player.y - guard.y));
  //some light randomness to the bullet angle
  bulletDirection += ((Math.random() / 10) + (-(Math.random() / 10)));
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'bullet';
  var xOffset = 0;
  var yOffset = 0;
  var xBulletSpeed = 5;
  var yBulletSpeed = 5;

  bullet.setFixedRotation();
  // Calculate X and y velocity of bullet to moves it from shooter to target
  if (player.x >= guard.x) {
    xOffset = guard.width / 2;
  } else {
    xBulletSpeed = -xBulletSpeed;
    xOffset = -guard.width / 2;
  }

if (player.y>guard.y+(guard.height/2) && player.y<guard.y-(guard.height/2)){
  yOffset = 0;
}

else if (player.y >= guard.y+(guard.height/2)) {
    yOffset = guard.height / 2;
  } else if (player.y <= guard.y-(guard.height/2)){
    yBulletSpeed = -yBulletSpeed;
    yOffset = -guard.height / 2;
  }

  //  console.log(guard.body.id, bulletDirection);
  bullet.setVelocityX(xBulletSpeed * Math.sin(Math.abs(bulletDirection)));
  bullet.setVelocityY(yBulletSpeed * Math.cos(Math.abs(bulletDirection)));
  // offsetY = direction.yv * 4;
  // offsetX = direction.xv * 2;
  bullet.setPosition(guard.x + xOffset, guard.y + yOffset);
  let angle = Phaser.Math.Angle.Between(player.x, player.y, guard.x, guard.y);
  bullet.rotation = angle;
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat2);
  //bullet.setCollidesWith([cat2,cat4]);
}

function spawnEnemies() {
   for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(200, width - 50);
    let y = Phaser.Math.Between(50, 350);
    guards[index] = _scene.matter.add.sprite(x, y, 'guard');
    var guard = guards[index];
 
    _scene.anims.create({
      key: 'guardRun',
      frames: _scene.anims.generateFrameNumbers('guard', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });
  //   guard.setFixedRotation();
  //   guard.anims.load('guardRun');
  //   guard.setCollisionCategory(cat4);
  // //  guard.setCollidesWith([cat4,cat2]);
  // //  guard.setCollidesWith([cat4,cat3]);
  //   guard.anims.play('guardRun');
  //   guard.body.dying = false;
  //   guard.body.collideWorldBounds = true;
  //   guard.setOrigin(0.5).setScale(xScale, yScale);
  //   guard.body.label = 'guard';
  }
}

function updateStats() {
  levelText.setText('LIVES: ' + level);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function fryPlayer() {
  if (GOD_MODE) return;
  player.dying = true;
  _scene.time.delayedCall(500, () => {
    player.dying = false;
    player.setPosition(xStart, yStart);
    player.tint = 0xffffff;
    lives--;
    killOTTO();
  });
}

function buildLevel() {
  _scene.matter.world.setBounds().disableGravity();
  levelData = objectData['level_' + level];
  player.tint = levelData[0].player_color;
  var wallCoords = levelData[0].walls;
    for (let index = 0; index < wallCoords.length; index+=4) {
    var x1 = wallCoords[index] * X_SCALE;
    var y1 = wallCoords[index+1] * Y_SCALE;
    var x2 = wallCoords[index+2] * X_SCALE;
    var y2 = wallCoords[index+3] * Y_SCALE;
    if(y1==y2){
      y2+=WALL_WIDTH;
     //if(x1>0) 
     //   x1+=X_SCALE;
        // if(x2>0) 
        // x2+=X_SCALE;
    }
    else{
      x2+=WALL_WIDTH;
      // if(y1>0) 
      //   y1+=Y_SCALE;
      // y2+=Y_SCALE;
    }
      // if(x1>=0)
    //   x1-=WALL_WIDTH;
    // if(x2>0)
    //     x2-=WALL_WIDTH;
    //var wall = new Phaser.Geom.Rectangle('create', x1, y1, x2-x1, y2-y1,0x0000ff,1);
    //_scene.matter.add.rectangle(wall);
    let wall = _scene.add.rectangle(x1, y1, x2-x1, y2-y1,WALL_COLOR,1);
    _scene.matter.add.gameObject(wall);
    
     wall.body.label = 'wall';
    wall.setCollisionCategory(cat3);
    walls.add(wall);
  }
}

function getRootBody(body) {
  if (body.parent === body) {
    return body;
  }
  while (body.parent !== body) {
    body = body.parent;
  }
  return body;
}

function moveEnemies() {
  for (let index = 0; index < guards.length; index++) {
    var guard = guards[index];
    if (guard.active) {
      var guardXMove = 0;
      var guardYMove = 0;
      if (guard.body.dying) {
        guard.anims.pause(guard.anims.currentAnim.frames[8]);
        guard.setFrame(8);
        return;
      }
      if (player.y < guard.y)
        guardYMove = -1;
      else if (player.y > guard.y)
        guardYMove = 1;
      if (player.x < guard.x) {
        guard.flipX = false;
        guardXMove = -1;
      } else if (player.x > guard.x) {
        guard.flipX = true;
        guardXMove = 1;
      }
      guard.x += guardXMove;
      guard.y += guardYMove;
//      if (guardXMove != 0 || guardYMove != 0)
//      else
//        guard.anims.pause(guard.anims.currentAnim.frames[0]);
      let shoot = Phaser.Math.Between(1, 200);
      if (shoot == 200) {
        guardShoot(guard)
      }
      guard.setDepth(100);
    }
  }
}

function resetOTTOTimer(){
  OTTOTimer = (12-level) * OTTO_TIMER_LENGTH;
}

function spawnOTTO(){
  OTTO = _scene.matter.add.sprite(xStart, 500, 'OTTO');
  OTTO.setOrigin(0.5);
  OTTO.body.label = 'OTTO';
  OTTO.setCollisionCategory(cat5);
  OTTO.setCollidesWith([cat5,cat1]);
  OTTO.setCollidesWith([cat5,cat4]);
  OTTO.setFixedRotation();
  OTTO.setPosition(OTTOXStart, OTTOYStart);
  OTTOAlive = true;
}

function killOTTO(){
  if(OTTO!=undefined){
    OTTO.destroy();
    _scene.matter.world.remove(OTTO);
    OTTOAlive = false;
    resetOTTOTimer();
  }
}
function resetWalls(){
  level_9_top_wall.setPosition(width/2, 0);
  level_9_bOTTOm_wall.setPosition(width/2, 391);
  level_9_top_wall2.scaleY=1;
  level_9_bOTTOm_wall2.scaleY=1;
  level_9_bOTTOm_wall2.y=398;
  moveWall=0;
}

function moveOTTO() {
  if (player.x > OTTO.x || player.x < OTTO.x && OTTO.active)
    OTTO.setVelocityX(1);
  OTTO.setVelocityY(OTTOYV);
  OTTO.setDepth(1);
  if (OTTO.x > 885){
    killOTTO();
    return;
  }
  if (Math.abs(OTTOYPath - OTTO.y) < 20)
    OTTO.setFrame(1);
  else
    OTTO.setFrame(0);
  if (OTTO.y > OTTOYPath)
    OTTOYV = -5;
  OTTOYV += .1;

  if (player.y > OTTO.y)
    OTTOYPath += .1;
  if (player.y < OTTO.y)
    OTTOYPath -= .1;

}

function update() {
  if (!startGame){
    mainMenuUpdate();
    return;
  }
//   if (player.x > 885) {
//     // if (guardCount > 0){
//     //   player.setPosition(xStart, yStart).setVelocityX(0).setVelocityY(0);
//     //   killOTTO();
//      }
//     else {
// //       clearLevel(this);
//       player.setPosition(xStart, yStart);
//       level++;
//       buildLevel(level);
// //      guardCount = numGuards = level + 4;
// //      spawnEnemies(this);
// //      killOTTO();
//     }
// //  }
// if(level==9){
//   moveWall++;
//   if(moveWall>50)
// {
//   level_9_top_wall.y+=5;
//   level_9_top_wall2.scaleY+=2.5;
  
//   level_9_bOTTOm_wall.y-=5;
//   level_9_bOTTOm_wall2.y-=2.5;
//   level_9_bOTTOm_wall2.scaleY+=2.5;
//     moveWall=0;
// }
// }
//   if (player.dying) {
//     player.anims.pause(player.anims.currentAnim.frames[0]);
//     playerXSpeed = 0;
//     playerYSpeed = 0;
//     player.tint = Math.random() * 0xffffff;
//   }

//   if (OTTOTimer > 0){
//     OTTOTimer--;
//   }

//   if (OTTOTimer == 0 && !OTTOAlive) {
//       spawnOTTO();
//   }

//   if (OTTO!=undefined && OTTO.visible)
//     moveOTTO();

//    if(gameEnding || lives==0)
//     {
//       localStorage.setItem(localStorageName, highScore);
//       if (score > highScore)
//         highScore = score;
//       gameOverText.visible = true;
//       color.random(50);
//       gameOverText.tint = color.color;
//       gameOverText.setScale(3);
//       guards.forEach(guard => {
//         if (guard.gameObject != null){
//         guard.gameObject.destroy();
//       _scene.matter.world.remove(guard);
//         }
//       });
//       player.destroy();
//       _scene.matter.world.remove(player);
//       _scene.time.delayedCall(1000, () => {
//         gameOverText.visible = false;
//           gameOver = true;
//           clearLevel();
//           scoreboard.visible = false;
//           scoreText.visible = false;
//           livesText.visible = false;
//           levelText.visible = false;
//           for (let index = 0; index < arrows.length; index++) {
//             const arrow = arrows[index];
//             arrow.visible = false;
//           }
//           startGame = false;
//           gameEnding = false;
//           showMainMenu();
//         });
 
//   return;
// }

if(gameOver)
{
   return;
}

  if (playerXSpeed === 0 && playerYSpeed === 0)
  {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    if(player.shooting){
      player.anims.pause();
      getPlayerShootFrame();
    }
  }
  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
  updateStats();
//   moveEnemies(this);
}

function getPlayerShootFrame(){

if(bulletDirection.xv==0)
  player.setFrame(7);
else 
{
  switch (bulletDirection.yv) {
    case 0:
      player.setFrame(4);
      break;
    case -5:
      player.setFrame(5);
      break;
    case 5:
        player.setFrame(6);
        break;
    default:
      break;
  }
if(bulletDirection.xv<0)
  player.flipX = true;
}
}

function clearLevel() {
  return;
  polygons.children.each(object => {
    object.destroy();
    _scene.matter.world.remove(object);
   })
  levelBkgd.visible = false;
  if(level==9)
  {  
    level_9_top_wall.destroy();
    level_9_bOTTOm_wall.destroy();
    _scene.matter.world.remove(level_9_top_wall);
    _scene.matter.world.remove(level_9_bOTTOm_wall);
  }
}

function restart() {
  lives--;
  game.state.restart();
}


function render() {

}

function restartGame() {
  startGame = false;
  _scene.game.state.start(game.state.current);
}