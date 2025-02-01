// DOM Elements
const pokemonImage = document.getElementById('pokemon');
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const scoreDisplay = document.getElementById('score');
const sizeDisplay = document.getElementById('size');
const timerDisplay = document.createElement('p'); // Timer display
document.body.appendChild(timerDisplay);

// Game Variables
let currentWord = '';
let score = 0;
let sizeMultiplier = 1;
let timeLeft = 60; // 60-second timer
let difficulty = 'medium'; // Default difficulty
let gameInterval;
let shrinkInterval;
let words = [];

// Load a random Pokémon
async function loadPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomId}.png`;
    pokemonImage.style.transform = `scale(${sizeMultiplier})`;
}

// Pick a new word based on difficulty
function newWord(wordList) {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    wordDisplay.textContent = currentWord;
    wordInput.value = '';
}

// Check user input
wordInput.addEventListener('input', () => {
    if (wordInput.value.toLowerCase() === currentWord.toLowerCase().replace(' ', '')) {
        handleCorrectTyping();
        newWord(words);
    }
});

// Function to handle correct typing
function handleCorrectTyping() {
    score++;
    sizeMultiplier += 0.1;
    updateScoreAndSize();
}

// Update score and Pokémon size
function updateScoreAndSize() {
    scoreDisplay.textContent = score;
    sizeDisplay.textContent = `${sizeMultiplier.toFixed(1)}x`;
    pokemonImage.style.transform = `scale(${sizeMultiplier})`;
}

// Timer function
function startTimer() {
    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else {
            endGame();
        }
    }, 1000);
}

// End game function
function endGame() {
    clearInterval(gameInterval);
    clearInterval(shrinkInterval);
    wordInput.disabled = true;
    alert(`Time's up! Your final score is ${score}. Final Size is ${sizeMultiplier}`);
}

// Shrinking effect over time
function startShrinkEffect() {
    shrinkInterval = setInterval(() => {
        if (sizeMultiplier > 1) {
            sizeMultiplier -= difficulty === 'hard' ? 0.05 : difficulty === 'medium' ? 0.03 : 0.02;
            sizeMultiplier = Math.max(1, sizeMultiplier);
            updatePokemonSize();
        }
    }, 2000);
}

// Change difficulty
function setDifficulty(level) {
    difficulty = level;
    document.getElementById('difficulty-selection').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    startGame();
}

function updatePokemonSize() {
    pokemonImage.style.transform = `scale(${sizeMultiplier})`;
    sizeDisplay.textContent = `${sizeMultiplier.toFixed(1)}x`;
}

// Play background music
const bgMusic = new Audio(
    'https://eta.vgmtreasurechest.com/soundtracks/pokemon-game-boy-pok-mon-sound-complete-set-play-cd/vfywpihuos/1-01.%20Opening.mp3'
);
bgMusic.loop = true;
bgMusic.volume = 0.2; // Adjust volume

// Start the game
async function startGame() {
    // loadPokemon();
    // words = await getPokemonWords();
    // newWord(words);
    wordInput.disabled = false;
    startTimer();
    startShrinkEffect();
    bgMusic.play();
}

async function initGame() {
    wordInput.disabled = true;
    loadPokemon();
    words = (await getPokemonWords()).map((word) => word.replace('-', ' '));
    newWord(words);
}

async function fetchPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonNames = data.results.map((pokemon) => pokemon.name);
        return pokemonNames;
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
        return [];
    }
}

async function fetchPokemonMoves() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/move?limit=100');
        const data = await response.json();
        const moveNames = data.results.map((move) => move.name);
        return moveNames;
    } catch (error) {
        console.error('Error fetching Pokémon moves:', error);
        return [];
    }
}

async function fetchPokemonAbilities() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/ability?limit=100');
        const data = await response.json();
        const abilityNames = data.results.map((ability) => ability.name);
        return abilityNames;
    } catch (error) {
        console.error('Error fetching Pokémon abilities:', error);
        return [];
    }
}

async function getPokemonWords() {
    const names = await fetchPokemonNames();
    const moves = await fetchPokemonMoves();
    const abilities = await fetchPokemonAbilities();
    const allWords = [...names, ...moves, ...abilities];
    return allWords;
}

initGame();
