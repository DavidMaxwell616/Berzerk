const WIDTH = 800;
const HEIGHT = 540;
const X_SCALE =160;
const Y_SCALE =160;
const WALL_WIDTH =10;
const HORIZON = HEIGHT/2;
let stars;
let player;
let cursors;
let levels;
let playIntro = true;
let score = 0;
let scoreText;
let highScoreText;
let lives = 3;
const OTTO_TIMER_LENGTH = 100;
let livesText;
const START_LEVEL = 1;
let level;
let levelText;
let title;
let startGame = false;
let splash;
let xStart = 40;
let yStart = 240;
let xScale = .9;
let yScale = .8;
let maxxdaddy;
let curScore = 0;
let textTimer;
let guards = [];
let OTTO;
var OTTOYV = -5;
var OTTOYVV = 0;
var OTTOXStart = 40;
var OTTOYStart = 200;
var OTTOYPath = OTTOYStart;
let OTTOTimer = 500;
let showintro = 1;
let gameOver = false;
const WALL_COLOR = 0x000674;
const GAME_FONT = 'Impact';
let levelBkgd;
let numGuards;
let runTime = 0;
let textTiles;
let levelOver = false;
let levelOverTimer = 0;
let emitter;
let cat = 5;
let walls;
let highScore = 0;
var localStorageName = "berzerk";
var OTTOAlive = false;
var entranceX = WALL_WIDTH/2;
var entranceY = HEIGHT/2-WALL_WIDTH*2;
let playerXSpeed = 0;
let playerYSpeed = 0;
const textFrames = {
  ')': 8,
  '(': 9,
  '=': 10,
  '-': 11,
  '?': 12,
  '!!': 13,
  '!': 14,
  Z: 15,
  Y: 16,
  X: 17,
  W: 18,
  V: 19,
  U: 20,
  T: 21,
  S: 22,
  R: 23,
  Q: 24,
  P: 25,
  O: 26,
  N: 27,
  M: 28,
  L: 29,
  K: 30,
  J: 31,
  I: 32,
  H: 33,
  G: 34,
  F: 35,
  E: 36,
  D: 37,
  C: 38,
  B: 39,
  A: 40,
  9: 41,
  8: 42,
  7: 43,
  6: 44,
  5: 45,
  4: 46,
  3: 47,
  2: 48,
  1: 49,
  0: 50,
};
var mouseDown;
var arrows =new Array(4);
var arrowStats = [
  {
    angle: 0,
  yOffset: 20,
  xOffset: 630,
  direction:'right',
  },
  {
    angle: 90,
  yOffset: 30,
  xOffset: -20,
  direction:'down',
  }  ,
  {
    angle: 180,
  yOffset: 20,
  xOffset: 550,
  direction:'left',
  }  ,
  {
    angle: 270,
  yOffset: -30,
  xOffset: -20,
  direction:'up',
  }  
  ];
  var arrowDown=false;
const color = new Phaser.Display.Color();
var gameoverText;
var gameEnding = false;
var gameOverCountdown=0;
var GOD_MODE = true;
var guardCount=0;