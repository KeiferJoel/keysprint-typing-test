const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");

const restartBtn = document.getElementById("restartBtn");

const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const errorsElement = document.getElementById("errors");
const timeElement = document.getElementById("time");
const progressBar = document.getElementById("progressBar");

const resultModal = document.getElementById("resultModal");

const finalWpm = document.getElementById("finalWpm");

const finalAccuracy = document.getElementById("finalAccuracy");

const finalErrors = document.getElementById("finalErrors");

const tryAgainBtn = document.getElementById("tryAgainBtn");


let currentText = "";

let timer;

let timeLeft = 30;

let started = false;

let errors = 0;

let typedCharacters = 0;


function loadRandomText(){

    currentText = texts[
        Math.floor(Math.random()*texts.length)
    ];

    textDisplay.innerHTML = "";

    currentText.split("").forEach(letter=>{

        const span = document.createElement("span");

        span.innerText = letter;

        textDisplay.appendChild(span);

    });

}

loadRandomText();

function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        timeElement.textContent = timeLeft;

        progressBar.style.width = (timeLeft / 30) * 100 + "%";

        if (timeLeft <= 0) {

            clearInterval(timer);

            finishTest();

        }

    }, 1000);

}


textInput.addEventListener("input", () => {

    if (!started) {

        started = true;

        startTimer();

    }

    checkTyping();

});


function checkTyping() {

    const typedText = textInput.value;

    const letters = textDisplay.querySelectorAll("span");

    errors = 0;

    typedCharacters = typedText.length;

    letters.forEach((letter, index) => {

        const character = typedText[index];

        letter.classList.remove("correct", "incorrect", "current");

        if (character == null) {

            letter.classList.add("current");

        }

        else if (character === letter.innerText) {

            letter.classList.add("correct");

        }

        else {

            letter.classList.add("incorrect");

            errors++;

        }

    });

    updateStats();

}


function updateStats() {

    errorsElement.textContent = errors;

    let correctCharacters = typedCharacters - errors;

    if (correctCharacters < 0) {

        correctCharacters = 0;

    }

    const accuracy = typedCharacters === 0
        ? 100
        : Math.round((correctCharacters / typedCharacters) * 100);

    accuracyElement.textContent = accuracy + "%";

    const minutes = (30 - timeLeft) / 60;

    const words = correctCharacters / 5;

    const wpm = minutes > 0
        ? Math.round(words / minutes)
        : 0;

    wpmElement.textContent = wpm;

}

restartBtn.addEventListener("click", restartTest);

function restartTest() {


    resultModal.classList.add("hidden");

    clearInterval(timer);

    started = false;

    timeLeft = 30;

    errors = 0;

    typedCharacters = 0;

    textInput.value = "";

    textInput.disabled = false;

    timeElement.textContent = 30;

    progressBar.style.width = "100%";

    accuracyElement.textContent = "100%";

    errorsElement.textContent = "0";

    wpmElement.textContent = "0";

    loadRandomText();

}


function finishTest(){

    textInput.disabled = true;

    finalWpm.textContent = wpmElement.textContent;

    finalAccuracy.textContent = accuracyElement.textContent;

    finalErrors.textContent = errorsElement.textContent;

    resultModal.classList.remove("hidden");

}

tryAgainBtn.addEventListener("click", restartTest);