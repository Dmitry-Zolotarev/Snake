const canvas = document.getElementById('game');
const startButton = document.getElementById('startButton');
const screen = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 3, y: 3 }];
let apple = { x: 5, y: 5 };
let mushroom = { x: 8, y: 8 };
let dx = 0, dy = 0;
let score = 0;
let started = false;

// Загрузка изображений
const headImg = new Image();
headImg.src = 'img/head.png';

const bodyImg = new Image();
bodyImg.src = 'img/body.png';

const appleImg = new Image();
appleImg.src = 'img/apple.png';

const mushroomImg = new Image();
mushroomImg.src = 'img/mushroom.png'; // ← Исправлено!

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function gameLoop() {
    if (!started) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Столкновение со стеной
    if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
        resetGame();
        return;
    }

    // Столкновение с хвостом
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        updateArea(); // ← Исправлено имя
    } else if (head.x === mushroom.x && head.y === mushroom.y) {
        resetGame();
        return;
    } else {
        snake.pop();
    }

    draw();
}

function updateArea() {
    apple.x = randomInt(tileCount - 1);
    apple.y = randomInt(tileCount);
    mushroom.x = randomInt(tileCount - 1);
    mushroom.y = randomInt(tileCount);
}

function resetGame() {
    snake = [{ x: randomInt(10), y: randomInt(10) }]; // ← Исправлено
    dx = dy = 0;
    score = 0;
    started = false;
    startButton.style.display = 'inline-block';
    screen.fillStyle = '#000';
    screen.fillRect(0, 0, canvas.width, canvas.height);
    alert("Game Over!");
}

function draw() {
    screen.fillStyle = '#111';
    screen.fillRect(0, 0, canvas.width, canvas.height);

    screen.drawImage(appleImg, apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
    screen.drawImage(mushroomImg, mushroom.x * gridSize, mushroom.y * gridSize, gridSize, gridSize);

    for (let i = 0; i < snake.length; i++) {
        const img = i === 0 ? headImg : bodyImg;
        screen.drawImage(img, snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
    screen.fillStyle = '#0f0';
    screen.font = '16px Arial';
    screen.fillText(score, canvas.width - 25, 20);
}

function startGame() {
    startButton.style.display = 'none';
    started = true;
    dx = 1; dy = 0;
    updateArea();
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

setInterval(gameLoop, 100);
