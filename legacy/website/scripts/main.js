console.log("Main.js is running!");

// Settings object to store all settings
const settings = {
    autoDelete: true,
};

// Function to update settings from localStorage
function loadSettings() {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings !== null) {
        Object.assign(settings, JSON.parse(storedSettings));
    }
    saveSettings(true);
}

// Function to save settings to localStorage
function saveSettings(skip) {
    if (!skip) localStorage.setItem('settings', JSON.stringify(settings));
    if (autoDeleteButton) autoDeleteButton.innerText = settings.autoDelete ? "Auto delete (on)" : "Auto delete (off)";
}

// Remove all things from test container
function deleteTests() {
    while (testContainer.firstChild) {
        testContainer.removeChild(testContainer.firstChild);
    }
}

// deno-lint-ignore no-unused-vars
function toggleAutoDelete() {
    settings.autoDelete = !settings.autoDelete;
    saveSettings();
}

// deno-lint-ignore no-unused-vars
function runTest(test, type = "function") {
    // If autoDelete is enabled, delete all tests before running a new one
    if (settings.autoDelete) deleteTests();
    if (type == "function") test();
    else if (type == "p5") new p5(test);
    else console.error("Invalid test type: " + type);
}

// The main part of the file

// Get elements from the page
const testContainer = document.getElementById("test-container");
const autoDeleteButton = document.getElementById("autoDeleteButton");

// If the test container exist on this page, set the width and height
if (testContainer) {
    console.log("Test container exists");
    ratio = 16 / 9;
    width = testContainer.offsetWidth;
    height = width / ratio;
}

// Call the function to update settings on page load
loadSettings();
