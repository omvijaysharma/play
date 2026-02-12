let mainDiv = document.querySelector('.mainDiv')
let game = document.querySelector('.container')
let homeBtn = document.querySelector('.home')
let newBtn = document.querySelector('.restart-button')

function start() {
    game.style.display = 'block'
    mainDiv.style.display = 'none'  
    homeBtn.style.display = 'block'
    newBtn.style.display = 'block'
}

// sound play when score + 

document.addEventListener("DOMContentLoaded", function() {
    // Get the score container and sound element
    const scoreContainer = document.querySelector('.score-container');
    const scoreSound = document.getElementById('scoreSound');
    
    if (!scoreSound) {
        console.error('Score sound element not found');
        return;
    }

    // Initial score value
    let previousScore = parseInt(scoreContainer.textContent, 10);

    // Create a MutationObserver to monitor changes in the score container's text
    const observer = new MutationObserver(() => {
        const newScore = parseInt(scoreContainer.textContent, 10);
        if (newScore > previousScore || newScore < previousScore) {
            // Play sound if the score has increased
            try {
                scoreSound.currentTime = 0; // Reset the audio to the start
                scoreSound.play();
            } catch (e) {
                console.error('Error playing sound:', e);
            }
            previousScore = newScore; // Update previous score
        }
    });

    // Configure the observer to watch for changes in the text content of the score container
    observer.observe(scoreContainer, { childList: true, subtree: true, characterData: true });
});

