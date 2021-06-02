/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.getElementById("canvas").appendChild(canvas);

let bg = {};

/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.
 * hero.y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * The same goes for the monsters
 *
 */

let hero = { x: canvas.width / 2, y: canvas.height / 2 };
let monsters = [
  { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
  { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
  { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
];

let monstersCaught = 0;

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

window.addEventListener("keydown", pauseGame);

function loadImages() {
  bg.image = new Image();

  bg.image.onload = function () {
    // show the background image
    bg.ready = true;
  };
  bg.image.src = "images/background.png";
  hero.image = new Image();
  hero.image.onload = function () {
    // show the hero image
    hero.ready = true;
  };
  hero.image.src = "images/hero.png";

  monsters.forEach((monster, i) => {
    monster.image = new Image();
    monster.image.onload = function () {
      // show the monster image
      monster.ready = true;
    };
    monster.image.src = `images/monster_${i + 1}.png`;
  });
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  gameOver();

  if (keysPressed["ArrowUp"]) {
    hero.y -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    hero.y += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    hero.x -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    hero.x += 5;
  }
  if (hero.x > canvas.width) {
    hero.x = 0;
  }
  if (hero.x + 32 < 1) {
    hero.x = canvas.width;
  }

  if (hero.y > canvas.height) {
    hero.y = 0;
  }
  if (hero.y + 32 < 1) {
    hero.y = canvas.height;
  }

  monsters.forEach((monster) => {
    //  monster.x += 5 * Math.random() - 2.5;
    //  monster.y += 5 * Math.random() - 2.5;
    if (monster.x > canvas.width) {
      monster.x = 0;
    }
    if (monster.y > canvas.height) {
      monster.y = 0;
    }
    if (monster.x + 32 < 1) {
      monster.x = canvas.width;
    }
    if (monster.y + 32 < 1) {
      monster.y = canvas.height;
    }
  });
  let highScore;
  // Check if player and monster collided. Our images
  // are 32 pixels big.
  monsters.forEach((monster) => {
    if (
      hero.x <= monster.x + 32 &&
      monster.x <= hero.x + 32 &&
      hero.y <= monster.y + 32 &&
      monster.y <= hero.y + 32
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      monster.x = Math.random() * canvas.width;
      monster.y = Math.random() * canvas.height;
      monstersCaught++;
      getHighScore();
    }
  });
};

let score = window.localStorage.getItem("highScore");
let currentdate = new Date();
let datetime = `Last Sync: ${currentdate.getDate()}/${
  currentdate.getMonth() + 1
}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;

let highScoreObj = {
  name,
  score,
  date: datetime,
};

let arr = [];
let history =  window.localStorage.getItem('history')

function drawHistory() {
    let list = document.getElementById("list")
    let item = document.createElement('p')
    item.innerText = history;
    list.appendChild(item)
}

function newHigh(s) {
  const form = document.getElementById("canvas");
  const newHigh = document.createElement("h1");
  newHigh.innerText = `NEW HIGH SCORE! ${s}`;
  form.appendChild(newHigh);
}

function setHigh() {
    let { name, score, ...rest } = highScoreObj;
    name = window.localStorage.getItem("name");
    score = window.localStorage.getItem("highScore");
    const newhsObj = { name, score, ...rest };
    arr.unshift(newhsObj);
    window.localStorage.setItem('history', JSON.stringify(arr))
    // let get = JSON.parse(window.localStorage.getItem('history'))
}

function getHighScore() {
  let highScore = window.localStorage.getItem("highScore");
  if (highScore == null || highScore < monstersCaught) {
    window.localStorage.setItem("highScore", monstersCaught);
  }
  setHigh();
}

function drawHighScore() {
  ctx.font = "15px Langar, cursive";
  ctx.fillStyle = "#FF9900";
  ctx.fillText(
    `Current high score: ${window.localStorage.getItem("highScore")}`,
    20,
    60
  );
}

function drawMonstersCaught() {
  ctx.font = "15px Langar, cursive";
  ctx.fillStyle = "#FF9900";
  ctx.fillText(`You have caught ${monstersCaught} monsters`, 20, 80);
}

function drawTime() {
  ctx.font = "Bold 20px Langar, cursive";
  ctx.fillStyle = "black";
  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    canvas.width / 2 + 20,
    40
  );
}

//Adds keyup and click event listeners for submitName function
function nameEvents() {
  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
    submitName();
  });

  document.getElementById("inputText").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      submitName();
    }
  });
  drawName();
}

//Creates onkeyup Enter Event
function submitName() {
  let text = document.getElementById("inputText").value;
  window.localStorage.setItem("name", text);
  document.location.reload();
}

//Finally draws name ontoCanvas
function drawName() {
  ctx.font = "Bold 20px Langar, cursive";
  ctx.fillStyle = "black";
  ctx.fillText(window.localStorage.getItem("name"), 20, 40);
}

/**
 * This function, render, runs as often as possible.
 */
function render() {
  if (bg.ready) {
    ctx.drawImage(bg.image, 0, 0);
  }
  if (hero.ready) {
    ctx.drawImage(hero.image, hero.x, hero.y);
  }
  monsters.forEach((monster) => {
    if (monster.ready) {
      ctx.drawImage(monster.image, monster.x, monster.y);
    }
  });
  drawHighScore();
  drawMonstersCaught();
  if (elapsedTime < SECONDS_PER_ROUND) {
    drawTime();
  } else {
    gameOver();
  }
  nameEvents();
  reset();
}

function reset() {
  if (elapsedTime >= SECONDS_PER_ROUND) {
    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "reset");
    resetButton.innerText = "reset";
    document.getElementById("inputForm").appendChild(resetButton);
    resetButton.addEventListener("click", function (e) {
      document.location.reload();
    });
  }
}

function gameOver() {
  if (elapsedTime >= SECONDS_PER_ROUND) {
    ctx.font = "Bold 20px Langar, cursive";
    ctx.fillStyle = "black";
    ctx.fillText("Seconds Remaining: TIMES UP!", canvas.width / 3 + 50, 40);
  }
}

let paused = false;
function togglePause() {
  if (!paused) {
    paused = true;
  } else if (paused) {
    paused = false;
  }
}

function pauseGame(event) {
  if (event.key === " ") {
    togglePause();
  }
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  if (!paused && elapsedTime < SECONDS_PER_ROUND && !document.hidden) {
    update();
    render();
  }
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  window.requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
drawHistory();
