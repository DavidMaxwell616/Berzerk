function mainMenuCreate(scene) {
  var width = scene.game.config.width; 
  var height = scene.game.config.height;
   splash = scene.add.image(0, 0, 'splash');
  splash.setDisplaySize(width, height);
  splash.setOrigin(0, 0);
  maxxdaddy = scene.add.image(width * 0.9, height * 0.87, 'maxxdaddy');
  title = scene.add.sprite(width/2, height*.25, 'title');
  title.setOrigin(.5).setScale(2);
  highScore = localStorage.getItem(localStorageName) == null ? 0 :
  localStorage.getItem(localStorageName);

  highScoreText = _scene.add.text(
    width * 0.05,
    height * 0.83,
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
 // console.log(pointer);
  scene.input.on('pointerdown', function(pointer){
    Start();
 });
  scene.input.keyboard.on('keydown_SPACE', Start);

  function Start(){
  if (startGame)
      return;
    splash.visible = false;
  title.visible = false;
  highScoreText.visible = false;
    startGame = true;
    gameCreate(scene);
}



}
function showMainMenu(){
  splash.visible = true;
  title.visible = true;
}
