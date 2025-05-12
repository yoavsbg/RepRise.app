// welcome-mock.data.js - Mock data generator for RepsRise.app welcome page

// Generate and display a mock pushups exercise card with chart
function createMockExerciseCard() {
    // Get the container for the mock card
    const mockCardContainer = document.getElementById("mockCardContainer");
    if (!mockCardContainer) return;
    
    // Clear container
    mockCardContainer.innerHTML = "";
    
    // Create mock data
    const exercise = "pushups";
    const unitLabel = "reps";
    
    // Generate mock entries for the last 14 days
    const entries = generateMockEntries();
    
    // Create card element
    const card = document.createElement("div");
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    card.className = isDarkMode 
        ? "card bg-gray-800 shadow-md p-4 rounded-lg mb-6 border border-gray-700" 
        : "card bg-base-100 shadow-md p-4 rounded-lg mb-6";
    
    // Calculate stats from entries
    const maxValue = Math.max(...entries.map(e => e.value));
    const totalValue = entries.reduce((sum, e) => sum + e.value, 0);
    
    // Add goal progress bar (optional)
    const goalValue = 50; // Mock goal value
    const progress = Math.min(100, Math.round((maxValue / goalValue) * 100));
    const progressColorClass = progress >= 100 ? "progress-success" : "progress-primary";
    
    const goalHtml = `
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
    
    // Add card content
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold">${exercise.charAt(0).toUpperCase() + exercise.slice(1)}</h3>
            <button class="btn btn-xs btn-ghost set-goal-btn" data-exercise="${exercise}">
                Set Goal
            </button>
        </div>
        ${goalHtml}
        <h2 class="text-2xl text-primary font-bold">Max: ${maxValue} ${unitLabel}</h2>
        <canvas id="chart-${exercise}" class="mt-4"></canvas>
    `;
    
    // Append card to container
    mockCardContainer.appendChild(card);
    
    // Create chart
    setTimeout(() => createMockChart(exercise, entries), 100);
}

// Generate mock entries for the chart
function generateMockEntries() {
    const entries = [];
    const today = new Date();
    
    // Generate entries for the last 14 days
    for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Generate realistic-looking data with a slight upward trend
        let value;
        if (i > 10) {
            value = Math.floor(Math.random() * 5) + 10; // Start lower
        } else if (i > 5) {
            value = Math.floor(Math.random() * 10) + 15; // Increase slightly
        } else {
            value = Math.floor(Math.random() * 15) + 20; // Finish higher
        }
        
        // Occasionally add a "breakthrough" day
        if (i === 2) {
            value = 45; // A recent breakthrough
        }
        
        entries.push({ date: date.toISOString(), value });
    }
    
    return entries;
}

// Create a mock chart for the welcome page
function createMockChart(exercise, entries) {
    const canvas = document.getElementById(`chart-${exercise}`);
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.height = 100;
    
    const labels = entries.map(entry => {
        const date = new Date(entry.date);
        return date.toLocaleDateString();
    });
    
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
                borderColor: "#3b82f6", // Blue color
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Makes the line smooth
                backgroundColor: "rgba(59, 130, 246, 0.1)" // Light blue fill
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

// Initialize when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
    createMockExerciseCard();
}); 