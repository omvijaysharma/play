const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const flyButton = document.getElementById("flyButton");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("gameOverDiv");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
starCanvas.width = canvas.width; // Ensure starCanvas matches gameCanvas width
starCanvas.height = canvas.height; // Ensure starCanvas matches gameCanvas height

// Load the images
const playerImage = new Image();
playerImage.src = 'src/player.png';
const birdImage = new Image();
birdImage.src = 'src/bird.png';

// Load the jump and game over sound files
const jumpSound = new Audio('src/jump.mp3');
const gameOverSound = new Audio('src/gameover.wav');

let playerSize = 30;
let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height * 0.5,
    width: playerSize * 1.5,
    height: playerSize,
    dy: 1
};

let gravity = 0.5;
let score = 0;
let birds = [];
let gameInterval;
let gameRunning = false;
let birdSpeed = 3;

let starSpeed = 2; // Speed of stars, initially set to 2
let jumpPower = -10; // Jump power, initially set to -10
let starsMoving = true; // Flag to control star movement

const stars = [];
const starCount = 1000; // Number of stars

// Create stars
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    });
}

// Function to draw stars (to be called initially and in the game loop)
function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height); // Clear the star canvas

    for (let star of stars) {
        starCtx.fillStyle = "#ffffff"; // Color of the stars
        starCtx.fillRect(star.x, star.y, 1, 1); // Draw the star as a 1px square
        
        if (starsMoving) { // Only move stars if the game is running
            star.x -= starSpeed; // Move star left

            // Reset star position when it moves off screen
            if (star.x < 0) {
                star.x = starCanvas.width; // Reset star to the right edge
                star.y = Math.random() * starCanvas.height; // Randomize the y position
            }
        }
    }
}

// Draw stars immediately when the page loads
function initStars() {
    setInterval(drawStars, 30); // Continuously draw stars
}

flyButton.addEventListener("click", () => {
    if (gameRunning) {
        player.dy = jumpPower;
        const soundInstance = jumpSound.cloneNode();
        soundInstance.play();
        drawRocketJet(); // Show rocket jet when jumping
    }
});

function drawRocketJet() {
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x + player.width / 2 - 1.5, player.y + player.height, 3, 3); // Draw the jet flame
}

function spawnBird() {
    const size = playerSize;
    const yPosition = Math.random() * (canvas.height - size);
    birds.push({ x: canvas.width, y: yPosition, width: size * 1.5, height: size });
}

function updateScore() {
    score++;
    scoreDisplay.textContent = (score / 10).toFixed(1);
    // Every 100 score, increase difficulty
    if (score % 1000 === 0) {
        birdSpeed *= 1.1; // Increase bird speed by 10%
        starSpeed *= 1.1; // Increase star speed by 10%
        jumpPower *= 1.1; // Increase jump power by 10%
    }
}

function checkCollision(bird) {
    return (
        player.x < bird.x + bird.width &&
        player.x + player.width > bird.x &&
        player.y < bird.y + bird.height &&
        player.y + player.height > bird.y
    );
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the game canvas

    if (gameRunning) {
        player.dy += gravity; // Apply gravity
        player.y += player.dy; // Update player position

        // Check for ground and ceiling collision
        if (player.y >= canvas.height - player.height || player.y <= 0) {
            endGame();
            return;
        }
    }

    // Draw the player image
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    for (let i = birds.length - 1; i >= 0; i--) {
        const bird = birds[i];

        if (gameRunning) {
            bird.x -= birdSpeed; // Move bird left
        }

        if (checkCollision(bird)) {
            endGame();
            return;
        }

        // Draw the bird image
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    // Spawn a bird with a 50% probability at score multiples of 40
    if (score % 40 === 0 && score > 0 && Math.random() < 0.5) {
        setTimeout(spawnBird, 2000);
    }

    if (gameRunning) updateScore(); // Update score if game is running
}

function endGame() {
    clearInterval(gameInterval); // Stop the game loop
    gameRunning = false; // Set game status to false
    starsMoving = false; // Stop stars from moving
    gameOverDiv.style.display = "block"; // Show game over screen
    gameOverSound.play(); // Play game over sound
}

function resetGame() {
    player.y = canvas.height * 0.5; // Reset player position
    player.dy = 1.5; // Reset player vertical speed
    score = 0; // Reset score
    birds = []; // Clear birds
    gameRunning = true; // Set game status to true
    starsMoving = true; // Allow stars to move again
    scoreDisplay.textContent = "0"; // Reset score display
    gameOverDiv.style.display = "none"; // Hide game over screen
    birdSpeed = 3; // Reset bird speed
    starSpeed = 2; // Reset star speed
    jumpPower = -10; // Reset jump power

    startGame(); // Start a new game
}

function startGame() {
    gameRunning = true; // Set game status to true
    gameInterval = setInterval(gameLoop, 30); // Start the game loop
}

// Start the game only after images are fully loaded
let imagesLoaded = 0;
[playerImage, birdImage].forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            initStars(); // Start drawing stars immediately
            document.getElementById('startBtn').style.display = 'block'; // Ensure the start button is visible
        }
    };
});

// Function to start the game when the start button is clicked
function start() {
    document.getElementById('startBtn').style.display = 'none'; // Hide start button
    document.getElementById('gameCanvas').style.display = 'block'; // Show game canvas
    startGame(); // Start the game
}
