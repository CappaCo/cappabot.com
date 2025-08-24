console.log("cappamath.js running");

// Get document elements
const numQuestionsInput = document.getElementById("numQuestions");
const timePerQuestionInput = document.getElementById("timePerQuestion");
const estimatedTimeDisplay = document.getElementById("estimatedTime");

const operationRadios = document.querySelectorAll("input[name='operation']");
const customQuestionRadioButton = document.getElementById("op-custom");

const customOperationInput = document.getElementById("customOperation");
const customOperationQuestion = document.getElementById("customOperationQuestion");
const customOperationAnswer = document.getElementById("customOperationAnswer");
const customOperationPreview = document.getElementById("customOperationPreview");

const setSelectTable = document.getElementById("setSelectTable");

const setPreviewTable = document.getElementById("setPreviewTable");
const customSetNameInput = document.getElementById("customSetNameInput");
const customSetDataInput = document.getElementById("customSetDataInput");
const customSetAddButton = document.getElementById("customSetAddButton");

const selectedOptionsDisplay = document.getElementById("selectedOptionsDisplay");
const selectedSetTable = document.getElementById("selectedSetTable");

const shareLinkDisplay = document.getElementById("shareLinkDisplay");
document.getElementById("generateButton").addEventListener("click", generate);
document.getElementById("shareButton").addEventListener("click", share);
document.getElementById("resetButton").addEventListener("click", reset);

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let variableHeaders = [];
const requiredVariables = new Set();

const defaultOptions = {
    numQuestions: 10,
    timePerQuestion: 5,
    operation: "op-add",
    question: "$$n_1 + n_2$$",
    answer: "${num1+num2}",
    selectedSets: {
        "num1": "1",
        "num2": "1",
        "num3": "1",
        "num4": "1",
    },
    sets: {
        "1": numberRange(10), // 1 through 10
        "2": numberRange(13), // 1 through 13
        "3": numberRange(5), // 1 through 5
    },
}
const storageOptions = JSON.parse(localStorage.getItem("options"));
const optionsRaw = compareObjectKeys(storageOptions, defaultOptions) ? storageOptions : {...defaultOptions};
let options = makeOptionsProxy(optionsRaw);

function makeOptionsProxy(raw) {
    raw.sets = makeProxy(raw.sets, optionsUpdated);
    raw.selectedSets = makeProxy(raw.selectedSets, optionsUpdated);
    const proxy = makeProxy(raw, optionsUpdated);
    return proxy;
}

function optionsUpdated() {
    localStorage.setItem("options", JSON.stringify(options));
    displaySelectedOptions();
}

function init() {
    console.log("running init");
    numQuestionsInput.value = options.numQuestions;
    numQuestionsInput.dispatchEvent(new Event("input"));
    timePerQuestionInput.value = options.timePerQuestion;
    timePerQuestionInput.dispatchEvent(new Event("input"));
    for (const el of operationRadios) {
        if (el.id == options.operation) {
            el.checked = true;
            if (el == customQuestionRadioButton) {
                customOperationQuestion.value = options.question;
                customOperationAnswer.value = options.answer;
                customOperationQuestion.dispatchEvent(new Event("input"));
                customOperationAnswer.dispatchEvent(new Event("input"));
            }
            break;
        }
    }
    updateSelectedOperation();
    showSets();
}

// Add event listeners to update the estimated time when inputs change
numQuestionsInput.addEventListener("input", function updateNumQuestions() {
    numQuestionsInput.setAttribute("aria-invalid", checkValidNumber(numQuestionsInput.value, 1) ? "" : "true");
    options.numQuestions = Number(numQuestionsInput.value);
    updateEstimatedTime();
});

timePerQuestionInput.addEventListener("input", function updateTimePerQuestion() {
    timePerQuestionInput.setAttribute("aria-invalid", checkValidNumber(timePerQuestionInput.value, 0.1, 300) ? "" : "true");
    options.timePerQuestion = Number(timePerQuestionInput.value);
    updateEstimatedTime();
});

function updateEstimatedTime() {
    const numQuestions = Number(numQuestionsInput.value);
    const timePerQuestion = Number(timePerQuestionInput.value);
    const estimatedTime = numQuestions * timePerQuestion;
    estimatedTimeDisplay.textContent = (isNaN(estimatedTime)) ? "..." : estimatedTime;
}

// Make the custom operation input visible when the custom radio button is selected
operationRadios.forEach(radio => {
    radio.addEventListener("change", updateSelectedOperation);
});

customOperationQuestion.addEventListener("input", (e) => {
    customOperationPreview.textContent = customOperationQuestion.value;
    MathJax.typeset([customOperationPreview]);

    customQuestionRadioButton.dataset.question = customOperationQuestion.value || "";

    updateSelectedOperation();
});

customOperationAnswer.addEventListener("input", (e) => {
    customQuestionRadioButton.value = customOperationAnswer.value || "";

    updateSelectedOperation();
});

function updateSelectedOperation() {
    const checkedRadio = [...operationRadios].filter(el => el.checked)[0];

    if (checkedRadio.id === "op-custom") {
        customOperationInput.style.display = "block";
    } else {
        customOperationInput.style.display = "none";
    }

    options.operation = checkedRadio.id;
    options.question = checkedRadio.dataset.question;
    options.answer = checkedRadio.value;

    updateRequiredVariables();
}

function updateRequiredVariables() {
    requiredVariables.clear();

    const regex = /num\d+/gm;
    let matches = options.answer.match(regex);
    if (!matches) matches = [];
    matches.forEach(match => { requiredVariables.add(match); });

    variableHeaders = Array.from(requiredVariables);

    showSetSelection();
}

// Generate selection inputs based on the sets
function showSetSelection() {
    setSelectTable.innerHTML = ""; // Clear previous content

    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");

    variableHeaders.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = varToMath(headerText);
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    setSelectTable.appendChild(header);

    const body = document.createElement("tbody");
    for (const [setName] of Object.entries(options.sets)) {
        const row = document.createElement("tr");
        for (const i of variableHeaders) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            const label = document.createElement("label");

            const id = `var-${i}-${setName}`;

            input.type = "radio";
            input.name = `var-${i}`;
            input.value = setName;
            input.id = id;
            if (setName == options.selectedSets[i]) input.checked = true;

            td.appendChild(input);

            label.setAttribute("for", id);
            label.innerText = setName;

            td.appendChild(label);
            row.appendChild(td);
        }
        body.appendChild(row);
    }
    setSelectTable.appendChild(body);

    setSelectTable.querySelectorAll("input[type='radio']").forEach((el) => {
        el.addEventListener("change", updateSelectedSets);
    });

    MathJax.typeset([headerRow]); // Re-render MathJax after updating the table

    updateSelectedSets(); 
}

function updateSelectedSets() {
    //for (const key in options.sets) { delete options.sets[key] }
    
    // Update selected sets with the defaults
    setSelectTable.querySelectorAll("input[type='radio']:checked").forEach((e) => {
        const [_, variable, set] = e.id.split("-");
        options.selectedSets[variable] = set;
    });
}

// Show what's in each of the sets
function showSets() {
    setPreviewTable.innerHTML = ""; // Clear previous content

    for (const [setName, setValues] of Object.entries(options.sets)) {
        const row = document.createElement("tr");
        const setCell = document.createElement("td");
        setCell.textContent = setName;
        row.appendChild(setCell);

        const valuesCell = document.createElement("td");
        valuesCell.textContent = setValues.join(", ");
        row.appendChild(valuesCell);

        setPreviewTable.appendChild(row);
    }
}

customSetAddButton.addEventListener("click", (event) => {
    event.preventDefault();

    const customSetName = customSetNameInput.value.trim();
    const dataValue = customSetDataInput.value.trim();
    if (dataValue) {
        const customSetData = dataValue.split(/[,\s]+/).map(Number);
        options.sets[customSetName] = customSetData;
    } else {
        delete options.sets[customSetName];
    }

    showSetSelection();
    showSets();
});

// Display current selected options
function displaySelectedOptions() {
    selectedOptionsDisplay.innerHTML = `
        <strong>Number of Questions:</strong> ${options.numQuestions} <br>
        <strong>Time per Question:</strong> ${options.timePerQuestion} seconds <br>
        <strong>Question:</strong> ${options.question.replace("$$", "$i$")} <br>
    `;

    MathJax.typeset([selectedOptionsDisplay]);

    selectedSetTable.innerHTML = "";

    for (const [setName, setValue] of Object.entries(options.selectedSets).filter(name => variableHeaders.includes(name[0]))) {
        const row = document.createElement("tr");
        const setCell = document.createElement("td");
        setCell.textContent = varToMath(setName);
        row.appendChild(setCell);

        const valuesCell = document.createElement("td");
        const value = options.sets[setValue];
        if (!value) {
            options.selectedSets[setName] = Object.entries(options.sets)[0][0];
            console.log("run it back");
            showSetSelection();
            return;
        }
        valuesCell.textContent = value.join(", ");
        row.appendChild(valuesCell);

        selectedSetTable.appendChild(row);
    }

    MathJax.typeset([selectedSetTable]);
}

// Generate the actual page that does the thing
function generate() {
    console.log("Generating with options:", options);
    window.open("/cappamath-run");
}

// Share the options as a link
function share() {
    console.log("Sharing with options:", options);
    const params = encodeURIComponent(JSON.stringify(options));
    const link = window.location + `-run?options=${params}`;
    shareLinkDisplay.href = link;
    shareLinkDisplay.innerText = link;
    navigator.clipboard.writeText(link)
        .then(() => {
            alert("Copied to clipboard");
        });
}

// Reset the options
function reset() {
    console.log("resetting");
    options = makeOptionsProxy(defaultOptions);
    optionsUpdated();
    init();
}

// Util
function makeProxy(obj, callback) {
    return new Proxy(obj, {
        set(target, key, value) {
            const response = Reflect.set(target, key, value);
            callback();
            return response;
        },
    });
}

function numberRange(min, max) {
    // Generate an array of numbers from min to max (inclusive)
    if (max === undefined) {
        max = min;
        min = 1; // Default to 1 if only one argument is provided
    }
    return Array.from({length: max - min + 1}, (_, i) => i + min);
}

function checkValidNumber(value, min = 0, max = 100) {
    const parsedValue = parseFloat(value);
    return (!isNaN(value) && value.trim() !== "" && min <= parsedValue && parsedValue <= max);
}

function varToMath(name) {
    return name.replace("num", "$i$n_{") + "}$$";
}

function compareObjectKeys(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => obj2.hasOwnProperty(key));
}

// Init
init();