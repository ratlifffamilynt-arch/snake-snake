const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');

const box = 20;
let game;
let snake, direction, food, score;
let lastKeyDir = 'RIGHT'; // To prevent reversing

function initGame() {
  snake = [
    { x: 9 * box, y: 10 * box }
  ];
  direction = 'RIGHT';
  lastKeyDir = 'RIGHT';
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  score = 0;
  gameOverMessage.textContent = '';
  restartBtn.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game) clearInterval(game);
  game = setInterval(gameLoop, 500);
  canvas.focus();
}

function draw() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lime';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && lastKeyDir !== 'RIGHT') { direction = 'LEFT'; lastKeyDir = 'LEFT'; }
  else if (key === 38 && lastKeyDir !== 'DOWN') { direction = 'UP'; lastKeyDir = 'UP'; }
  else if (key === 39 && lastKeyDir !== 'LEFT') { direction = 'RIGHT'; lastKeyDir = 'RIGHT'; }
  else if (key === 40 && lastKeyDir !== 'UP') { direction = 'DOWN'; lastKeyDir = 'DOWN'; }
}

function updateSnake() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    // Place new food, avoid placing on the snake
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
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
    gameOverMessage.textContent = 'Game Over! Your score: ' + score;
    restartBtn.style.display = 'block';
    return;
  }
  updateSnake();
  draw();
}

// Only add the event listener once!
document.removeEventListener('keydown', changeDirection); // Remove if already exists (safe)
document.addEventListener('keydown', changeDirection);

restartBtn.addEventListener('click', initGame);

initGame();
