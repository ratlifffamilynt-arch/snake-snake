const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverMessage = document.getElementById('gameOverMessage');

const box = 20;
let snake = [
  { x: 9 * box, y: 10 * box }
];
let direction = 'RIGHT';
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let score = 0;

function draw() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? 'green' : 'lime';
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

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key == 37 && direction !== 'RIGHT') direction = 'LEFT';
  else if (key == 38 && direction !== 'DOWN') direction = 'UP';
  else if (key == 39 && direction !== 'LEFT') direction = 'RIGHT';
  else if (key == 40 && direction !== 'UP') direction = 'DOWN';
}

function updateSnake() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction == 'LEFT') headX -= box;
  if (direction == 'UP') headY -= box;
  if (direction == 'RIGHT') headX += box;
  if (direction == 'DOWN') headY += box;

  let newHead = { x: headX, y: headY };

  if (headX == food.x && headY == food.y) {
    score++;
    // Place new food
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function checkCollision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x == arr[i].x && head.y == arr[i].y) {
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
    return;
  }
  updateSnake();
  draw();
}

let game = setInterval(gameLoop, 100);
