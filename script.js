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
