const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');

// --- Responsive resizing: keep canvas square and scale grid ---

function getBestCanvasSize() {
  // Use 98% of device width, 60% of device height, max 600px, min 200px
  const w = Math.floor(window.innerWidth * 0.98);
  const h = Math.floor(window.innerHeight * 0.60);
  let size = Math.min(w, h, 600);
  if (size < 200) size = 200;
  return size;
}
function resizeCanvasAndGrid() {
  const size = getBestCanvasSize();
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
}
resizeCanvasAndGrid();
window.addEventListener('resize', () => {
  resizeCanvasAndGrid();
  // Optional: restart game on resize to ensure alignment
  initGame();
});

// --- Game Constants and State ---
const GRID_SIZE = 20; // 20x20 grid
function getBoxSize() {
  return canvas.width / GRID_SIZE;
}
let snake, direction, food, score, lastKeyDir, game;
let highScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')) : 0;

// --- Setup and Restart ---

function initGame() {
  const box = getBoxSize();
  snake = [
    { x: 9 * box, y: 10 * box },
    { x: 8 * box, y: 10 * box },
    { x: 7 * box, y: 10 * box }
  ];
  direction = 'RIGHT';
  lastKeyDir = 'RIGHT';
  score = 0;
  food = randomFood();
  gameOverMessage.textContent = '';
  restartBtn.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game) clearInterval(game);
  game = setInterval(gameLoop, 120);
}

function randomFood() {
  let box = getBoxSize();
  let position;
  do {
    const x = Math.floor(Math.random() * GRID_SIZE) * box;
    const y = Math.floor(Math.random() * GRID_SIZE) * box;
    position = { x, y };
  } while (snake && snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

// --- Drawing ---

function draw() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const box = getBoxSize();

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lime';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw score and high score
  ctx.fillStyle = 'black';
  ctx.font = Math.max(Math.floor(box), 16) + 'px Arial';
  ctx.textBaseline = 'top';
  ctx.fillText('Score: ' + score, 8, 4);
  ctx.fillText('High: ' + highScore, 8, Math.floor(box));
}

// --- Controls ---

function changeDirection(event) {
  if (!event) return;
  const key = event.keyCode;
  if (key === 37 && lastKeyDir !== 'RIGHT') { direction = 'LEFT'; lastKeyDir = 'LEFT'; }
  else if (key === 38 && lastKeyDir !== 'DOWN') { direction = 'UP'; lastKeyDir = 'UP'; }
  else if (key === 39 && lastKeyDir !== 'LEFT') { direction = 'RIGHT'; lastKeyDir = 'RIGHT'; }
  else if (key === 40 && lastKeyDir !== 'UP') { direction = 'DOWN'; lastKeyDir = 'DOWN'; }
}

function setDirection(newDir) {
  if (newDir === 'LEFT' && lastKeyDir !== 'RIGHT') { direction = 'LEFT'; lastKeyDir = 'LEFT'; }
  else if (newDir === 'UP' && lastKeyDir !== 'DOWN') { direction = 'UP'; lastKeyDir = 'UP'; }
  else if (newDir === 'RIGHT' && lastKeyDir !== 'LEFT') { direction = 'RIGHT'; lastKeyDir = 'RIGHT'; }
  else if (newDir === 'DOWN' && lastKeyDir !== 'UP') { direction = 'DOWN'; lastKeyDir = 'DOWN'; }
}

// Keyboard controls (desktop)
document.addEventListener('keydown', changeDirection);

// Mobile/touch controls
function addControlEvents(btnId, dir) {
  const btn = document.getElementById(btnId);
  btn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    setDirection(dir);
  }, {passive: false});
  btn.addEventListener('click', () => setDirection(dir));
}
addControlEvents('upBtn', 'UP');
addControlEvents('downBtn', 'DOWN');
addControlEvents('leftBtn', 'LEFT');
addControlEvents('rightBtn', 'RIGHT');

// --- Game Loop ---

function updateSnake() {
  const box = getBoxSize();
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'LEFT') head.x -= box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'DOWN') head.y += box;

  // Wrap around the grid (optional: remove these 4 lines to have classic wall collision)
  // if (head.x < 0) head.x = (GRID_SIZE - 1) * box;
  // if (head.x >= canvas.width) head.x = 0;
  // if (head.y < 0) head.y = (GRID_SIZE - 1) * box;
  // if (head.y >= canvas.height) head.y = 0;

  // Check for food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }
  snake.unshift(head);
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
  const box = getBoxSize();
  const head = snake[0];
  // Wall collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    return true;
  }
  // Self collision
  if (checkCollision(head, snake.slice(1))) {
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
    gameOverMessage.textContent = 'Game Over! Your score: ' + score + ' | High: ' + highScore;
    restartBtn.style.display = 'block';
    return;
  }
  updateSnake();
  draw();
}

// --- Restart Button ---
restartBtn.addEventListener('click', initGame);

// --- Start the Game ---
initGame();
