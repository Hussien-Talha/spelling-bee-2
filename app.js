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
let livesLeft = 3;
let gameMode = '';
let targetCorrectAnswers = null;
let targetWrongAnswers = null;
let customKeyboardEnabled = false;

function startQuiz(mode) {
    gameMode = mode;
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    resetGame();
    configureGameMode();
    pickNewWord();
}

function toggleKeyboard() {
    customKeyboardEnabled = !customKeyboardEnabled;
    document.getElementById('keyboard').classList.toggle('hidden', !customKeyboardEnabled);
    document.getElementById('userInput').readOnly = customKeyboardEnabled;
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
    document.getElementById('userInput').value = '';
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
    } else {
        wrongAnswers++;
        document.getElementById('feedback').textContent = "Incorrect!";
        if (gameMode === 'lives') livesLeft--;
    }

    document.getElementById('score').textContent = score;
    document.getElementById('rightCount').textContent = rightAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;

    document.getElementById('userInput').value = '';
    pickNewWord();

    if (gameMode === 'lives' && livesLeft <= 0) endQuiz();
}

function addCharacter(character) {
    document.getElementById('userInput').value += character;
}

function backspace() {
    const currentInput = document.getElementById('userInput').value;
    document.getElementById('userInput').value = currentInput.slice(0, -1);
}

function backToHome() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    clearInterval(timerInterval);
}