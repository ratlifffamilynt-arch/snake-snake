const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Size of each square in the grid
const box = 20;

// Snake: array of coordinates
let snake = [
  { x: 9 * box, y: 10 * box }
];

// Initial direction
let direction = 'RIGHT';

// Food position
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};

let score = 0;


function draw() {
  // Draw background
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? 'green' : 'lime';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw score
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
  // Get current head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  // Change head position based on direction
  if (direction == 'LEFT') headX -= box;
  if (direction == 'UP') headY -= box;
  if (direction == 'RIGHT') headX += box;
  if (direction == 'DOWN') headY += box;

  // New head
  let newHead = { x: headX, y: headY };

  // Collision with food
  if (headX == food.x && headY == food.y) {
    score++;
    // Place new food
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    // Remove tail
    snake.pop();
  }

  // Add new head to the front of the snake
  snake.unshift(newHead);
}
