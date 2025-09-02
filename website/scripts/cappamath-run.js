console.log("cappamath-run.js is running");

const screens = [...document.getElementsByClassName("screen")];

const queryParams = new URLSearchParams(window.location.search);
const options = getOptions();

function getOptions() {
    return JSON.parse(getOptionsJSON());
}

function getOptionsJSON() {
    const optionsParams = queryParams.get("options");
    if (optionsParams) {
        console.log("Getting options from url");
        return optionsParams;
    }

    const optionsStorage = localStorage.getItem("options");
    if (optionsStorage) {
        console.log("Getting options from localStorage");
        return optionsStorage;
    }

    throw new Error("No options could be found");
}

console.log("running with options:");
console.log(options);

document.getElementById("startButton").addEventListener("click", () => {
    changeScreen("question");

    startQuestions();
});

function changeScreen(screenName) {
    screens.filter((el) => el.classList.contains("active")).forEach((el) => el.classList.remove("active"));
    screens.filter((el) => el.id == `${screenName}Screen`)[0].classList.add("active");
}

function startQuestions() {
    console.log("I'm spongebob!");
}