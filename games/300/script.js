// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const levelDisplay = document.getElementById("level-display");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const startBtn = document.getElementById("start-btn");
const menuContent = document.getElementById("menu-content");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score-display");
const logoLevel = document.getElementById("logo-level");
const resetBtn = document.querySelector(".resetBtns")
const rightSound = new Audio('sound/right.wav');
const wrongSound = new Audio('sound/wrong.wav');
const tapSound = new Audio('sound/tap.wav')

// Game State
let currentQuestionIndex = 0;
const GAME_PROGRESS_KEY = 'mathThousandProgress';

// Initialize game
function initGame() {
  const savedProgress = localStorage.getItem(GAME_PROGRESS_KEY);

  if (savedProgress) {
    currentQuestionIndex = parseInt(savedProgress);
    startBtn.textContent = currentQuestionIndex > 0 ? `Continue (Level ${currentQuestionIndex + 1})` : "Start Game";
    logoLevel.textContent = currentQuestionIndex > 0 ? `${currentQuestionIndex + 1}` : "M";
    updateProgressBar();
    updateScoreDisplay();
  } else {
    startBtn.textContent = "Start Game";
  }
  
  if (questionBank.length === parseInt(logoLevel.textContent)) {
    document.querySelector('.progress-container').style.display = "none"
    scoreDisplay.style.display = "none"
    startBtn.style.display = "none"
  }
}

// Update progress bar
function updateProgressBar() {
  const progress = (currentQuestionIndex / questionBank.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Update score display
function updateScoreDisplay() {scoreDisplay.textContent = `Level: ${currentQuestionIndex}/${questionBank.length}`;}

// Toggle Menu
function toggleMenu() {menuContent.classList.toggle("show");}

function goHome() {window.location.reload();}

// Close menu when clicking outside
window.addEventListener("click", (e) => {
  if (!e.target.matches('.btn') && !e.target.matches('.menu-item')) {
    menuContent.classList.remove('show');
  }
  tapSound.currentTime = 0;
  tapSound.play();
});

// Enhanced Modal Functions
function showModal(title, text, buttons = []) {
  modalTitle.textContent = title;
  modalText.innerHTML = text.replace(/\n/g, '<br>');

  modal.classList.remove("hidden");
}

function showInstructions() {
  showModal(
    "How to Play",
    "- Answer math questions correctly to advance<br>" +
    "- Use powerups to help you progress<br>" +
    "- Try to reach the highest level!<br><br>" +
    "Powerups:<br>" +
    "• 50:50 - Eliminates two wrong answers<br>" +
    "• Skip - Skip to the next question"
  );
}

function showAbout() {
  showModal(
    "About MATH 300",
    "MATH 300 is a challenging math quiz game with 300 levels.<br><br>" +
    "Test your arithmetic skills and see how far you can go!<br><br>" +
    "Created with ❤️<br><br>" +
    "<a href='https://github.com/omvijaysharma/play-store/blob/main/Math%20300%20%3A%20mcq%20quiz%2FPrivate_policy.md' target='_blank'>Privacy Policy</a><br>" +
    "Developer -<a href='https://github.com/omvijaysharma'> omvijaysharma </a>"
  );
}

// Reset progress with confirmation
function resetProgress() {
  showModal(
    "Reset Progress",
    "Are you sure you want to reset your progress?<br>This will restart the game from Level 1.",
  );
  resetBtn.style.display = "flex";
}

function confirmReset() {
  currentQuestionIndex = 0;
  localStorage.removeItem(GAME_PROGRESS_KEY);
  initGame();
  menuContent.classList.remove("show");
  
  // Show confirmation message
  showModal("Progress Reset", "Your progress has been reset successfully!");
  resetBtn.style.display = "none";
}

// Save progress
function saveProgress() {localStorage.setItem(GAME_PROGRESS_KEY, currentQuestionIndex.toString());}

// Powerup functions - Unlimited usage
function useFiftyFifty() {
  const options = document.querySelectorAll(".option");
  const correctAnswer = questionBank[currentQuestionIndex][1];
  let wrongOptions = [];

  // Find all wrong options
  options.forEach(option => {
    if (option.textContent !== correctAnswer) {
      wrongOptions.push(option);
    }
  });

  // Shuffle wrong options and hide two of them
  wrongOptions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && i < wrongOptions.length; i++) {
    wrongOptions[i].classList.add("hidden-option");
  }
}

function useSkip() {
  if (currentQuestionIndex < questionBank.length - 1) {
    currentQuestionIndex++;
    saveProgress();loadQuestion();
  }
}

// Game Functions
function shuffleArray(array) {return array.sort(() => Math.random() - 0.5);}

function loadQuestion() {
  const question = questionBank[currentQuestionIndex];
  levelDisplay.textContent = currentQuestionIndex + 1;
  questionEl.textContent = question[0];

  // Use the predefined wrong answers from the question bank
  const wrongAnswers = question[2];
  
  let answers = [question[1], ...wrongAnswers];
  answers = shuffleArray(answers);

  const optionBtns = document.querySelectorAll("#options .option");
  optionBtns.forEach((btn, i) => {
    btn.textContent = answers[i] || "";
    btn.className = "option"; // reset styles (remove correct/wrong/hidden-option)
    btn.onclick = () => selectAnswer(btn, question[1]);
    btn.disabled = false;
  });

  updateProgressBar();updateScoreDisplay();
}

function selectAnswer(selectedBtn, correctAnswer) {
    const buttons = document.querySelectorAll(".option");
    buttons.forEach(button => button.disabled = true);

    if (selectedBtn.textContent === correctAnswer) {
        // ✅ Agar correct hai to green karo
        selectedBtn.classList.add("correct");
        rightSound.currentTime = 0;
        rightSound.play();

        setTimeout(() => {
            if (currentQuestionIndex < questionBank.length - 1) {
                currentQuestionIndex++;
                saveProgress();
                loadQuestion();
            } else {
                showModal("Congratulations!", "You've completed all 1000 levels! You're a Math Master!");
                saveProgress();
            }
        }, 1000);

    } else {
        // ❌ Agar galat hai to sirf red karo
        selectedBtn.classList.add("wrong");
        wrongSound.currentTime = 0;
        wrongSound.play();

        setTimeout(() => {
            saveProgress();
            loadQuestion();
        }, 1000);
    }
}

// Start Game
function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadQuestion();
}

// Initialize the game
initGame();