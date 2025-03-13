document.addEventListener("DOMContentLoaded", () => {
    const dataManager = new DataManager();
    const logButton = document.getElementById("logButton");
    const clearButton = document.getElementById("clearButton");
    const entryInput = document.getElementById("entryInput");

    logButton.addEventListener("click", () => {
        const value = parseInt(entryInput.value.trim(), 10);
        const exercise = exerciseType.value;
    
        if (!isNaN(value) && value > 0) {
            const entry = { date: new Date().toISOString(), value: value };
            dataManager.saveEntry(exercise, entry);
            entryInput.value = ""; // Clear input field
            updateCards();
        } else {
            alert("Please enter a valid number greater than zero.");
        }
    });

    clearButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all data?")) {
            dataManager.clearEntries();
            updateChart();
        }
    });

    function updateCards() {
        const entries = dataManager.getEntries();
        updateProgressChart(entries);
    }

    updateCards(); // Load data on startup
});
