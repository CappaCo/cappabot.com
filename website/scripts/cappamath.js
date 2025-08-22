console.log("cappamath.js running");

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let variableHeaders = [];
const requiredVariables = new Set();

const selectedOptions = makeProxy({
    numQuestions: 0,
    timePerQuestion: 0,
    question: "",
    answer: "",
    sets: makeProxy({}, optionsUpdated),
}, optionsUpdated);

// Generate the sets
const sets = {
    "1": numberRange(10), // 1 through 10
    "2": numberRange(13), // 1 through 13
    "3": numberRange(5), // 1 through 5
}

// Get document elements
const numQuestionsInput = document.getElementById("numQuestions");
const timePerQuestionInput = document.getElementById("timePerQuestion");
const estimatedTimeDisplay = document.getElementById("estimatedTime");

const operationRadios = document.querySelectorAll("input[name='operation']");

const customOperationInput = document.getElementById("customOperation");
const customOperationQuestion = document.getElementById("customOperationQuestion");
const customOperationAnswer = document.getElementById("customOperationAnswer");
const customOperationPreview = document.getElementById("customOperationPreview");

const setSelectTable = document.getElementById("setSelectTable");

const setPreviewTable = document.getElementById("setPreviewTable");

const selectedOptionsDisplay = document.getElementById("selectedOptionsDisplay");

function optionsUpdated() {
    displaySelectedOptions();
}

function init() {
    numQuestionsInput.dispatchEvent(new Event("input"));
    timePerQuestionInput.dispatchEvent(new Event("input"));
    updateSelectedOperation();
    showSets();
}

// Add event listeners to update the estimated time when inputs change
numQuestionsInput.addEventListener("input", function updateNumQuestions() {
    numQuestionsInput.setAttribute("aria-invalid", checkValidNumber(numQuestionsInput.value, 1) ? "" : "true");
    selectedOptions.numQuestions = Number(numQuestionsInput.value);
    updateEstimatedTime();
});

timePerQuestionInput.addEventListener("input", function updateTimePerQuestion() {
    timePerQuestionInput.setAttribute("aria-invalid", checkValidNumber(timePerQuestionInput.value, 0.1, 300) ? "" : "true");
    selectedOptions.timePerQuestion = Number(timePerQuestionInput.value);
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
    updateSelectedOperation();
});

customOperationAnswer.addEventListener("input", (e) => {
    updateSelectedOperation();
});

function updateSelectedOperation() {
    const checkedRadio = [...operationRadios].filter(el => el.checked)[0];

    if (checkedRadio.value === "custom") {
        customOperationInput.style.display = "block";
    } else {
        customOperationInput.style.display = "none";
    }

    const value = checkedRadio.value;
    const question = (value === "custom") ? customOperationQuestion.value : checkedRadio.dataset.question;
    selectedOptions.question = question;

    const answer = (value === "custom") ? customOperationAnswer.value : value;
    selectedOptions.answer = answer;

    updateRequiredVariables();
}

function updateRequiredVariables() {
    requiredVariables.clear();

    const regex = /num\d+/gm;
    let matches = selectedOptions.answer.match(regex);
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
        th.textContent = headerText.replace("num", "$i$n_{") + "}$$";
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    setSelectTable.appendChild(header);

    const body = document.createElement("tbody");
    for (const [setIndex, [setName]] of Object.entries(sets).entries()) {
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
            if (setIndex === 0) input.checked = true;

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
    // Update selected sets with the defaults
    setSelectTable.querySelectorAll("input[type='radio']:checked").forEach((e) => {
        const [_, variable, set] = e.id.split("-");
        selectedOptions.sets[variable] = sets[set];
    });
}

// Show what's in each of the sets
function showSets() {
    setPreviewTable.innerHTML = ""; // Clear previous content

    for (const [setName, setValues] of Object.entries(sets)) {
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

// Display current selected options
function displaySelectedOptions() {
    selectedOptionsDisplay.innerHTML = `
        <strong>Number of Questions:</strong> ${selectedOptions.numQuestions} <br>
        <strong>Time per Question:</strong> ${selectedOptions.timePerQuestion} seconds <br>
        <strong>Question:</strong> ${selectedOptions.question} <br>
        <strong>Answer:</strong> ${selectedOptions.answer} <br>
        <strong>Sets:</strong> ${JSON.stringify(selectedOptions.sets)} <br>
    `;
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

// Init
init();