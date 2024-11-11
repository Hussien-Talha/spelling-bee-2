document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('hearAgainBtn').addEventListener('click', () => speakWord(currentWord));

const wordList = ["depth", "example", "educate", "entire", "supervisor", "optimistic", "schedule", "characteristic", "vulnerable", "deterrent", "malicious", "technology", "unbelievable", "capably", "amnesty", "sacrifice", "melodious", "rectangular", "vertigo", "parliament", "ubiquitous", "nostalgia", "surveillance", "metamorphosis"];
let currentWord = '';
let score = 0;
let rightAnswers = 0;
let wrongAnswers = 0;
let totalWordsAttempted = 0;
let timerInterval;
let timeLeft = 0;
let livesLeft = 3; // Used in Lives mode
let gameMode = '';
let targetCorrectAnswers = null;
let targetWrongAnswers = null;

function startQuiz(mode) {
    gameMode = mode;
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    resetGame();
    configureGameMode();
    pickNewWord();
}

function startCustomTimeMode() {
    const customTime = prompt("Enter the time limit in seconds:");
    if (customTime && !isNaN(customTime)) {
        timeLeft = parseInt(customTime);
        startQuiz('customTime');
        startTimer();
    }
}

function startCustomCorrectMode() {
    const correctLimit = prompt("Enter the number of correct answers required:");
    if (correctLimit && !isNaN(correctLimit)) {
        targetCorrectAnswers = parseInt(correctLimit);
        startQuiz('customCorrect');
    }
}

function startCustomMode() {
    let customTime = prompt("Enter the time limit in seconds (0 for unlimited):");
    let customLives = prompt("Enter the number of lives (0 for unlimited):");
    let correctLimit = prompt("Enter the number of correct answers needed (0 for no limit):");
    let wrongLimit = prompt("Enter the number of wrong answers allowed (0 for unlimited):");

    if (customTime && customLives && correctLimit && wrongLimit) {
        timeLeft = customTime > 0 ? parseInt(customTime) : null;
        livesLeft = customLives > 0 ? parseInt(customLives) : null;
        targetCorrectAnswers = correctLimit > 0 ? parseInt(correctLimit) : null;
        targetWrongAnswers = wrongLimit > 0 ? parseInt(wrongLimit) : null;

        startQuiz('custom');

        if (timeLeft) startTimer();
    }
}

function resetGame() {
    score = 0;
    rightAnswers = 0;
    wrongAnswers = 0;
    totalWordsAttempted = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('rightCount').textContent = rightAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('totalWords').textContent = totalWordsAttempted;
    clearInterval(timerInterval);
}

function configureGameMode() {
    if (gameMode === 'lives') {
        livesLeft = 3;
    }
}

function startTimer() {
    document.getElementById('timer').textContent = timeLeft;
    timerInterval = setInterval(() => {
        if (timeLeft !== null) {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endQuiz();
            }
        }
    }, 1000);
}

function endQuiz() {
    document.getElementById('feedback').textContent = "Quiz ended! Final score: " + score;
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
}

function pickNewWord() {
    totalWordsAttempted++;
    document.getElementById('totalWords').textContent = totalWordsAttempted;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    currentWord = wordList[randomIndex];
    speakWord(currentWord);
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
}

function checkAnswer() {
    const userInput = document.getElementById('userInput').value.trim().toLowerCase();
    if (userInput === currentWord.toLowerCase()) {
        score++;
        rightAnswers++;
        document.getElementById('feedback').textContent = "Correct!";
        if (gameMode === 'customCorrect' && rightAnswers >= targetCorrectAnswers) {
            endQuiz();
            return;
        }
    } else {
        score--;
        wrongAnswers++;
        if (gameMode === 'lives' && livesLeft !== null) {
            livesLeft--;
            if (livesLeft <= 0) {
                endQuiz();
                return;
            }
        }
        if (gameMode === 'custom' && targetWrongAnswers !== null && wrongAnswers >= targetWrongAnswers) {
            endQuiz();
            return;
        }
        document.getElementById('feedback').textContent = `Incorrect! The correct spelling is: ${currentWord}`;
    }
    document.getElementById('score').textContent = score;
    document.getElementById('rightCount').textContent = rightAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('userInput').value = '';
    pickNewWord();
}

function backToHome() {
    clearInterval(timerInterval);
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
}