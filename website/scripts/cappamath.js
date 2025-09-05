console.log("cappamath.js running");

// Get document elements
const numQuestionsInput = document.getElementById("numQuestions");
const timePerQuestionInput = document.getElementById("timePerQuestion");
const estimatedTimeDisplay = document.getElementById("estimatedTime");

const operationSelectButtons = document.getElementById("operationSelectButtons");
let operationRadios = document.querySelectorAll("input[name='operation']");

const customOperationNameInput = document.getElementById("customOperationNameInput");
const customOperationQuestionInput = document.getElementById("customOperationQuestionInput");
const customOperationAnswerInput = document.getElementById("customOperationAnswerInput");
const customOperationPreview = document.getElementById("customOperationPreview");
const customOperationAddButton = document.getElementById("customOperationAddButton");

const setSelectTable = document.getElementById("setSelectTable");

const setPreviewTable = document.getElementById("setPreviewTable");
const customSetNameInput = document.getElementById("customSetNameInput");
const customSetDataInput = document.getElementById("customSetDataInput");
const customSetAddButton = document.getElementById("customSetAddButton");

const selectedOptionsDisplay = document.getElementById("selectedOptionsDisplay");
const selectedSetTable = document.getElementById("selectedSetTable");

const positiveAllowedButton = document.getElementById("positiveAllowedButton");
const negativeAllowedButton = document.getElementById("negativeAllowedButton");
const integerOnlyButton = document.getElementById("integerOnlyButton");

const mixedOptionsButton = document.getElementById("mixedOptionsButton");
const mixedOptionsDisplay = document.getElementById("mixedOptionsDisplay");
const mixedOptionsTable = document.getElementById("mixedOptionsTable");
const mixedOptionsAddButton = document.getElementById("mixedOptionsAddButton");
const mixedOptionsResetButton = document.getElementById("mixedOptionsResetButton");

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
    operation: "addition",
    question: "$$n_1 + n_2$$",
    answer: "${num1+num2}",
    operations: {
        "addition": {
            question: "$$n_1 + n_2$$",
            answer: "${num1+num2}",
        },
        "subtraction": {
            question: "$$n_1 - n_2$$",
            answer: "${num1-num2}",
        },
        "multiplication": {
            question: "$$n_1 \\times n_2$$",
            answer: "${num1*num2}",
        },
        "division": {
            question: "$$n_1 \\div n_2$$",
            answer: "${num1/num2}",
        },
        "algebra-1": {
            question: "$${n_1}x^{n_3} \\times {n_2}x^{n_4}$$",
            answer: "${num1*num2}x^{num3+num4}",
        },
    },
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
    mixedOptions: false,
    extra: {
        positiveAllowed: true,
        negativeAllowed: true,
        integerOnly: false,
    },
}
const storageOptions = JSON.parse(localStorage.getItem("options"));
const optionsRaw = compareObjectKeys(storageOptions, defaultOptions) ? storageOptions : structuredClone(defaultOptions);
let options = makeOptionsProxy(optionsRaw);

const storageMixedOptions = JSON.parse(localStorage.getItem("mixedOptions"));
const mixedOptions = storageMixedOptions || [];

function makeOptionsProxy(raw) {
    raw.sets = makeProxy(raw.sets, optionsUpdated);
    raw.selectedSets = makeProxy(raw.selectedSets, optionsUpdated);
    raw.operations = makeProxy(raw.operations, optionsUpdated);
    raw.extra = makeProxy(raw.extra, optionsUpdated);
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
    showOperations();
    updateSelectedOperation();
    showSets();
    positiveAllowedButton.checked = options.extra.positiveAllowed;
    negativeAllowedButton.checked = options.extra.negativeAllowed;
    integerOnlyButton.checked = options.extra.integerOnly;
    mixedOptionsButton.checked = options.mixedOptions;
    mixedOptionsButton.dispatchEvent(new Event("change"));
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

function showOperations() {
    operationSelectButtons.innerHTML = "";
    operationRadios = [];

    for (const [key, data] of Object.entries(options.operations)) {
        const id = `op-${key}`
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "operation";
        input.dataset.question = data.question;
        input.value = data.answer;
        input.id = id;

        const label = document.createElement("label");
        label.for = id;
        label.innerText = data.question;

        operationSelectButtons.appendChild(input);
        operationSelectButtons.appendChild(label);

        operationRadios.push(input);
        MathJax.typeset([label]);
    }

    operationRadios.forEach(radio => {
        radio.addEventListener("change", updateSelectedOperation);
    });

    for (const el of operationRadios) {
        if (el.id == `op-${options.operation}`) {
            el.checked = true;
            break;
        }
    }
}

customOperationQuestionInput.addEventListener("input", () => {
    customOperationPreview.textContent = customOperationQuestionInput.value.replace("$$", "$i$");
    MathJax.typeset([customOperationPreview]);

    updateSelectedOperation();
});

customOperationAddButton.addEventListener("click", () => {
    const customOperationName = customOperationNameInput.value;

    options.operations[customOperationName] = {
        question: customOperationQuestionInput.value,
        answer: customOperationAnswerInput.value,
    }

    showOperations();
});

function updateSelectedOperation() {
    const checkedRadio = [...operationRadios].filter(el => el.checked)[0];

    if (!checkedRadio) {
        console.error("Checked radio not found");
        return;
    }

    options.operation = checkedRadio.id.replace("op-", "");
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

// Add custom set when user presses enter in the input box
customSetDataInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addCustomSet(event);
    }
});
customSetAddButton.addEventListener("click", addCustomSet);

function addCustomSet(event) {
    event.preventDefault();

    const customSetName = customSetNameInput.value.trim();
    if (!customSetName) return;
    let dataValue = customSetDataInput.value.trim();
    if (dataValue) {
        const customSetData = parseCustomSet(dataValue);
        options.sets[customSetName] = customSetData;
    } else {
        delete options.sets[customSetName];
    }

    showSetSelection();
    showSets();
}

const safeFunctions = {
    range: numberRange,
}

function parseCustomSet(input) {
    // Case 1: Plain numbers (with spaces or commas)
    if (/^[\d\s,]+$/.test(input)) {
        return input
            .split(/[\s,]+/) // split on spaces or commas
            .filter(Boolean) // remove empties
            .map(Number);    // convert to numbers
    }

    // Case 2: Function calls, but only from safeFunctions
    const funcMatch = input.match(/^(\w+)\((.*)\)$/);
    if (funcMatch) {
        const [, fnName, argsStr] = funcMatch;
        const fn = safeFunctions[fnName];
        if (!fn) throw new Error(`Function "${fnName}" is not allowed`);

        // parse arguments (simple split on comma, can be improved)
        const args = argsStr.split(",").map(a => a.trim()).map(Number);
        return fn(...args);
    }

    throw new Error("Invalid input format");
}

positiveAllowedButton.addEventListener("change", (event) => {
    options.extra.positiveAllowed = event.target.checked;
});

negativeAllowedButton.addEventListener("change", (event) => {
    options.extra.negativeAllowed = event.target.checked;
});

integerOnlyButton.addEventListener("change", (event) => {
    options.extra.integerOnly = event.target.checked;
});

mixedOptionsButton.addEventListener("change", (event) => {
    options.mixedOptions = event.target.checked;
    mixedOptionsDisplay.style.display = options.mixedOptions ? "block" : "none";
    if (options.mixedOptions) {
        updateMixedOptions();
        mixedOptionsDisplay.parentElement.open = true;
    }
});

function updateMixedOptions() {
    console.log("updating display");
    mixedOptionsTable.innerHTML = "";
    mixedOptions.forEach((option, i) => {
        console.log("making options");
        const tr = document.createElement("tr");
        const numberCell = document.createElement("td");
        numberCell.innerText = i+1;
        const questionCell = document.createElement("td");
        questionCell.innerText = option.question;
        const setsCell = document.createElement("td");
        setsCell.innerText = Object.entries(option.selectedSets).map(([name, target]) => `$i$${name.replace("num", "n_")}$$: ${target}`).join(", ");
        const deteteCell = document.createElement("td");
        deteteCell.innerHTML = `<button onclick="mixedOptions.splice(${i}, 1); updateMixedOptions();">x</button>`;

        tr.appendChild(numberCell);
        tr.appendChild(questionCell);
        tr.appendChild(setsCell);
        tr.appendChild(deteteCell);
        mixedOptionsTable.appendChild(tr);
    });

    MathJax.typeset([mixedOptionsTable]);

    localStorage.setItem("mixedOptions", JSON.stringify(mixedOptions));
}

mixedOptionsAddButton.addEventListener("click", (event) => {
    mixedOptions.push(deepCopy(options));
    updateMixedOptions();
});

mixedOptionsResetButton.addEventListener("click", () => {
    mixedOptions.length = 0;
    updateMixedOptions();
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
    console.log("Generating with mixed options:", mixedOptions);
    window.open("/cappamath-run");
}

// Share the options as a link
function share() {
    console.log("Sharing with options:", options);
    const optionsParams = encodeURIComponent(JSON.stringify(options));
    let link = window.location + `-run?options=${optionsParams}`;
    const mixedOptionsParams = encodeURIComponent(JSON.stringify(mixedOptions));
    if (options.mixedOptions) link = link + `&mixedOptions=${mixedOptionsParams}`;

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

function deepCopy(obj) {
    // it works sometimes most of the time
    return JSON.parse(JSON.stringify(obj));
}

// Init
init();