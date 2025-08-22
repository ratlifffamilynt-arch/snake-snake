const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');

// Responsive resizing: keep canvas square and scale grid
function resizeCanvas() {
  let min = Math.min(window.innerWidth, window.innerHeight, 400);
  canvas.width = min;
  canvas.height = min;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  draw();
});

function getBoxSize() {
  return canvas.width / 20;
}

let game;
let snake, direction, food, score;
let lastKeyDir = 'RIGHT';

// High score using localStorage
let highScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')) : 0;

function initGame() {
  snake = [
    { x: 9 * getBoxSize(), y: 10 * getBoxSize() }
  ];
  direction = 'RIGHT';
  lastKeyDir = 'RIGHT';
  food = randomFood();
  score = 0;
  gameOverMessage.textContent = '';
  restartBtn.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game) clearInterval(game);
  game = setInterval(gameLoop, 200);
}

function randomFood() {
  let box = getBoxSize();
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } while (snake && snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function draw() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let box = getBoxSize();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lime';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  ctx.fillStyle = 'black';
  ctx.font = Math.floor(box) + 'px Arial';
  ctx.fillText('Score: ' + score, 10, Math.floor(box));
  ctx.fillText('High Score: ' + highScore, 10, Math.floor(box) * 2);
}

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && lastKeyDir !== 'RIGHT') { direction = 'LEFT'; lastKeyDir = 'LEFT'; }
  else if (key === 38 && lastKeyDir !== 'DOWN') { direction = 'UP'; lastKeyDir = 'UP'; }
  else if (key === 39 && lastKeyDir !== 'LEFT') { direction = 'RIGHT'; lastKeyDir = 'RIGHT'; }
  else if (key === 40 && lastKeyDir !== 'UP') { direction = 'DOWN'; lastKeyDir = 'DOWN'; }
}

// Mobile/touch control helper
function setDirection(newDir) {
  if (newDir === 'LEFT' && lastKeyDir !== 'RIGHT') { direction = 'LEFT'; lastKeyDir = 'LEFT'; }
  else if (newDir === 'UP' && lastKeyDir !== 'DOWN') { direction = 'UP'; lastKeyDir = 'UP'; }
  else if (newDir === 'RIGHT' && lastKeyDir !== 'LEFT') { direction = 'RIGHT'; lastKeyDir = 'RIGHT'; }
  else if (newDir === 'DOWN' && lastKeyDir !== 'UP') { direction = 'DOWN'; lastKeyDir = 'DOWN'; }
}

function updateSnake() {
  let box = getBoxSize();
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function checkCollision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  let box = getBoxSize();
  if (
    snake[0].x < 0 || snake[0].x >= canvas.width ||
    snake[0].y < 0 || snake[0].y >= canvas.height
  ) {
    return true;
  }
  if (checkCollision(snake[0], snake.slice(1))) {
    return true;
  }
  return false;
}

function gameLoop() {
  if (gameOver()) {
    clearInterval(game);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
    }
    gameOverMessage.textContent = 'Game Over! Your score: ' + score + ' | High Score: ' + highScore;
    restartBtn.style.display = 'block';
    return;
  }
  updateSnake();
  draw();
}

// Keyboard controls (desktop)
document.addEventListener('keydown', changeDirection);

// Mobile/touch controls (instant response)
function addControlEvents(btnId, dir) {
  const btn = document.getElementById(btnId);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents possible double event or scrolling
    setDirection(dir);
  });
  btn.addEventListener('click', () => setDirection(dir));
}

addControlEvents('upBtn', 'UP');
addControlEvents('downBtn', 'DOWN');
addControlEvents('leftBtn', 'LEFT');
addControlEvents('rightBtn', 'RIGHT');

// Restart button
restartBtn.addEventListener('click', initGame);

initGame();
