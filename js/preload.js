function preload() {
  
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  showLoader(this);
  this.load.path = '../assets/images/';
  //this.load.image('splash', '125848.png');
  this.load.image('title', 'title.png');
  //this.load.image('arrow', 'arrow.png');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
  this.load.image('star', 'star.png');
 
  this.load.spritesheet('player', 'player.png', {
    frameWidth: 30,
    frameHeight: 54
  }, );

  // this.load.image('bullet', 'bullet.png');

  // this.load.spritesheet('otto', 'otto.png', {
  //   frameWidth: 86,
  //   frameHeight: 54
  // }, );

  // this.load.spritesheet('guard', 'guard.png', {
  //   frameWidth: 55,
  //   frameHeight: 46
  // }, );
 
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