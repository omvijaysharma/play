/* ======================================================================= variable ====== */
let SpeedMultiplier = 1;
let initialRockSpeed = 4.5;
let initialGapSpeed = 2.5;

let rightBtn = document.querySelector('#rightBtn');
let leftBtn = 
document.querySelector('#leftBtn');
let tryAgainBtn = document.querySelector('#tryAgainBtn');
let startBtn = document.querySelector('#startBtn');
let startBtnDiv = document.querySelector('.startBtnDiv');
let levelNum = document.querySelector('#levelNum');
let challenge = document.querySelector('.challenge');
let settingBtn = document.querySelector('#settingBtn');
let settingXBtn = document.querySelector('#settingXBtn');
let scoroDiv = document.querySelector('.scoroDiv');
const settingDiv = document.querySelector('.settingDiv');
const resetScoroDiv = document.querySelector('.resetScoroDiv');
const scoreSound = document.querySelector('#pointMusic');
const backgroundMusic = document.querySelector('#backMusic');
let shiBtn = document.querySelector('#shipBtn');
let shipImageDivFull = document.querySelector('.shipImageDivFull');
/* ======================================================================= canvas ======== */
const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
/* ====================================================================== default function */
function funDisplay(items,value) {
    for (let i = 1; i <= items.length; i++) {
        items[i - 1].style.display = value;
    }
}
function reload() { location.reload(); }
/* ========================================================================== rock ======= */
const rock = {
    x: canvas.width / 2 - 17.5,
    y: 150,  
    height: 35,    
    width: 35,
    gravity: 0,
    speed: (window.innerWidth / 80) * SpeedMultiplier,    
    moveLeft: false,
    moveRight: false
};

let shipImage = localStorage.getItem('gravityRockData.ship') ||  'ship/15-1.png';

let rockImage = new Image();
rockImage.src = shipImage;

function drawRock() {
    drawThreads(); // Ensure this function exists.
    ctx.save();
    ctx.translate(rock.x + rock.width / 2, rock.y + rock.height / 2);
    ctx.rotate(Math.PI / 1);
    ctx.drawImage(rockImage, -rock.width / 2, -rock.height / 2, rock.width, rock.height);
    ctx.restore();
}

/* =========================================================================== gap ======= */
const gapHeight = 20;
const gapWidth = 100;
const gapSpacing = ( canvas.height / 4 ) + ( gapHeight / 2 );
let gaps = [];
let gameOver = false;
let score = 0;

function createGaps() {
    gaps = [];
    for (let i = 0; i < 4; i++) {
        const gapX = Math.random() * (canvas.width - gapWidth);
        const gapY = (i + 2) * gapSpacing;
        gaps.push({
            x: gapX,
            y: gapY,
            width: gapWidth,
            height: gapHeight,
            color: '#ffffff'
        });
    }
}
function drawGaps() {
    gaps.forEach(gap => {
        ctx.fillStyle = gap.color;
        ctx.fillRect(0, gap.y, canvas.width, gap.height);
        ctx.clearRect(gap.x, gap.y, gap.width, gap.height);
    });
}

/* ============================================================================ stars ==== */
const stars = [];
const starCount = 1080;
const starSpeed = 1 * SpeedMultiplier;

// Create stars
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2
    });
}
function drawStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 0.5);
        ctx.fill();
    });
}

/* ======================================================================== threads ====== */
let threadOffset = 0;
let threadSpeed = 0.5;
let threadLength = 5;
let threadMotionLength = 5;
let threadWidth = 2;
let threadGap = shipImage.substring(5, 7);
                
function drawThreads() {
    ctx.beginPath();
    const threadStartY = rock.y - 0; // Position the thread above the rock 
    const threadEndY = threadStartY - threadLength + Math.sin(threadOffset) * threadMotionLength;
    
// First left
    ctx.moveTo((rock.x + rock.width / 2) + threadGap / 2, threadStartY);
    ctx.lineTo((rock.x + rock.width / 2) + threadGap / 2, threadEndY);

//Second right

    ctx.moveTo((rock.x + rock.width / 2) - threadGap / 2, threadStartY);
    ctx.lineTo((rock.x + rock.width / 2) - threadGap / 2, threadEndY);
    
    ctx.strokeStyle = '#ff7300';
    ctx.lineWidth = threadWidth;
    ctx.stroke();
    ctx.closePath();
    threadOffset += threadSpeed;
}

/* ========================================================================= scoro ======= */
function drawScore() { scoreDisplay.textContent = `${score}`; }

/* ================================================================================ onload */
window.onload = function() {
    const savedShipImage = localStorage.getItem('gravityRockData.ship');
    if (savedShipImage) {
        shipImage = savedShipImage; // Load saved image
        rockImage.src = shipImage;
    }

    const savedHighScore = localStorage.getItem('gravityRock.gHigh');
    if (savedHighScore !== null) {
       gHigh.textContent = savedHighScore;
       levelNum.textContent = savedHighScore;
    } else {
       gHigh.textContent = 0;
       levelNum.textContent = 0;
    }
}

function imageOfShip(image) {
    rockImage.src = image;
    localStorage.setItem('gravityRockData.ship', image);
threadGap = image.substring(5, 7);
}
/* ======================================================================= setting ======= */
function setting() {
    funDisplay([settingBtn],'none')
    funDisplay([settingXBtn],'flex')
    settingDiv.style.left = '0';
}

function settingX() {
    funDisplay([settingBtn],'flex')
    funDisplay([settingXBtn],'none')
    settingDiv.style.left = '-50vw';
}

function resetScoro() { funDisplay([resetScoroDiv],'flex'); }

function resetScoreYes() {
    localStorage.setItem('gravityRock.gHigh', 0);
    gHigh.textContent = 0;
    levelNum.textContent = 0;
    funDisplay([resetScoroDiv],'none')
    imageOfShip('ship/15-1.png')
}

function resetScoroNo() { funDisplay([resetScoroDiv],'none'); }

function showShipImageDiv(score) {
    funDisplay([shipImageDivFull],'flex')
    settingX();
    funDisplay([startBtn,levelNum,challenge,settingBtn,settingXBtn,shipBtn],'none')
    document.querySelector('.shipImageDivFirst p').innerText = score
    let num;
    
         if (score >= 2000) {num = 15;}
    else if (score >= 1800) {num = 14;}
    else if (score >= 1600) {num = 13;}
    else if (score >= 1400) {num = 12;}
    else if (score >= 1200) {num = 11;}
    else if (score >= 1000) {num = 10;}
    else if (score >=  900) {num =  9;}
    else if (score >=  400) {num =  8;}
    else if (score >=  700) {num =  7;}
    else if (score >=  600) {num =  6;}
    else if (score >=  500) {num =  5;}
    else if (score >=  400) {num =  4;}
    else if (score >=  300) {num =  3;}
    else if (score >=  200) {num =  2;}
    else                    {num =  1;}

    for (let i = 1; i <= num; i++) {
        let vari = document.querySelector(`.shipImageDiv > button:nth-child(${i})`);
        vari.style.opacity = '1';
        vari.style.pointerEvents = 'auto';
        if (i > 1) {document.querySelector(`.shipImageDiv > button:nth-child(${i}) p`).style.display = 'none'}
    }
}

/* ==================================================================== main button ====== */
function showTryAgain() {
    backgroundMusic.pause();
    funDisplay([tryAgainBtn,home],'flex')
}

function start() {
    settingX();
    funDisplay([leftBtn,rightBtn,scoroDiv],'flex');
    
    let blink = 'blink 1s 2'
    leftBtn.style.animation = blink;
    rightBtn.style.animation = blink;
    setTimeout(createGaps,1500);
    backgroundMusic.play()
    let isGameActive = true;
    
    funDisplay([startBtn,levelNum,challenge,settingXBtn,shipImageDivFull,settingBtn,shipBtn],'none');
    
    startBtn.addEventListener('click', resetGame);
}

function resetGame() {
    gameOver = false;
    rock.y = 150;
    rock.x = canvas.width / 2 - 17.5;
    score = 0;
    SpeedMultiplier = 1;
    rock.speed = initialRockSpeed * SpeedMultiplier;
    currentGapSpeed = initialGapSpeed * SpeedMultiplier;
    createGaps();
    update();

    funDisplay([tryAgainBtn,home],'none')
    backgroundMusic.play()
}
/* ================================================== left and right button and event ==== */
const btnActions = (btn, direction) => {
let lARBtn = document.getElementById(btn);

    lARBtn.addEventListener('mousedown', () => rock[direction] = true);
    lARBtn.addEventListener('mouseup', () => rock[direction] = false);
    lARBtn.addEventListener('touchstart', () => rock[direction] = true);
    lARBtn.addEventListener('touchend', () => rock[direction] = false);
};

btnActions('rightBtn', 'moveLeft');
btnActions('leftBtn', 'moveRight');

document.addEventListener('keydown', (event) => {
    if (!gameOver) rock[`move${event.key === 'ArrowLeft' ? 'Left' : 'Right'}`] = true;
});

document.addEventListener('keyup', (event) => {
    rock[`move${event.key === 'ArrowLeft' ? 'Left' : 'Right'}`] = false;
});

/* ============================================================================ update === */
function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rock.speed = initialRockSpeed * SpeedMultiplier;
    currentGapSpeed = initialGapSpeed * SpeedMultiplier;

    drawStars();

    if (rock.moveLeft) {rock.x += rock.speed;}
    if (rock.moveRight) {rock.x -= rock.speed;} 

    let presentScoro = parseInt(scoreDisplay.textContent, 10);
    let gHigh = parseInt(document.querySelector('#gHigh').textContent, 10);

    if (presentScoro > gHigh) {
        document.querySelector('#gHigh').textContent = presentScoro;
        localStorage.setItem('gravityRock.gHigh', presentScoro);
    }

    drawGaps();
    drawScore();
    drawRock();

    gaps.forEach(gap => {
        gap.y -= currentGapSpeed; // ###
                

        if (gap.y + gap.height < 0) {
            score++;
            gap.y = canvas.height;
            gap.x = Math.random() * (canvas.width - gapWidth);

            if (score % 25 === 0) {
                SpeedMultiplier += 0.1;        
            }

            if (score % 1 === 0) {
                scoreSound.currentTime = 0;
                scoreSound.play()
            }
        }
        
        if (rock.y + rock.height > gap.y && rock.y < gap.y + gap.height) {
            if (rock.x + rock.width > gap.x && rock.x < gap.x + gap.width) {
                
            } else { gameOver = true;
                     showTryAgain();
            }
        }
    });
    
    stars.forEach(star => {
        star.y -= starSpeed;
        if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(update);
}

update();
