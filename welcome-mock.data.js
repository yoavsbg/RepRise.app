// welcome-mock.data.js - Mock data generator for RepRise.app welcome page

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
    card.className = "card bg-base-100 shadow-md p-4 rounded-lg mb-6";
    
    // Calculate stats from entries
    const maxValue = Math.max(...entries.map(e => e.value));
    const totalValue = entries.reduce((sum, e) => sum + e.value, 0);
    
    // Add goal progress bar (optional)
    const goalValue = 30; // Mock goal value
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
    
    // Build card HTML
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold">${exercise.charAt(0).toUpperCase() + exercise.slice(1)}</h3>
            <button class="btn btn-xs btn-ghost" disabled>
                Edit Goal
            </button>
        </div>
        ${goalHtml}
        <h2 class="text-2xl text-primary font-bold">Max: ${maxValue} ${unitLabel}</h2>
        <h3 class="text-lg text-gray-600">Total: ${totalValue} ${unitLabel}</h3>
        <p class="text-gray-500">${new Date().toLocaleString()}</p>
        <canvas id="chart-${exercise}" class="mt-4"></canvas>
    `;
    
    // Add card to container
    mockCardContainer.appendChild(card);
    
    // Create chart
    setTimeout(() => createMockChart(exercise, entries), 100);
}

// Generate mock entries data
function generateMockEntries() {
    const entries = [];
    const now = new Date();
    
    // Sample realistic pushup progression over 14 days
    const mockValues = [12, 15, 13, 17, 15, 18, 16, 20, 19, 22, 21, 24, 23, 25];
    
    for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(Math.floor(Math.random() * 12) + 8); // Random time between 8am and 8pm
        
        entries.push({
            date: date.toISOString(),
            value: mockValues[13 - i]
        });
    }
    
    return entries;
}

// Create chart using Chart.js (just like in the main app)
function createMockChart(exercise, entries) {
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

// Initialize the mock data when the DOM is loaded
document.addEventListener("DOMContentLoaded", createMockExerciseCard); 