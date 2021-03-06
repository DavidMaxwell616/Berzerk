function preload() {
  
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  showLoader(this);
  this.load.path = '../assets/images/';
  this.load.image('title', 'title.png');
  //this.load.image('arrow', 'arrow.png');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
  this.load.image('star', 'star.png');
  this.load.image('game over', 'game_over.png');
 
  this.load.spritesheet('player', 'player.png', {
    frameWidth: 26,
    frameHeight: 50
  }, );

  this.load.spritesheet('fry_player', 'player_dying.png', {
    frameWidth: 26,
    frameHeight: 50 
  }, );

  this.load.image('bullet', 'bullet.png');

  this.load.spritesheet('OTTO', 'otto.png', {
    frameWidth: 36,
    frameHeight: 36
  }, );

  this.load.spritesheet('guard', 'guard.png', {
    frameWidth: 36,
    frameHeight: 52
  }, );
 
  this.load.spritesheet('guard_explode', 'guard_explode.png', {
    frameWidth: 74,
    frameHeight: 74
  }, );

  this.load.path = '../assets/sounds/';
  this.load.audio('sound1', 'attack_the_humanoid.wav');
  this.load.audio('sound2', 'intruder_alert.wav');
  this.load.audio('sound3', 'the_humanoid_must_not_escape.wav');
  this.load.audio('sound4', 'the_humanoid_must_not_escape_deep_voice.wav');
  this.load.audio('sound5', 'laser_blast.wav');
 
  this.load.path = '../assets/json/';
  this.load.json('levelData', 'level_data.json');
}

function showLoader(game) {
  var progressBar = game.add.graphics();
  var progressBox = game.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  var x = width/2-160;
  progressBox.fillRect(x, height*.6-10, 50);
  game.load.on('progress', function (value) {});

  game.load.on('fileprogress', function (file) {});

  game.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
    percentText.destroy();
  });
  game.load.on('progress', function (value) {
    progressBar.clear();
    progressBar.fillStyle(0xff4500, 1);
    var x = width/2-140;
    progressBar.fillRect(x,height*.6-10, 300 * value, 30);
    percentText.setText(parseInt(value * 100) + '%');
  });

  var width = game.cameras.main.width;
  var height = game.cameras.main.height;
  var loadingText = game.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
      font: '20px monospace',
      fill: '#ffffff'
    }
  });
  loadingText.setOrigin(0.5);

  var percentText = game.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: '0%',
    style: {
      font: '18px monospace',
      fill: '#ffffff'
    }
  });
  percentText.setOrigin(0.5, 0.5);
}