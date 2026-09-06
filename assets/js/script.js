const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");


const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");

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

const timeSelect = document.getElementById("timeSelect");

const personalBestElement = document.getElementById("personalBest");
const newRecordElement = document.getElementById("newRecord");

const PERSONAL_BEST_KEY = "keysprint_personal_best";

let personalBest = Number(localStorage.getItem(PERSONAL_BEST_KEY)) || 0;

let currentText = "";

let timer;

let selectedTime = 30;

let timeLeft = selectedTime;

let errors = 0;

let typedCharacters = 0;


timeSelect.addEventListener("change", () => {

    selectedTime = Number(timeSelect.value);

    timeLeft = selectedTime;

    timeElement.textContent = selectedTime;

    progressBar.style.width = "100%";

});


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

const firstLetter = textDisplay.querySelector("span");

if(firstLetter){

    firstLetter.classList.add("current");

}

}

loadRandomText();

textInput.disabled = true;

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        timeLeft--;

        timeElement.textContent = timeLeft;

        // progressBar.style.width = (timeLeft / 30) * 100 + "%";
        // progressBar.style.width = (timeLeft / selectedTime) * 100 + "%";

        const progress = (timeLeft / selectedTime) * 100;

progressBar.style.width = progress + "%";

if (progress > 50) {

    progressBar.style.background = "linear-gradient(90deg, #22C55E, #16A34A)";

}
else if (progress > 20) {

    progressBar.style.background = "linear-gradient(90deg, #FACC15, #EAB308)";

}
else {

    progressBar.style.background = "linear-gradient(90deg, #EF4444, #DC2626)";

}

        if (timeLeft <= 0) {

            clearInterval(timer);

            finishTest();

        }

    }, 1000);

}


function startCountdown() {

    let count = 3;

    countdown.classList.remove("hidden");

    countdown.textContent = count;

    const interval = setInterval(() => {

        count--;

        if (count > 0) {

            countdown.textContent = count;

            countdown.classList.remove("animate");

            void countdown.offsetWidth;

            countdown.classList.add("animate");

        }

        else if (count === 0) {

            countdown.textContent = "GO!";

            countdown.classList.remove("animate");

            void countdown.offsetWidth;

            countdown.classList.add("animate");

        }

        else {

            clearInterval(interval);

            countdown.classList.add("hidden");

            textInput.disabled = false;

            textInput.focus();

            startTimer();

        }

    }, 1000);

}


// textInput.addEventListener("input", () => {

//     if (!started) {

//         started = true;

//         startTimer();

//     }

//     checkTyping();

// });

textInput.addEventListener("input", checkTyping);

// function startCountdown(){

//     let count = 3;

//     countdown.classList.remove("hidden");

//     countdown.textContent = count;

//     const interval = setInterval(()=>{

//         count--;

//         if(count > 0){

//             countdown.textContent = count;

//         }

//         else if(count === 0){

//             countdown.textContent = "GO!";

//         }

//         else{

//             clearInterval(interval);

//             countdown.classList.add("hidden");

//             textInput.disabled = false;

//             textInput.focus();

//             startTimer();

//         }

//     },1000);

// }




startBtn.addEventListener("click", () => {

    startBtn.disabled = true;

    timeSelect.disabled = true;

    startCountdown();

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

            if (index === typedText.length) {

                letter.classList.add("current");

            }

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

    if(typedText === currentText){

    clearInterval(timer);

    finishTest();

}



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

    // const minutes = (30 - timeLeft) / 60;
    const minutes = (selectedTime - timeLeft) / 60;

    const words = correctCharacters / 5;

    const wpm = minutes > 0
        ? Math.round(words / minutes)
        : 0;

    wpmElement.textContent = wpm;

}


function updatePersonalBest(currentWpm) {

    if (currentWpm > personalBest) {

        personalBest = currentWpm;

        localStorage.setItem(
            PERSONAL_BEST_KEY,
            personalBest
        );

        personalBestElement.textContent = personalBest;

        newRecordElement.classList.remove("hidden");

        return;
    }

    personalBestElement.textContent = personalBest;

    newRecordElement.classList.add("hidden");
}



function restartTest(){

    clearInterval(timer);

    resultModal.classList.add("hidden");

    timeLeft = selectedTime;

    errors = 0;

    typedCharacters = 0;

    textInput.value = "";

    textInput.disabled = true;

    timeElement.textContent = selectedTime;

    progressBar.style.width = "100%";

    progressBar.style.background =
        "linear-gradient(90deg,#22C55E,#16A34A)";

    accuracyElement.textContent = "100%";

    errorsElement.textContent = "0";

    wpmElement.textContent = "0";

    loadRandomText();

    startBtn.disabled = false;

    timeSelect.disabled = false;

    newRecordElement.classList.add("hidden");
    
    personalBestElement.textContent = personalBest;

}


function finishTest() {

    textInput.disabled = true;

    startBtn.innerHTML = `
        <span>🔄</span>
        <span>New Test</span>
    `;

    startBtn.disabled = false;

    timeSelect.disabled = false;

    finalWpm.textContent = wpmElement.textContent;

    finalAccuracy.textContent = accuracyElement.textContent;

    finalErrors.textContent = errorsElement.textContent;

    const currentWpm = Number(wpmElement.textContent);

    updatePersonalBest(currentWpm);

    resultModal.classList.remove("hidden");

}

    tryAgainBtn.addEventListener("click", restartTest);