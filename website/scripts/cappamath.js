// Initialize MathJax
MathJax = {
    tex: {
        inlineMath: {'[+]': [['$i$', '$$']]}
    }
};

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

        updateSetSelection();
    });
});

function numberRange(min, max) {
    // Generate an array of numbers from min to max (inclusive)
    if (max === undefined) {
        max = min;
        min = 1; // Default to 1 if only one argument is provided
    }
    return Array.from({length: max - min + 1}, (_, i) => i + min)
}

// Render set options based on selected operation
const sets = {
    "num": {
        "1": numberRange(10), // 1 through 10
        "2": numberRange(13), // 1 through 13
        "3": numberRange(5), // 1 through 5
    },
    "let": {
        "full alphabet": "abcdefghijklmnopqrstuvwxyz".split(""), // Letters a-z
        "xyz": "xyz".split(""), // Letters x, y, z
    },
}

function findXSetsNeeded(operation, setToFind) {
    // For example, if the operation is ${num1 + num2}, we need to return [num1, num2]

    function getPartNumber(part) {
        // Extract the number from the part, e.g., "num1" -> "1"
        let setNum = "";

        let going = true;
        part.split("")
            .forEach(char => {
                if (!going) return;
                if (!isNaN(char)) {
                    setNum = setNum + char;
                    going = false;
                }
            });
        
        const requiredSet = setToFind + setNum;
        return requiredSet;
    }


    const setsNeeded = operation
        .split(setToFind)
        .slice(1) // Remove the first part before the first "num"
        .map(getPartNumber) // Get the first part before any operator
    
    const uniqueSets = [...new Set(setsNeeded)]; // Remove duplicates
    return uniqueSets;
}

function findSetsNeededFromOperation(operation) {
    // Find the sets needed for the operation
    const setsNeeded = [
        ...findXSetsNeeded(operation, "num"),
        ...findXSetsNeeded(operation, "let"),
    ];
    
    // Render the number sets based on the unique sets needed
    return setsNeeded;
}

function findSetsNeeded() {
    let operation = document.querySelector("input[name='operation']:checked").value;
    if (operation === "custom") {
        const customAnswer = document.getElementById("customOperationAnswer").value;
        operation = customAnswer;
    }

    return findSetsNeededFromOperation(operation);
}

function updateSetSelection() {
    const setsNeeded = findSetsNeeded();
    console.log("Sets needed:", setsNeeded);

    // Update the number set table
    const setSelectTable = document.getElementById("setSelectTable");
    setSelectTable.innerHTML = ""; // Clear existing content

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    setsNeeded.forEach(set => {
        const th = document.createElement("th");
        th.textContent = set;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    setSelectTable.appendChild(thead);

    // Get all set keys for each set needed
    const allSetKeys = setsNeeded.map(set => {
        const setName = getSetName(set);
        return sets[setName] ? Object.keys(sets[setName]) : [];
    });

    console.log("All set keys:", allSetKeys);

    // Find the maximum number of keys among all sets
    const maxRows = Math.max(...allSetKeys.map(keys => keys.length));

    // Create table body
    const tbody = document.createElement("tbody");
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
        const row = document.createElement("tr");
        setsNeeded.forEach((set, colIdx) => {
            const keys = allSetKeys[colIdx];
            const key = keys[rowIdx];
            const cell = document.createElement("td");
            if (key !== undefined) {
                const inputID = `set-${set}-${key}`;
                const radio = document.createElement("input");

                radio.type = "radio";
                radio.name = `set-${set}`; // group by variable
                radio.value = key;
                radio.id = inputID;
                radio.checked = (key === "1"); // Default to the first set

                radio.addEventListener("change", () => {
                    // You can handle changes here if needed
                });

                const label = document.createElement("label");
                label.setAttribute("for", inputID);
                label.textContent = key;

                cell.appendChild(radio);
                cell.appendChild(label);
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    }
    setSelectTable.appendChild(tbody);

    updateSetPreviews();
}

function getSetName(set) {
    let setName = "";
    set.split("")
        .forEach(char => {
            if (alphabet.includes(char)) {
                setName = setName + char;
            }
        });
    
    return setName;
}

function updateSetPreviews() {
    const setPreviewContainer = document.getElementById("setPreviewContainer");
    setPreviewContainer.innerHTML = ""; // Clear existing content

    const setsNeeded = findSetsNeeded();
    for (const set of setsNeeded) {
        const setName = getSetName(set);
        const setData = sets[setName];

        if (setData) {
            const setPreviewTable = document.createElement("table");
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const th = document.createElement("th");
            th.textContent = set;
            headerRow.appendChild(th);
            thead.appendChild(headerRow);
            setPreviewTable.appendChild(thead);
            const tbody = document.createElement("tbody");
            for (const [key, value] of Object.entries(setData)) {
                const row = document.createElement("tr"); 
                const headerCell = document.createElement("th");
                const cell = document.createElement("td");
                headerCell.textContent = key;
                cell.textContent = value.join(", "); // Join array values with a comma
                row.appendChild(headerCell, cell);
                tbody.appendChild(row);
            }
        }
    }
}

updateSetSelection();