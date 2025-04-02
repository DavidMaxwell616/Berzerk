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
      debug: false
      //   debug: {
      //     showBody: false,
      //     showStaticBody: false
      // }
    },
  },
};

var game = new Phaser.Game(config);
var _scene;
var game_width, game_height;

function create() {
  _scene = this;
  game_width = _scene.game.config.width;
  game_height = _scene.game.config.height;
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  score = 0;
  level = START_LEVEL;
  lives = 3;
  if (objectData == undefined) {
    objectData = _scene.cache.json.get('levelData');
    walls = _scene.add.group();
    bullets = _scene.add.group();
    player = _scene.matter.add.sprite(0, 0, 'player');
    player.setOrigin(0.5).setScale(.8);
    player.body.collideWorldBounds = true;
    player.body.label = 'player';
    player.dying = false;
    player.shooting = false;
    guards = _scene.add.group()
    highScore = localStorage.getItem(localStorageName) == null ? 0 :
      localStorage.getItem(localStorageName);

    _scene.matter.world.setBounds().disableGravity();

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
    player.setCollidesWith([cat2, cat3, cat4, cat5]);
    playerXSpeed = 0;
    playerYSpeed = 0;
    player.setDepth(1)
    maxxdaddy.visible = false;

    scoreText = _scene.add.text(
      game_width * 0.31,
      game_height - 30,
      'SCORE: 0', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
    );

    livesText = _scene.add.text(
      game_width * 0.47,
      game_height - 30,
      'LIVES: 3', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
    );

    levelText = _scene.add.text(
      game_width * 0.6,
      game_height - 30,
      'LEVEL: ' + level, {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
    );

    _scene.input.keyboard.on('keydown-LEFT', function (event) {
      if (player.dying) return;
      movePlayer(-1, 0);
      player.flipX = true;
    });

    _scene.input.keyboard.on('keydown-RIGHT', function (event) {
      if (player.dying) return;

      movePlayer(1, 0);
      player.flipX = false;
    });

    _scene.input.keyboard.on('keydown-UP', function (event) {
      if (player.dying) return;
      movePlayer(0, -1)
    });

    _scene.input.keyboard.on('keydown-DOWN', function (event) {
      if (player.dying) return;
      movePlayer(0, 1);
    });

    _scene.input.keyboard.on('keydown-SPACE', function (event) {
      Fire();
    }, _scene);

    _scene.input.keyboard.on('keyup-SPACE', function (event) {
      shooting = false;
    });

    function onObjectClicked(pointer, gameObject) {

      if (pointer.y > 400) {
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
    _scene.input.on('pointerdown', function (pointer) {
      if (pointer.y < 400)
        Fire();
    });
    _scene.input.on('gameobjectdown', onObjectClicked);
    _scene.matter.world.on('collisionstart', handleCollision);

    gameOverText = _scene.add.image(game_width / 2, game_height / 2, 'game over');
    gameOverText.visible = false;
    gameOverText.setDepth(1);
  }
  resetOTTOTimer();
  playerEntrance = Exits.Left;
  buildLevel();
  player.visible = true;
  scoreText.visible = true;
  livesText.visible = true;
  levelText.visible = true;
  playerXSpeed = 0;
  playerYSpeed = 0;
  guardCount = numGuards = level + 2;
  spawnEnemies();
}

function handleCollision(event) {
  for (var i = 0; i < event.pairs.length; i++) {
    var bodyA = getRootBody(event.pairs[i].bodyA);
    var bodyB = getRootBody(event.pairs[i].bodyB);
    //kill bullet when it hits a wall
    if (bodyA.label.includes('bullet') && bodyB.label == 'wall'
      || bodyB.label.includes('bullet') && bodyA.label == 'wall') {
      var bullet = bodyA.label.includes('bullet') ? bodyA : bodyB;
      if (bullet.gameObject != null) {
        bullet.gameObject.destroy();
        _scene.matter.world.remove(bullet);
      }
    }
    //bullet hits guard
    else if (bodyA.label == 'player_bullet' && bodyB.label == 'guard'
      ||
      bodyB.label == 'player_bullet' && bodyA.label == 'guard') {
      var guard = bodyA.label == 'guard' ? bodyA : bodyB;
      var bullet = bodyA.label == 'player_bullet' ? bodyA : bodyB;
      killGuard(guard);
      if (bullet.gameObject != null)
        bullet.gameObject.destroy();
      _scene.matter.world.remove(bullet);
    }
    else if (bodyA.label == 'guard_bullet' && bodyB.label == 'guard'
      ||
      bodyB.label == 'guard_bullet' && bodyA.label == 'guard') {
      var bullet = bodyA.label == 'guard_bullet' ? bodyA : bodyB;
      if (bullet.gameObject != null)
        bullet.gameObject.destroy();
      _scene.matter.world.remove(bullet);
    }
    //bullet hits exploding guard
    else if (bodyA.label == 'player_bullet' && bodyB.label == 'explodingGuard'
      ||
      bodyB.label == 'player_bullet' && bodyA.label == 'explodingGuard') {
      var guard = bodyA.label == 'explodingGuard' ? bodyA : bodyB;
      var bullet = bodyA.label == 'player_bullet' ? bodyA : bodyB;
      if (bullet.gameObject != null)
        bullet.gameObject.destroy();
      _scene.matter.world.remove(bullet);
    }
    //player hits wall
    else if ((bodyA.label == 'player' && bodyB.label == 'wall') ||
      (bodyB.label == 'player' && bodyA.label == 'wall')) {
      if (!GOD_MODE) fryPlayer();
    }
    //player hits guard
    else if (bodyA.label == 'player' && bodyB.label == 'guard' ||
      bodyB.label == 'player' && bodyA.label == 'guard') {
      var guard = bodyA.label == 'guard' ? bodyA : bodyB;
      if (!GOD_MODE) fryPlayer();
      killGuard(guard);
    }
    //guard bullet hits player      
    else if (bodyA.label == 'guard_bullet' && bodyB.label == 'player'
      || bodyB.label == 'guard_bullet' && bodyA.label == 'player') {
      var bullet = bodyA.label == 'guard_bullet' ? bodyA : bodyB;
      if (!GOD_MODE) fryPlayer();
      if (bullet.gameObject != null) {
        bullet.gameObject.destroy();
        _scene.matter.world.remove(bullet);
      }
    }
    else if (bodyA.label == 'OTTO' && bodyB.label == 'guard'
      || bodyB.label == 'OTTO' && bodyA.label == 'guard') {
      var guard = bodyA.label == 'guard' ? bodyA : bodyB;
      killGuard(guard);
    }
    else if (bodyA.label == 'OTTO' && bodyB.label == 'player'
      || bodyB.label == 'OTTO' && bodyA.label == 'player') {
      if (!GOD_MODE) fryPlayer();
    }
    else if (bodyA.label == 'player' && bodyB.label == 'wall') {
      if (!GOD_MODE) fryPlayer();
    }
    else if (bodyA.label.includes('bullet') && bodyB.label.includes('bullet')) {
      if (bodyA.gameObject != null) {
        bodyA.gameObject.destroy();
        _scene.matter.world.remove(bodyA);
      }
      if (bodyB.gameObject != null) {
        bodyB.gameObject.destroy();
        _scene.matter.world.remove(bodyB);
      }

    }

  }
}

function destroyWorld() {
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
function setUpArrows() {
  var y = game_height - 10;
  for (let index = 0; index < arrows.length; index++) {
    var arrow = arrowStats[index];
    arrows[index] = _scene.add.image(0, 0, 'arrow');
    arrows[index].setOrigin(0.5).setScale(.25);
    arrows[index].xOffset = arrow.xOffset;
    arrows[index].yOffSet = arrow.yOffset;
    arrows[index].x = 60 + arrows[index].game_width * .25 + 40 + arrow.xOffset;
    arrows[index].y = y - arrows[index].game_width * .25 + arrow.yOffset;
    arrows[index].name = arrow.direction;
    arrows[index].setInteractive();
    arrows[index].angle = arrow.angle;
  }
}
function killGuard(guard) {
  var explodingGuard = _scene.matter.add.sprite(guard.position.x, guard.position.y, 'guard_explode');
  explodingGuard.anims.play('guardExplode');
  explodingGuard.tint = levelData.enemy_color;
  explodingGuard.body.label = 'explodingGuard';
  if (guard.gameObject != null)
    guard.gameObject.destroy();
  _scene.matter.world.remove(guard);
  explodingGuard.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
    explodingGuard.destroy();
    _scene.matter.world.remove(explodingGuard);
    guardCount--;
    score += 50 * level;
  });
}

function removeGuard(guard) {
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

function Fire() {
  if (player.dying) return;
  bulletDirection = {
    xv: playerXSpeed * 5,
    yv: playerYSpeed * 5
  };
  player.anims.pause(player.anims.currentAnim.frames[0]);
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'player_bullet';
  if (bulletDirection.xv != 0 || bulletDirection.yv != 0)
    shootBullet(bullet, bulletDirection);
  playerXSpeed = 0;
  playerYSpeed = 0;
  player.shooting = true;
}

function movePlayer(xv, yv) {
  player.shooting = false;
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
  setBulletAngle(bullet, direction);
  bullets.add(bullet);

}

function setBulletAngle(bullet, direction) {
  var angle = Math.abs(direction.xv + direction.yv);
  if (angle == 10)
    bullet.angle = 45;
  else if (angle == 0)
    bullet.angle = 135;
  else
    bullet.angle = Math.abs(direction.yv) * 18;
}

function guardShoot(guard) {
  var bulletDirection = Math.atan((player.x - guard.x) / (player.y - guard.y));
  //some light randomness to the bullet angle
  bulletDirection += ((Math.random() / 10) + (-(Math.random() / 10)));
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'guard_bullet';
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

  if (player.y > guard.y + (guard.height / 2) && player.y < guard.y - (guard.height / 2)) {
    yOffset = 0;
  }

  else if (player.y >= guard.y + (guard.height / 2)) {
    yOffset = guard.height / 2;
  } else if (player.y <= guard.y - (guard.height / 2)) {
    yBulletSpeed = -yBulletSpeed;
    yOffset = -guard.height / 2;
  }

  bullet.setVelocityX(xBulletSpeed * Math.sin(Math.abs(bulletDirection)));
  bullet.setVelocityY(yBulletSpeed * Math.cos(Math.abs(bulletDirection)));
  // offsetY = direction.yv * 4;
  // offsetX = direction.xv * 2;
  bullet.setPosition(guard.x + xOffset, guard.y + yOffset);
  let angle = Phaser.Math.Angle.Between(player.x, player.y, guard.x, guard.y);
  bullet.rotation = angle;
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat2);
  bullets.add(bullet);
}

function spawnEnemies() {
  for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(WALL_WIDTH, game_width - WALL_WIDTH);
    let y = Phaser.Math.Between(WALL_WIDTH, game_height - SCOREBOARD_HEIGHT - WALL_WIDTH);
    var distance = Phaser.Math.Distance.Between(xStart, yStart, x, y);
    if (distance > 100) {
      var guard = _scene.matter.add.sprite(x, y, 'guard');
      if (!guardAnimsCreated) {
        _scene.anims.create({
          key: 'guardRun',
          frames: _scene.anims.generateFrameNumbers('guard', {
            start: 0,
            end: 5
          }),
          frameRate: 10,
          repeat: -1
        });
        _scene.anims.create({
          key: 'guardExplode',
          frames: _scene.anims.generateFrameNumbers('guard_explode', {
            start: 0,
            end: 3
          }),
          frameRate: 10,
          repeat: 0
        });
        guardAnimsCreated = true;
      }
      guard.setFixedRotation();
      guard.setCollisionCategory(cat4);
      guard.anims.play('guardRun');
      guard.body.collideWorldBounds = true;
      guard.setOrigin(0.5).setScale(xScale, yScale);
      guard.body.label = 'guard';
      guard.tint = levelData.enemy_color;
      guards.add(guard);
    }
  }
}

function killBullet(bullet) {
  bullet.visible = false;
  bullet.body.destroy();
  _scene.matter.world.remove(bullet);
}

function updateStats() {
  levelText.setText('LEVEL: ' + level);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function fryPlayer() {
  _scene.anims.create({
    key: 'fry_Player',
    frames: _scene.anims.generateFrameNumbers('fry_player', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: 0
  });
  player.visible = false;
  var dyingPlayer = _scene.matter.add.sprite(player.x, player.y, 'fry_player');
  dyingPlayer.anims.play('fry_Player');

  _scene.time.delayedCall(500, () => {
    player.visible = true;
    dyingPlayer.destroy();
    _scene.matter.world.remove(dyingPlayer);
    player.setPosition(xStart, yStart);
    lives--;
    killOTTO();
  });
}

function buildLevel() {
  levelData = objectData['level_' + level][0];
  player.tint = levelData.player_color;
  var wallCoords = levelData.walls;
  for (let index = 0; index < wallCoords.length; index += 4) {
    var x1 = wallCoords[index] * X_SCALE;
    var y1 = wallCoords[index + 1] * Y_SCALE;
    var x2 = wallCoords[index + 2] * X_SCALE;
    var y2 = wallCoords[index + 3] * Y_SCALE;
    if (y1 == y2)
      y2 += WALL_WIDTH;
    else
      x2 += WALL_WIDTH;
    var width = x2 - x1;
    var height = y2 - y1;
    var x = x1 + width / 2;
    var y = y1 + height / 2;
    if (x > game_width)
      x -= WALL_WIDTH;
    let wall = _scene.add.rectangle(x, y, width, height, WALL_COLOR, 1);
    _scene.matter.add.gameObject(wall);
    wall.body.isStatic = true;
    wall.body.label = 'wall';
    wall.setCollisionCategory(cat3);
    walls.add(wall);
  }
  var x, y, w, h;
  switch (playerEntrance) {
    case Exits.Right:
      x = game_width - WALL_WIDTH / 2;
      y = 246;
      w = WALL_WIDTH;
      h = 150;
      break;
    case Exits.Bottom:
      x = game_width / 2 - WALL_WIDTH / 2;
      y = game_height - SCOREBOARD_HEIGHT - WALL_WIDTH / 2;
      w = 170;
      h = WALL_WIDTH;
      break;
    case Exits.Left:
      x = WALL_WIDTH / 2;
      y = 246;
      w = WALL_WIDTH;
      h = 150;
      break;
    case Exits.Top:
      x = game_width / 2 - WALL_WIDTH / 2;
      y = WALL_WIDTH / 2;
      w = 170;
      h = WALL_WIDTH;
      break;
    default:
      break;
  }

  var wallX = 0;
  var wallY = game_height / 2 - SCOREBOARD_HEIGHT;
  let wall = _scene.add.rectangle(x, y, w, h, levelData.enemy_color, 1);
  _scene.matter.add.gameObject(wall);
  wall.body.isStatic = true;
  wall.body.label = 'wall';
  wall.setCollisionCategory(cat3);
  walls.add(wall);

  switch (playerEntrance) {
    case Exits.Right:
      xStart = game_width - 50;
      yStart = 240;
      break;
    case Exits.Bottom:
      xStart = game_width / 2;
      yStart = game_height - SCOREBOARD_HEIGHT - 40;
      break;
    case Exits.Left:
      xStart = 50;
      yStart = 240;
      break;
    case Exits.Top:
      xStart = game_width / 2;
      yStart = 50;
      break;
    default:
      break;
  }
  player.x = xStart;
  player.y = yStart;
  resetOTTOTimer();
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
  guards.children.entries.forEach(guard => {
    if (guard.active) {
      var guardXMove = 0;
      var guardYMove = 0;
      if (player.y < guard.y)
        guardYMove = -guardSpeed;
      else if (player.y > guard.y)
        guardYMove = guardSpeed;
      if (player.x < guard.x) {
        guard.flipX = false;
        guardXMove = -guardSpeed;
      } else if (player.x > guard.x) {
        guard.flipX = true;
        guardXMove = guardSpeed;
      }
      guard.x += guardXMove;
      guard.y += guardYMove;
      //      if (guardXMove != 0 || guardYMove != 0)
      //      else
      //        guard.anims.pause(guard.anims.currentAnim.frames[0]);
      let shoot = Phaser.Math.Between(1, 1200);
      if (shoot == 200) {
        guardShoot(guard)
      }
      guard.setDepth(100);
    }
  });
}

const resetOTTOTimer = () => OTTOTimer = (12 - level) * OTTO_TIMER_LENGTH;

function spawnOTTO() {
  OTTO = _scene.matter.add.sprite(xStart, yStart, 'OTTO');
  OTTO.setOrigin(0.5);
  OTTO.body.label = 'OTTO';
  OTTO.setCollisionCategory(cat5);
  OTTO.setCollidesWith([cat1, cat4]);
  OTTO.setFixedRotation();
  OTTO.tint = levelData.enemy_color;
  OTTOAlive = true;
  OTTOYPath = yStart;
  var rnd = Phaser.Math.Between(1, 5);
  if (playSounds) _scene.sound.play('sound' + rnd);
}

function killOTTO() {
  if (OTTO != undefined) {
    OTTO.destroy();
    _scene.matter.world.remove(OTTO);
    OTTOAlive = false;
    resetOTTOTimer();
  }
}

function moveOTTO() {
  OTTO.setDepth(1);

  if (Math.abs(OTTOYPath - OTTO.y) < 12) {
    OTTO.setFrame(6);
  }
  else
    OTTO.setFrame(7);

  if (OTTO.y > OTTOYPath)
    OTTOYV = -5;
  OTTOYV += .1;

  if (player.y > OTTO.y)
    OTTOYPath += .5;
  else if (player.y < OTTO.y)
    OTTOYPath -= .5;
  if (player.x > OTTO.x)
    OTTOXV = .8;
  if (player.x < OTTO.x)
    OTTOXV = -.8;

  OTTO.setVelocityX(OTTOXV);
  OTTO.setVelocityY(OTTOYV);

}

function update() {
  if (!startGame || gameOver) {
    mainMenuUpdate();
    return;
  }

  if (!gameEnding) {
    if (playerOutOfBounds()) {
      clearLevel(this);
      player.setPosition(xStart, yStart);
      level++;
      buildLevel(level);
      guardCount = numGuards = level + NUM_GUARD_OFFSET;
      spawnEnemies(this);
      killOTTO();
    }
    bullets.children.entries.forEach(bullet => {
      if (bullet.x < WALL_WIDTH || bullet.x > game_width - WALL_WIDTH || bullet.y < WALL_WIDTH || bullet.y > game_height - SCOREBOARD_HEIGHT - WALL_WIDTH) {
        killBullet(bullet);
      }
    });
    if (OTTOTimer > 0) {
      OTTOTimer--;
    }

    if (OTTOTimer == 0 && !OTTOAlive) {
      spawnOTTO();
    }

    if (OTTO != undefined && OTTO.visible)
      moveOTTO();
  }
  if (gameEnding || lives == 0) {
    gameOverText.setDepth(1);
    localStorage.setItem(localStorageName, highScore);
    if (score > highScore)
      highScore = score;
    gameOverText.visible = true;
    color.random(50);
    gameOverText.tint = color.color;
    gameOverText.setScale(3);
    gameEnding = true;
    clearLevel();
    player.visible = false;
    _scene.time.delayedCall(1000, () => {
      gameOverText.visible = false;
      gameOver = true;
      scoreText.visible = false;
      livesText.visible = false;
      levelText.visible = false;
      for (let index = 0; index < arrows.length; index++) {
        const arrow = arrows[index];
        arrow.visible = false;
      }
      startGame = false;
      gameEnding = false;
      if (!title.visible)
        showMainMenu();
    });

    return;
  }


  if (playerXSpeed === 0 && playerYSpeed === 0) {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    if (player.shooting) {
      player.anims.pause();
      getPlayerShootFrame();
    }
  }
  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
  updateStats();
  moveEnemies(this);
}

function getPlayerShootFrame() {

  if (bulletDirection.xv == 0)
    player.setFrame(7);
  else {
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
    if (bulletDirection.xv < 0)
      player.flipX = true;
  }
}

function playerOutOfBounds() {
  if (player.x > game_width) {
    playerEntrance = Exits.Left;
    return true;
  }
  else if (player.x < 0) {
    playerEntrance = Exits.Right;
    return true;
  }
  else if (player.y > game_height - SCOREBOARD_HEIGHT) {
    playerEntrance = Exits.Top;
    return true;
  }
  else if (player.y < 0) {
    playerEntrance = Exits.Bottom;
    return true;
  }
  return false;
}

function clearLevel() {
  walls.children.each(wall => {
    wall.destroy();
    _scene.matter.world.remove(wall);
  })
  guards.children.each(guard => {
    guard.destroy();
    _scene.matter.world.remove(guard);
  });
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