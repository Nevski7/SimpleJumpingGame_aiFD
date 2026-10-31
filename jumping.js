
const character = document.getElementById("character");
const scoreElement = document.getElementById("score");
const game = document.getElementById("game");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("start-button");
const jumpButton = document.getElementById("jump-button");
const announcement = document.getElementById("announcement");
const GRAVITY = 1800;
const JUMP_SPEED = 640;
const OBSTACLE_SPEED = 260;
const CHARACTER_X = 52;
const CHARACTER_WIDTH = 36;
const CHARACTER_HEIGHT = 44;
let height = 0;
let velocity = 0;
let score = 0;
let state = "ready";
let obstacles = [];
let spawnTimer = 0;
let lastTime = null;
let animationId;

function jump() {
    if (state === "ready") startGame();
    if (state === "playing" && height === 0) velocity = JUMP_SPEED;
}

function generateObstacle() {
    const element = document.createElement("div");
    const obstacleHeight = 34 + Math.floor(Math.random() * 23);
    element.className = "obstacle";
    element.setAttribute("aria-hidden", "true");
    element.style.height = `${obstacleHeight}px`;
    game.appendChild(element);
    obstacles.push({ element, x: game.clientWidth, width: 24, height: obstacleHeight, passed: false });
}

function moveObstacle(delta) {
    for (const obstacle of obstacles) {
        obstacle.x -= OBSTACLE_SPEED * delta;
        obstacle.element.style.transform = `translateX(${obstacle.x}px)`;
    }
}

function checkCollision() {
    // Small insets make collisions match the visible shapes more naturally.
  
    );
}

// Ends the game and displays the final score.
function endGame() {

}

function startGame() {
    cancelAnimationFrame(animationId);
    obstacles.forEach(obstacle => obstacle.element.remove());
    obstacles = [];
    height = 0;
    velocity = 0;
    score = 0;
    scoreElement.textContent = "0";
    character.style.transform = "translateY(0)";
    spawnTimer = 1.2;
    lastTime = null;
    state = "playing";
    overlay.hidden = true;
    announcement.textContent = "Game started. Jump over the cacti.";
    animationId = requestAnimationFrame(update);
}

function update(time) {
    if (state !== "playing") return;
    // Cap elapsed time so returning to a background tab cannot cause a huge step.
    const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.033);
    lastTime = time;
    velocity -= GRAVITY * delta;
    height = Math.max(0, height + velocity * delta);
    if (height === 0 && velocity < 0) velocity = 0;
    character.style.transform = `translateY(${-height}px)`;
    spawnTimer -= delta;
    if (spawnTimer <= 0) {
        generateObstacle();
        spawnTimer = 1.4 + Math.random() * 0.5;
    }
    moveObstacle(delta);
    if (checkCollision()) {
        endGame();
        return;
    }
    for (const obstacle of obstacles) {
        if (!obstacle.passed && obstacle.x + obstacle.width < CHARACTER_X) {
            obstacle.passed = true;
            scoreElement.textContent = ++score;
        }
    }
    obstacles = obstacles.filter(obstacle => {
        if (obstacle.x + obstacle.width < 0) {
            obstacle.element.remove();
            return false;
        }
        return true;
    });
    animationId = requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
    if (event.target.closest("button, input, textarea, select, [contenteditable]")) return;
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (!event.repeat) jump();
    } else if (event.code === "KeyR" && !event.repeat) {
        startGame();
    }
});
startButton.addEventListener("click", () => {
    startGame();
    startButton.blur();
});
jumpButton.addEventListener("click", jump);
