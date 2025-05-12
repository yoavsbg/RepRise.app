document.addEventListener("DOMContentLoaded", () => {
    const dataManager = new DataManager();
    const logButton = document.getElementById("logButton");
    const addExerciseButton = document.getElementById("addExerciseButton");
    const entryInput = document.getElementById("entryInput");
    const entryDate = document.getElementById("entryDate");
    const datePickerBtn = document.getElementById("datePickerBtn");
    const dateDropdown = document.getElementById("dateDropdown");
    const clearDateButton = document.getElementById("clearDateButton");
    const applyDateButton = document.getElementById("applyDateButton");
    const selectedDateDisplay = document.getElementById("selectedDateDisplay");
    const selectedDateContainer = document.getElementById("selectedDateContainer");
    const exerciseType = document.getElementById("exerciseType");
    const newExerciseInput = document.getElementById("newExercise");
    const unitTypeSelect = document.getElementById("unitType");
    const cardsContainer = document.getElementById("cardsContainer");
    const exportLink = document.getElementById("exportLink");
    const dateRange = document.getElementById("dateRange");
    const insightsContainer = document.getElementById("insightsContainer");
    const insightsGrid = document.getElementById("insightsGrid");
    const themeToggle = document.getElementById("themeToggle");
    const goalModal = document.getElementById("goalModal");
    const goalExercise = document.getElementById("goalExercise");
    const goalValue = document.getElementById("goalValue");
    const saveGoalButton = document.getElementById("saveGoalButton");
    const removeGoalButton = document.getElementById("removeGoalButton");
    const cancelGoalButton = document.getElementById("cancelGoalButton");
    const addExerciseModal = document.getElementById("addExerciseModal");
    const modalNewExercise = document.getElementById("modalNewExercise");
    const modalUnitType = document.getElementById("modalUnitType");
    const modalAddExerciseButton = document.getElementById("modalAddExerciseButton");
    const cancelAddExerciseButton = document.getElementById("cancelAddExerciseButton");
    const newExerciseContainer = document.getElementById("newExerciseContainer");
    const savedTheme = localStorage.getItem("theme") || "light";
    
    // Default exercise units
    const defaultExercises = {
        "pushups": { unit: "reps" },
        "pullups": { unit: "reps" },
        "dips": { unit: "reps" }
    };
    
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    // Load saved date range preference
    const savedDateRange = localStorage.getItem("dateRangePreference") || "last24";
    dateRange.value = savedDateRange;
    
    // Initialize theme toggle based on saved theme
    const currentTheme = localStorage.getItem("theme") || "light";
    themeToggle.checked = currentTheme === "dark";
    
    // Load saved exercises from localStorage
    loadExercisesFromStorage();
    
    // Update placeholder based on selected exercise
    updateInputPlaceholder();
    
    // Hide date dropdown by default
    dateDropdown.classList.add("hidden");
    
    // Function to get unit label for display
    function getUnitLabel(unitType) {
        switch(unitType) {
            case "reps": return "reps";
            case "time": return "min";
            case "distance": return "km";
            default: return "reps";
        }
    }
    
    // Add event listener to update placeholder when exercise changes
    exerciseType.addEventListener("change", (e) => {
        updateInputPlaceholder();
        
        // Check if "Add..." option is selected
        if (exerciseType.value === "add") {
            // Show the add exercise modal
            showAddExerciseModal();
            
            // Reset to previous selection after showing the modal
            const previousSelection = localStorage.getItem("lastSelectedExercise") || "pushups";
            exerciseType.value = previousSelection;
        } else {
            // Store the last selected exercise
            localStorage.setItem("lastSelectedExercise", exerciseType.value);
        }
    });
    
    // Function to update input placeholder based on selected exercise
    function updateInputPlaceholder() {
        const selectedExercise = exerciseType.value;
        if (!selectedExercise || selectedExercise === "add") return;
        
        const exerciseData = getExerciseData(selectedExercise);
        
        if (exerciseData && exerciseData.unit) {
            switch(exerciseData.unit) {
                case "reps":
                    entryInput.placeholder = "Enter reps";
                    break;
                case "time":
                    entryInput.placeholder = "Enter time (minutes)";
                    break;
                case "distance":
                    entryInput.placeholder = "Enter distance (km)";
                    break;
                default:
                    entryInput.placeholder = "Enter value";
            }
        } else {
            entryInput.placeholder = "Enter reps";
        }
    }
    
    // Function to get exercise data
    function getExerciseData(exerciseName) {
        if (defaultExercises[exerciseName]) {
            return defaultExercises[exerciseName];
        }
        
        const customExercises = JSON.parse(localStorage.getItem("exercises")) || {};
        return customExercises[exerciseName] || { unit: "reps" };
    }
    
    // Function to load exercises from localStorage
    function loadExercisesFromStorage() {
        const savedExercises = JSON.parse(localStorage.getItem("exercises")) || {};
        
        // Clear existing options except default ones and "Add..." option
        const defaultOptionNames = Object.keys(defaultExercises);
        const preserveOptions = [...defaultOptionNames, "add"];
        
        // Check if exerciseType exists
        if (!exerciseType) return;
        
        // Remove all options except default ones and "Add..."
        Array.from(exerciseType.options).forEach(option => {
            if (!preserveOptions.includes(option.value)) {
                exerciseType.removeChild(option);
            }
        });
        
        // Add saved custom exercises
        Object.keys(savedExercises).forEach(exercise => {
            // Check if exercise already exists
            if (!document.querySelector(`#exerciseType option[value="${exercise}"]`)) {
                const option = document.createElement("option");
                option.value = exercise;
                option.textContent = exercise.charAt(0).toUpperCase() + exercise.slice(1);
                option.dataset.unit = savedExercises[exercise].unit;
                
                // Insert before the "Add..." option
                const addOption = document.querySelector('#exerciseType option[value="add"]');
                if (addOption) {
                    exerciseType.insertBefore(option, addOption);
                } else {
                    exerciseType.appendChild(option);
                }
            }
        });
    }
    
    // Function to save exercises to localStorage
    function saveExercisesToStorage() {
        const defaultOptionNames = Object.keys(defaultExercises);
        const customExercises = JSON.parse(localStorage.getItem("exercises")) || {};
        
        // Save updated exercises
        localStorage.setItem("exercises", JSON.stringify(customExercises));
    }
    
    // Handle theme toggle
    themeToggle.addEventListener("change", () => {
        const newTheme = themeToggle.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        
        // Refresh charts to apply new theme
        updateCards();
    });
    
    // Function to show goal modal
    function showGoalModal(exercise) {
        goalExercise.value = exercise;
        const existingGoal = dataManager.getGoal(exercise);
        
        if (existingGoal) {
            goalValue.value = existingGoal.value;
            removeGoalButton.style.display = "block";
        } else {
            goalValue.value = "";
            removeGoalButton.style.display = "none";
        }
        
        goalModal.showModal();
    }
    
    // Function to show add exercise modal
    function showAddExerciseModal() {
        modalNewExercise.value = "";
        modalUnitType.value = "reps";
        addExerciseModal.showModal();
    }
    
    // Handle goal form submission
    saveGoalButton.addEventListener("click", (e) => {
        e.preventDefault();
        
        const exercise = goalExercise.value;
        const value = parseInt(goalValue.value);
        
        if (!exercise || isNaN(value) || value <= 0) {
            alert("Please enter a valid goal value");
            return;
        }
        
        dataManager.saveGoal(exercise, { value });
        goalModal.close();
        updateCards();
    });
    
    // Handle goal removal
    removeGoalButton.addEventListener("click", () => {
        const exercise = goalExercise.value;
        dataManager.removeGoal(exercise);
        goalModal.close();
        updateCards();
    });
    
    // Handle cancel button
    cancelGoalButton.addEventListener("click", () => {
        goalModal.close();
    });
    
    function updateCards() {
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = "";
        const data = dataManager.getEntries();
        const selectedRange = dateRange.value;
        
        let hasDataToShow = false;

        Object.keys(data).forEach(exercise => {
            let entries = data[exercise] || [];
            if (entries.length === 0) return;
            
            // Filter entries based on date range
            entries = filterEntriesByDateRange(entries, selectedRange);
            if (entries.length === 0) return;
            
            hasDataToShow = true;
            
            const card = document.createElement("div");
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            card.className = isDarkMode 
                ? "card bg-gray-800 shadow-md p-4 rounded-lg mb-6 border border-gray-700" 
                : "card bg-base-100 shadow-md p-4 rounded-lg mb-6";
            
            // Get goal for this exercise if it exists
            const goal = dataManager.getGoal(exercise);
            let goalHtml = "";
            
            // Get exercise data to determine unit
            const exerciseData = getExerciseData(exercise);
            const unitLabel = getUnitLabel(exerciseData.unit);
            
            if (goal) {
                const maxValue = Math.max(...entries.map(e => e.value));
                
                // Default to "single" type for backward compatibility
                const goalValue = goal.value;
                const progress = Math.min(100, Math.round((maxValue / goalValue) * 100));
                const progressColorClass = progress >= 100 ? "progress-success" : "progress-primary";
                
                goalHtml = `
                    <div class="mt-2 mb-4">
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium">${maxValue}/${goalValue} ${unitLabel}</span>
                            <span class="text-sm font-medium">${progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-primary h-2.5 rounded-full ${progressColorClass}" style="width: ${progress}%"></div>
                        </div>
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold">${exercise.charAt(0).toUpperCase() + exercise.slice(1)}</h3>
                    <button class="btn btn-xs btn-ghost set-goal-btn" data-exercise="${exercise}">
                        ${goal ? "Edit Goal" : "Set Goal"}
                    </button>
                </div>
                ${goalHtml}
                <h2 class="text-2xl text-primary font-bold">Max: ${Math.max(...entries.map(e => e.value))} ${unitLabel}</h2>
                <p class="text-gray-500">${new Date(entries[entries.length - 1].date).toLocaleString()}</p>
                <canvas id="chart-${exercise}" class="mt-4"></canvas>
            `;
            cardsContainer.appendChild(card);
            
            // Add event listener to goal button
            card.querySelector(".set-goal-btn").addEventListener("click", () => {
                showGoalModal(exercise);
            });

            setTimeout(() => updateChart(exercise, entries), 100);
        });
        
        // Display motivational message if no data to show
        if (!hasDataToShow) {
            const motivationCard = document.createElement("div");
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            motivationCard.className = isDarkMode 
                ? "card bg-gray-800 shadow-md p-6 rounded-lg text-center mx-auto max-w-lg w-full border border-gray-700" 
                : "card bg-base-100 shadow-md p-6 rounded-lg text-center mx-auto max-w-lg w-full";
            
            const messages = [
                "\"Success isn't always about greatness. It's about consistency.\" — The Rock",
                "Track each rep, each step, and let consistency build your greatness.",
                "\"What gets measured gets improved.\" — Peter Drucker",
                "Log every effort—your journey to strength is built on progress you can see.",
                "\"Discipline equals freedom.\" — Jocko Willink",
                "Keep showing up, track your grind, and earn the freedom of real strength.",
                "\"If you can't fly, run. If you can't run, walk.\" — Martin Luther King Jr.",
                "Just don't stop—record each rep and keep moving forward.",
                "\"It's not about perfect. It's about effort.\" — Jillian Michaels",
                "Your daily effort matters. Log it, own it, and grow from it."
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            motivationCard.innerHTML = `
                <h2 class="text-2xl text-primary font-bold mb-4 w-full">No data for this time period</h2>
                <p class="text-lg w-full">${randomMessage}</p>
                <button id="startLoggingBtn" class="btn btn-primary mt-4 w-full">Start Logging</button>
            `;
            cardsContainer.appendChild(motivationCard);
            
            // Scroll to input and focus on it when "Start Logging" is clicked
            document.getElementById("startLoggingBtn").addEventListener("click", () => {
                document.querySelector(".container.max-w-lg").scrollIntoView({ behavior: "smooth" });
                entryInput.focus();
            });
            
            // Hide insights if no data to show
            insightsContainer.style.display = "none";
        } else {
            // Generate insights
            generateInsights();
        }
    }

    function updateChart(exercise, entries) {
        const canvas = document.getElementById(`chart-${exercise}`);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        
        canvas.height = 100;

        const labels = entries.map(entry => new Date(entry.date).toLocaleDateString());
        const values = entries.map(entry => entry.value);
        
        // Determine chart colors based on theme
        const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
        const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
        const textColor = isDarkMode ? "#e0e0e0" : "#666";

        new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Progress",
                        data: values,
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4, // Makes the line smooth
                        backgroundColor: "rgba(59, 130, 246, 0.1)" // Light fill under the curve
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: { 
                            display: false,
                            grid: { color: gridColor }
                        },
                        y: { 
                            beginAtZero: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        }
                    },
                    elements: {
                        point: { radius: 2 }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
        });
    }

    function filterEntriesByDateRange(entries, range) {
        const now = new Date();
        
        const last24Hours = new Date(now);
        last24Hours.setHours(now.getHours() - 24); // 24 hours ago from now
        
        const last7Days = new Date(now);
        last7Days.setDate(now.getDate() - 6); // 7 days ago
        
        const last30Days = new Date(now);
        last30Days.setDate(now.getDate() - 29); // 30 days ago
        
        switch (range) {
            case "last24":
                return entries.filter(entry => new Date(entry.date) >= last24Hours);
            case "last7":
                return entries.filter(entry => new Date(entry.date) >= last7Days);
            case "last30":
                return entries.filter(entry => new Date(entry.date) >= last30Days);
            case "all":
            default:
                return entries;
        }
    }

    function generateInsights() {
        if (!insightsGrid) return;
        
        insightsGrid.innerHTML = "";
        const data = dataManager.getEntries();
        const selectedRange = dateRange ? dateRange.value : "last24";
        
        if (Object.keys(data).length === 0) {
            if (insightsContainer) insightsContainer.style.display = "none";
            return;
        }
        
        // Filter data based on selected range
        const filteredData = {};
        let hasData = false;
        
        Object.keys(data).forEach(exercise => {
            const entries = data[exercise] || [];
            const filteredEntries = filterEntriesByDateRange(entries, selectedRange);
            if (filteredEntries.length > 0) {
                filteredData[exercise] = filteredEntries;
                hasData = true;
            }
        });
        
        if (!hasData) {
            if (insightsContainer) insightsContainer.style.display = "none";
            return;
        }
        
        if (insightsContainer) insightsContainer.style.display = "block";
        
        // Generate various insights
        generatePersonalRecordInsights(filteredData);
        generateConsistencyInsights(filteredData);
        generateVolumeInsights(filteredData);
        generateTimeOfDayInsights(filteredData);
        generateProgressTrendInsights(filteredData);
    }
    
    // Helper function to get appropriate card styling based on theme
    function getCardClassName(borderClass = "") {
        const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
        return isDarkMode 
            ? `card bg-gray-800 shadow-sm p-4 border-l-4 ${borderClass} border-r border-t border-b border-gray-700` 
            : `card bg-base-100 shadow-sm p-4 border-l-4 ${borderClass}`;
    }
    
    function generatePersonalRecordInsights(data) {
        if (!insightsGrid) return;
        
        Object.keys(data).forEach(exercise => {
            const entries = data[exercise];
            if (entries.length === 0) return;
            
            // Find max value
            const maxValue = Math.max(...entries.map(e => e.value));
            const maxEntry = entries.find(e => e.value === maxValue);
            const maxDate = new Date(maxEntry.date);
            
            // Check if max is recent (in the last 7 days)
            const isRecent = (new Date() - maxDate) / (1000 * 60 * 60 * 24) < 7;
            
            // Get exercise unit
            const exerciseData = getExerciseData(exercise);
            const unitLabel = getUnitLabel(exerciseData.unit);
            
            // Create insight card
            const insightCard = document.createElement("div");
            insightCard.className = getCardClassName();
            
            let title = `<span class="text-primary font-bold">${exercise.charAt(0).toUpperCase() + exercise.slice(1)}</span> Personal Record`;
            let description = `Your best performance: <span class="text-2xl font-bold">${maxValue} ${unitLabel}</span>`;
            
            if (isRecent) {
                description += `<br><span class="text-success font-medium">🎉 New recent record!</span>`;
            }
            
            description += `<br><span class="text-sm text-gray-500">Achieved on ${maxDate.toLocaleDateString()}</span>`;
            
            insightCard.innerHTML = `
                <h3 class="text-lg font-semibold">${title}</h3>
                <p class="mt-2">${description}</p>
            `;
            
            insightsGrid.appendChild(insightCard);
        });
    }

    function generateConsistencyInsights(data) {
        // Implementation of generateConsistencyInsights function
    }

    function generateVolumeInsights(data) {
        // Implementation of generateVolumeInsights function
    }

    function generateTimeOfDayInsights(data) {
        // Implementation of generateTimeOfDayInsights function
    }

    function generateProgressTrendInsights(data) {
        // Implementation of generateProgressTrendInsights function
    }

    logButton.addEventListener("click", () => {
        if (!entryInput || !exerciseType) return;
        
        const value = parseInt(entryInput.value);
        const exercise = exerciseType.value;

        if (!isNaN(value) && value > 0) {
            // Use selected date if available, otherwise use current date
            let entryDateTime;
            if (entryDate && entryDate.value) {
                entryDateTime = new Date(entryDate.value).toISOString();
            } else {
                entryDateTime = new Date().toISOString();
            }
            
            const entry = { date: entryDateTime, value: value };
            dataManager.saveEntry(exercise, entry);
            entryInput.value = "";
            updateCards();
        } else {
            alert("Please enter a valid number greater than zero.");
        }
    });

    // Add Exercise Button Event Listener
    if (addExerciseButton) {
        addExerciseButton.addEventListener("click", () => {
            if (!newExerciseInput) return;
            
            const newExercise = newExerciseInput.value.trim().toLowerCase();
            const unitType = unitTypeSelect ? unitTypeSelect.value : "reps";
            
            if (newExercise && !document.querySelector(`#exerciseType option[value="${newExercise}"]`)) {
                const option = document.createElement("option");
                option.value = newExercise;
                option.textContent = newExercise.charAt(0).toUpperCase() + newExercise.slice(1);
                option.dataset.unit = unitType;
                
                // Insert before the "Add..." option
                const addOption = document.querySelector('#exerciseType option[value="add"]');
                if (addOption) {
                    exerciseType.insertBefore(option, addOption);
                } else {
                    exerciseType.appendChild(option);
                }
                
                exerciseType.value = newExercise; // Select the new exercise
                newExerciseInput.value = "";
                
                // Save to localStorage
                const customExercises = JSON.parse(localStorage.getItem("exercises")) || {};
                customExercises[newExercise] = { unit: unitType };
                localStorage.setItem("exercises", JSON.stringify(customExercises));
                
                // Update input placeholder
                updateInputPlaceholder();
                
                // Close the collapse panel if it exists
                const toggleNewExercise = document.getElementById("toggleNewExercise");
                if (toggleNewExercise) {
                    toggleNewExercise.checked = false;
                }
            }
        });
    }

    // Date Range Event Listener
    if (dateRange) {
        dateRange.addEventListener("change", () => {
            // Save date range preference
            localStorage.setItem("dateRangePreference", dateRange.value);
            updateCards();
        });
    }

    // Export Link Event Listener
    if (exportLink) {
        exportLink.addEventListener("click", (e) => {
            e.preventDefault();
            
            const data = dataManager.getEntries();
            const selectedRange = dateRange ? dateRange.value : "last24";
            
            // Create a filtered copy of the data
            const filteredData = {};
            Object.keys(data).forEach(exercise => {
                const entries = data[exercise] || [];
                const filteredEntries = filterEntriesByDateRange(entries, selectedRange);
                if (filteredEntries.length > 0) {
                    filteredData[exercise] = filteredEntries;
                }
            });
            
            const dataStr = JSON.stringify(filteredData, null, 2);
            const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
            
            const rangeSuffix = selectedRange === "all" ? "" : "-" + selectedRange;
            const exportFileName = "progress-data" + rangeSuffix + "-" + new Date().toISOString().split("T")[0] + ".json";
            
            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileName);
            linkElement.click();
        });
    }

    // Modal Add Exercise Button Event Listener
    if (modalAddExerciseButton) {
        modalAddExerciseButton.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (!modalNewExercise || !exerciseType) return;
            
            const newExercise = modalNewExercise.value.trim().toLowerCase();
            const unitType = modalUnitType ? modalUnitType.value : "reps";
            
            if (!newExercise) {
                alert("Please enter an exercise name");
                return;
            }
            
            if (document.querySelector(`#exerciseType option[value="${newExercise}"]`)) {
                alert("This exercise already exists");
                return;
            }
            
            const option = document.createElement("option");
            option.value = newExercise;
            option.textContent = newExercise.charAt(0).toUpperCase() + newExercise.slice(1);
            option.dataset.unit = unitType;
            
            // Insert before the "Add..." option
            const addOption = document.querySelector('#exerciseType option[value="add"]');
            if (addOption) {
                exerciseType.insertBefore(option, addOption);
            } else {
                exerciseType.appendChild(option);
            }
            
            exerciseType.value = newExercise; // Select the new exercise
            
            // Save to localStorage
            const customExercises = JSON.parse(localStorage.getItem("exercises")) || {};
            customExercises[newExercise] = { unit: unitType };
            localStorage.setItem("exercises", JSON.stringify(customExercises));
            
            // Update input placeholder
            updateInputPlaceholder();
            
            // Close the modal
            if (addExerciseModal) addExerciseModal.close();
        });
    }

    // Cancel Add Exercise Button Event Listener
    if (cancelAddExerciseButton) {
        cancelAddExerciseButton.addEventListener("click", () => {
            if (addExerciseModal) addExerciseModal.close();
        });
    }

    // Date Picker Button Event Listener
    if (datePickerBtn && dateDropdown) {
        datePickerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!entryDate) return;
            
            // Always set current date/time when the picker is opened
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            
            entryDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            dateDropdown.classList.toggle("hidden");
        });
    }

    // Document Click Event Listener for Dropdown
    document.addEventListener("click", (e) => {
        if (dateDropdown && !dateDropdown.contains(e.target) && e.target !== datePickerBtn) {
            dateDropdown.classList.add("hidden");
        }
    });
    
    // Apply Date Button Event Listener
    if (applyDateButton) {
        applyDateButton.addEventListener("click", () => {
            if (!entryDate || !selectedDateDisplay || !selectedDateContainer || !dateDropdown) return;
            
            if (entryDate.value) {
                const selectedDate = new Date(entryDate.value);
                selectedDateDisplay.textContent = selectedDate.toLocaleString();
                selectedDateContainer.classList.remove("hidden");
            }
            dateDropdown.classList.add("hidden");
        });
    }
    
    // Clear Date Button Event Listener
    if (clearDateButton) {
        clearDateButton.addEventListener("click", () => {
            if (!entryDate || !selectedDateContainer || !dateDropdown) return;
            
            entryDate.value = "";
            selectedDateContainer.classList.add("hidden");
            dateDropdown.classList.add("hidden");
        });
    }

    updateCards();
});