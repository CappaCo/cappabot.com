console.log("cappamath-run.js is running");

const screens = [...document.getElementsByClassName("screen")];

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
        calculated.push(calculateQuestion(options));
    });
}

function calculateQuestion(options) {
    console.log("calculating using:", options.question);
}

function startQuestions() {
    console.log("I'm spongebob!");
}