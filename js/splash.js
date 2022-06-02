function mainMenuCreate(scene) {
  var width = scene.game.config.width; 
  var height = scene.game.config.height;
  stars = _scene.add.group();
  for (var t = 1; t<200; t++) {
    var rx = Phaser.Math.Between(1, width);
    var ry = Phaser.Math.Between(1, HORIZON);
    var star = _scene.add.sprite(rx,ry,'star');
    stars.add(star);
  }
  title = scene.add.sprite(width/2, height/2+40, 'title');
  title.setOrigin(.5);
  maxxdaddy = scene.add.image(width * 0.9, height * 0.9, 'maxxdaddy');
  highScore = localStorage.getItem(localStorageName) == null ? 0 :
  localStorage.getItem(localStorageName);

  highScoreText = _scene.add.text(
    width * 0.02,
    height * 0.88,
    'HIGH SCORE: ' + highScore, {
      fontFamily: 'Arial',
      fontSize: '32px',
      fill: '#eee',
    },
  );

  const animConfig = {
    key: 'title',
    frames: 'title',
    frameRate: 20,
    repeat: -1
};

scene.anims.create(animConfig);
 var pointer = scene.input.activePointer;
  scene.input.on('pointerdown', function(pointer){
    Start();
 });
  scene.input.keyboard.on('keydown_SPACE', Start);

  function Start(){
  if (startGame)
      return;
//    splash.visible = false;
  title.visible = false;
  highScoreText.visible = false;
    startGame = true;
    stars.destroy(true);
    gameCreate(scene);
}
}

function mainMenuUpdate(){
  stars.getChildren().forEach((star) => {
    if(Phaser.Math.Between(1, 100)==1)
      star.setTint(Math.random() * 0xffffff);
  });
}


function showMainMenu(){
  splash.visible = true;
  title.visible = true;
}
