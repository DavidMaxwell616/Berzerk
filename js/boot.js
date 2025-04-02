const WIDTH = 800;
const HEIGHT = 540;
const SCOREBOARD_HEIGHT = 50;
const X_SCALE = 160;
const Y_SCALE = 160;
const WALL_WIDTH = 10;
const HORIZON = HEIGHT / 2;
const OTTO_TIMER_LENGTH = 50;
const START_LEVEL = 1;
const NUM_GUARD_OFFSET = 5;

let stars;
let player;
let cursors;
let levels;
let playIntro = true;
let score = 0;
let scoreText;
let highScoreText;
let lives = 3;
let bullets;
let livesText;
let level;
let levelText;
let title;
let objectData;
let startGame = false;
let xStart = 0;
let yStart = 0;
let xScale = .9;
let yScale = .8;
let maxxdaddy;
let curScore = 0;
let textTimer;
let guards;
let explodingGuards;
let playerEntrance;
let Exits = {
  'Left': 1,
  'Right': 2,
  'Top': 3,
  'Bottom': 4
};
let OTTO;
var OTTOYV = -5;
var OTTOXV = 1;
var OTTOYVV = 0;
let OTTOTimer = 500;
let showintro = 1;
let gameOver = false;
const WALL_COLOR = 0x363b9c;
const GAME_FONT = 'Impact';
let levelBkgd;
let numGuards;
let runTime = 0;
let textTiles;
let levelOver = false;
let levelOverTimer = 0;
let emitter;
let cat1;
let cat2;
let cat3;
let cat4;
let cat5;
let walls;
let highScore = 0;
var localStorageName = "berzerk";
var OTTOAlive = false;
var entranceX = WALL_WIDTH / 2;
var entranceY = HEIGHT / 2 - WALL_WIDTH * 2;
let playerXSpeed = 0;
let playerYSpeed = 0;
var guardAnimsCreated = false;
var mouseDown;
var arrows = new Array(4);
var arrowStats = [
  {
    angle: 0,
    yOffset: 20,
    xOffset: 630,
    direction: 'right',
  },
  {
    angle: 90,
    yOffset: 30,
    xOffset: -20,
    direction: 'down',
  },
  {
    angle: 180,
    yOffset: 20,
    xOffset: 550,
    direction: 'left',
  },
  {
    angle: 270,
    yOffset: -30,
    xOffset: -20,
    direction: 'up',
  }
];
var arrowDown = false;
const color = new Phaser.Display.Color();
var gameoverText;
var gameEnding = false;
var gameOverCountdown = 0;
var GOD_MODE = true;
var guardCount = 0;
var guardSpeed = .25;
var playSounds = false;