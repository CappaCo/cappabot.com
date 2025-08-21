// Initialize MathJax
MathJax = {
    tex: {
        inlineMath: {'[+]': [['$i$', '$$']]}
    }
};

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const selectedOptions = {
    "numQuestions": 0,
    "timePerQuestion": 0,
    "operation": "",
    "sets": {
        
    },
};

// Generate the sets
function numberRange(min, max) {
    // Generate an array of numbers from min to max (inclusive)
    if (max === undefined) {
        max = min;
        min = 1; // Default to 1 if only one argument is provided
    }
    return Array.from({length: max - min + 1}, (_, i) => i + min)
}

const sets = {
    "1": numberRange(10), // 1 through 10
    "2": numberRange(13), // 1 through 13
    "3": numberRange(5), // 1 through 5
}

// Add event listeners to update the estimated time when inputs change
const numQuestionsInput = document.getElementById("numQuestions");
const timePerQuestionInput = document.getElementById("timePerQuestion");
const estimatedTimeDisplay = document.getElementById("estimatedTime");

numQuestionsInput.addEventListener("input", updateEstimatedTime);
timePerQuestionInput.addEventListener("input", updateEstimatedTime);

function updateEstimatedTime() {
    const numQuestions = parseInt(numQuestionsInput.value);
    const timePerQuestion = parseInt(timePerQuestionInput.value);
    const estimatedTime = numQuestions * timePerQuestion;
    estimatedTimeDisplay.textContent = (isNaN(estimatedTime)) ? "..." : estimatedTime;
}

updateEstimatedTime();

// Custom operation input handling
const customOperationInput = document.getElementById("customOperation");
const operationRadios = document.querySelectorAll("input[name='operation']");

// Make the custom operation input visible when the custom radio button is selected
operationRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "custom") {
            customOperationInput.style.display = "block";
        } else {
            customOperationInput.style.display = "none";
        }
    });
});

// Generate selection inputs based on the sets
const setSelectTable = document.getElementById("setSelectTable");

function showSetSelection() {
    setSelectTable.innerHTML = ""; // Clear previous content

    const variableHeaders = Array.from({length: 4}, (_, i) => `$i$n_${i + 1}$$`);
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    variableHeaders.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    setSelectTable.appendChild(header);

    const body = document.createElement("tbody");
    for (const [setIndex, [setName]] of Object.entries(sets).entries()) {
        const row = document.createElement("tr");
        for (let i = 1; i <= variableHeaders.length; i++) {
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
}

showSetSelection();

setSelectTable.querySelectorAll("input[type='radio']").forEach((el) => {
    el.addEventListener("change", (event) => {
        setSelectionChange(event.target);
    });
});

function setSelectionChange(e) {
    console.log(e);
    const [_, variable, set] = e.id.split("-");
    selectedOptions.sets[variable] = sets[set];
}

// Update selected sets with the defaults
setSelectTable.querySelectorAll("tbody > tr:first-child > td > input[type='radio']").forEach(setSelectionChange);

// Show what's in the sets
const setPreviewTable = document.getElementById("setPreviewTable");

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

showSets();