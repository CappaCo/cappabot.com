console.log("cappamath-run.js is running");

const screens = [...document.getElementsByClassName("screen")];
const questionDisplay = document.getElementById("questionDisplay");
const questionLoadingBar = document.getElementById("questionLoadingBar");

const queryParams = new URLSearchParams(window.location.search);
const singleOptions = getOptions("options");
if (singleOptions.mixedOptions) {
    console.log("using mixed options :O");
    mixedOptions = getOptions("mixedOptions");
}

const calculated = [];

function getOptions(optionsName) {
    return JSON.parse(getOptionsJSON(optionsName));
}

function getOptionsJSON(optionsName) {
    const search = optionsName || "options";
    const optionsParams = queryParams.get(search);
    if (optionsParams) {
        console.log("Getting options from url");
        return optionsParams;
    }

    const optionsStorage = localStorage.getItem(search);
    if (optionsStorage) {
        console.log("Getting options from localStorage");
        return optionsStorage;
    }

    throw new Error("No options could be found");
}

console.log("running with options:");
console.log(singleOptions);

document.getElementById("startButton").addEventListener("click", () => {
    changeScreen("question");

    calculateQuestions();
    startQuestions();
});

function changeScreen(screenName) {
    screens.filter((el) => el.classList.contains("active")).forEach((el) => el.classList.remove("active"));
    screens.filter((el) => el.id == `${screenName}Screen`)[0].classList.add("active");
}

function calculateQuestions() {
    console.log("calculating questions...");
    const allOptions = singleOptions.mixedOptions ? mixedOptions : [singleOptions]
    
    allOptions.forEach((options) => {
        for (let i = 0; i < options.numQuestions; i++) {
            calculated.push(calculateQuestion(options));
        }
    });

    console.log("calculated:", calculated);
}

function calculateQuestion(options) {
    console.log("calculating using:", options.question, "=", options.answer);
    const sets = {};

    for (const [key, value] of Object.entries(options.selectedSets)) {
        sets[key] = options.sets[value];
    }

    console.log("sets:", sets);

    const numbers = {};
    for (const [key, value] of Object.entries(sets)) {
        numbers[key] = randomItem(value);
    }

    console.log("numbers:", numbers);

    let question = options.question;
    question.match(/n_\d+/gm).forEach((match) => {
        console.log("found match", match);
        const split = match.split("_");
        question = question.replace(match, numbers[`num${split[1]}`]);
    });

    return {
        question: question,
        time: options.timePerQuestion,
    }
}

function randomItem(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function startQuestions() {
    console.log("I'm spongebob!");

    const questionPromise = Promise.resolve();
    const questionsDone = calculated.reduce((promiseChain, calculation) => {
        return promiseChain.then(() => {
            console.log("showing question");
            console.log(calculation);
            return showQuestion(calculation.question, calculation.time);
        });
    }, questionPromise);
    questionsDone.then(() => {
        console.log("questions done!");
        changeScreen("answers");
        showAnswers();
    });
}

async function showQuestion(question, time) {
    questionDisplay.innerText = question;
    MathJax.typeset([questionDisplay]);
    return new Promise((resolve) => {
        doQuestionLoadingBar(time)
            .then(resolve);
    });
}

async function doQuestionLoadingBar(time) {
    return new Promise((resolve) => {
        let value = 0;
        const loadingUpdateTime = 0.1;

        questionLoadingBar.max = time;
        questionLoadingBar.value = 0;

        const loadingInterval = setInterval(() => {
            questionLoadingBar.value = value;
            if (value > time) {
                clearInterval(loadingInterval);
                resolve();
            }
            value += loadingUpdateTime;
        }, loadingUpdateTime*1000);
    });
}

function showAnswers() {
    const answersTable = document.getElementById("answersTable");
    answersTable.innerHTML = "";
    for (const [i, calculation] of calculated.entries()) {
        const tr = document.createElement("tr");
        const no = document.createElement("td");
        no.innerText = i+1;
        const questionCell = document.createElement("td");
        questionCell.innerHTML = calculation.question.replace("$$", "$i$");
        const answerCell = document.createElement("td");
        answerCell.innerText = `$i$${calculation.answer}$$`;
        tr.appendChild(no);
        tr.appendChild(questionCell);
        tr.appendChild(answerCell);
        answersTable.appendChild(tr);
    }
    MathJax.typeset([answersTable]);
}