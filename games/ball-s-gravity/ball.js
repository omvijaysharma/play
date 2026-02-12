const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

     // ball
     
const ballRadius = 20;
let ballY = canvas.height / 2;
let ballX = canvas.width / 8;
let gravity = 0.5;
let velocity = 0;
let isGravityReversed = false;

// Load the ball image
const ballImage = new Image();
ballImage.src = 'sources/ball.png'; // ball png

let angle = 0; // Rotation angle in radians

function drawBall() {
if (ballImage.complete) {
// Save the current canvas state
ctx.save();

// Move the canvas origin to the ball's center
ctx.translate(ballX, ballY);

// Rotate the canvas context by the angle
ctx.rotate(angle);

// Draw the ball image, adjusted for the ball's center
ctx.drawImage(ballImage, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);

// Restore the canvas state
ctx.restore();

// Update the angle for the next frame (for continuous rotation)
angle += 0.1; // Adjust the rotation speed here
}
}

function updateBall() {
velocity += isGravityReversed ? -gravity : gravity;
ballY += velocity;

if (ballY + ballRadius > canvas.height - roadHeight) {
ballY = canvas.height - roadHeight - ballRadius;
velocity = 0;
} else if (ballY - ballRadius < roadHeight) {
ballY = roadHeight + ballRadius;
velocity = 0;
}

collectStars();
checkWallCollision(); // Check for collision with walls
}
     // road
     
const roadHeight = 20;
let roadOffset = 0;
let roadSpeed = 2; // Changed to let so we can modify it
const dashWidth = 100;
const gapWidth = 20;

function drawRoads() {
ctx.fillStyle = '#555';
    
// Draw top road with dashes
ctx.fillRect(0, 0, canvas.width, roadHeight);
ctx.setLineDash([dashWidth, gapWidth]);
ctx.lineDashOffset = roadOffset;
ctx.strokeStyle = '#777';
ctx.lineWidth = roadHeight;
ctx.beginPath();
ctx.moveTo(0, roadHeight / 2);
ctx.lineTo(canvas.width, roadHeight / 2);
ctx.stroke();
    
// Draw bottom road with dashes
ctx.fillRect(0, canvas.height - roadHeight, canvas.width, roadHeight);
ctx.beginPath();
ctx.moveTo(0, canvas.height - roadHeight / 2);
ctx.lineTo(canvas.width, canvas.height - roadHeight / 2);
ctx.stroke();
    
// Update road offset to create moving effect from left to right
roadOffset += roadSpeed;
if (roadOffset >= dashWidth + gapWidth) {
roadOffset = 0;
}
}
      // stars
      
const starRadius = 10;
const stars = []; // Array to hold star positions
const numStars = 2; // Number of stars

// Load the saved score from localStorage if it exists
let savedScore = localStorage.getItem('ballScore');
let score = savedScore ? parseInt(savedScore, 10) : 0;

// Generate initial stars
function generateStars() {
for (let i = 0; i < numStars; i++) {
const starX = Math.random() * canvas.width;
const starY = Math.random() * (canvas.height - 2 * roadHeight - 100) + roadHeight; // Adjust for road height
stars.push({
x: starX,
y: starY
});
}
}
function drawStars() {
// Ensure the star image is loaded before drawing
if (starImage.complete) {
stars.forEach(star => {
ctx.drawImage(starImage, star.x - starRadius, star.y - starRadius, starRadius * 2, starRadius * 2);
});
}
}
function updateStars() {
stars.forEach(star => {
star.x -= roadSpeed;
// Reset star position if it moves off-screen and generate a new star
if (star.x + starRadius < 0) {
star.x = canvas.width + starRadius;
star.y = Math.random() * (canvas.height - 2 * roadHeight - 100) + roadHeight; // Random vertical position
}
});
}
generateStars();

// Load the star image
const starImage = new Image();
starImage.src = 'sources/star.png'; // Replace with the path to your star image

     // wall 
     
const wallRadius = 15; // Define the radius of the wall
const walls = []; // Array to hold wall positions
const numWalls = 1; // Number of walls

let isGameOver = false; // Flag to indicate if the game is over

// Load the wall image
const wallImage = new Image();
wallImage.src = 'sources/wall.png'; // Replace with the path to your wall image

function drawWall() {
    // Ensure the wall image is loaded before drawing
    if (wallImage.complete) {
        walls.forEach(wall => {
            // Draw a red circle behind the wall image
            ctx.fillStyle = '#c00018';
            ctx.beginPath();
            ctx.arc(wall.x, wall.y, wallRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw the wall image on top of the red circle
            ctx.drawImage(wallImage, wall.x - wallRadius, wall.y - wallRadius, wallRadius * 2, wallRadius * 2);
        });
    }
}

// Generate initial walls
function generateWalls() {
for (let i = 0; i < numWalls; i++) {
const wallX = Math.random() * canvas.width;
const wallY = Math.random() * (canvas.height - 2 * roadHeight - 100) + roadHeight; // Adjust for road height
walls.push({
x: wallX,
y: wallY
});
}
}

generateWalls();

function updateWalls() {
walls.forEach(wall => {
wall.x -= roadSpeed;
// Reset wall position if it moves off-screen and generate a new wall
if (wall.x < -10) {
wall.x = canvas.width + 100;
wall.y = Math.random() * (canvas.height - 2 * roadHeight - 100) + roadHeight; // Random vertical position
}
});
}
      // clouds
      
const clouds = []; // Array to hold cloud positions
const numClouds = 5; // Number of clouds
const cloudSpeed = 1; // Speed of the clouds

// Generate initial clouds
function generateClouds() {
for (let i = 0; i < numClouds; i++) {
const cloudX = Math.random() * canvas.width;
const cloudY = Math.random() * (canvas.height / 2); // Clouds only appear in the upper half
clouds.push({
x: cloudX,
y: cloudY,
size: Math.random() * 40 + 40 // Random cloud size between 50 and 100
});
}
}

// Draw the clouds
function drawClouds() {
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Light white color for the clouds

clouds.forEach(cloud => {
ctx.beginPath();
ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
ctx.arc(cloud.x + cloud.size * 0.6, cloud.y + cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size, 0, Math.PI * 2);
ctx.closePath();
ctx.fill();
});
}

// Update the cloud positions
function updateClouds() {
clouds.forEach(cloud => {
cloud.x -= cloudSpeed;

// Reset cloud position if it moves off-screen
if (cloud.x + cloud.size < -100) {
cloud.x = canvas.width + cloud.size ;
cloud.y = Math.random() * (canvas.height / 2); // Random vertical position in the upper half
}
});
}

generateClouds(); // Generate initial clouds

// Background music
const backgroundMusic = new Audio('sources/background_music.mp3'); // Replace with the path to your music file
backgroundMusic.loop = true; // background music 

// Function to start the background music
function startBackgroundMusic() {
backgroundMusic.play().catch(error => {
console.error('Failed to play background music:', error);
});
}

// Load the sound element
const scoreSound = document.getElementById('scoreSound');

function collectStars() {
    stars.forEach((star, index) => {
        const dx = ballX - star.x;
        const dy = ballY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + starRadius) {
            stars.splice(index, 1); // Remove star
            score++;
            
            // Save the new score to localStorage
            localStorage.setItem('ballScore', score);

            // Play sound when score increases
            scoreSound.play();

            // Add new star to replace the collected one
            stars.push({
                x: canvas.width + starRadius,
                y: Math.random() * (canvas.height - 2 * roadHeight - 100) + roadHeight
            });
        }
    });
}

/* 
document.getElementById('resetScore').addEventListener('click', function() {
    // Reset the saved score in localStorage to 0
    localStorage.setItem('ballScore', 0);
    
    // Reset the current score variable to 0
    score = 0;

    // Update the displayed score on the screen
    const scoreElement = document.getElementById('scoro');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
});
 */


function checkWallCollision() {
walls.forEach(wall => {
const dx = ballX - wall.x;
const dy = ballY - wall.y;
const distance = Math.sqrt(dx * dx + dy * dy);
                
if (distance < ballRadius + wallRadius - 10) {
// Stop the game by setting roadSpeed to 0
roadSpeed = 0;
isGameOver = true; // Set the game over flag to true

backgroundMusic.pause()
document.querySelector('#restart').style.display ='flex'
}
});
}

function drawScore() {
const scoreElement = document.getElementById('scoro');
if (scoreElement) {
scoreElement.textContent = score;
}
}
function animateClouds() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for smooth animation
    
    // Only draw clouds before the game starts
    drawClouds();
    updateClouds();
        drawScore(); 

    if (!isGameOver && document.querySelector('#startBtn').style.display !== 'none') {
        requestAnimationFrame(animateClouds); // Continue cloud animation
    }
}

// Start the cloud animation when the page loads
animateClouds();

function start() {
    if (!isGameOver) { // Only update if the game is not over
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        startBackgroundMusic(); // Start music after user interaction
        
        updateWalls();
        updateClouds();
        drawClouds();
        updateStars();
        drawWall();
        drawStars();
        drawBall();
        updateBall();
        drawScore(); 
        drawRoads();

        requestAnimationFrame(start);
        document.querySelector('#startBtn').style.display = 'none';
        document.querySelector('#ballImg').style.display = 'none'
document.querySelector('#menuBtn').style.display = 'none'

    }
}

canvas.addEventListener('touchstart', () => {
if (!isGameOver) { // Only reverse gravity if the game is not over
isGravityReversed = !isGravityReversed; // Reverse gravity on touch 
}
});
