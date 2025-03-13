let chartInstance = null;

function updateProgressChart(entries) {
    const ctx = document.getElementById("progressChart").getContext("2d");
    
    const labels = entries.map(entry => new Date(entry.date).toLocaleString());
    const values = entries.map(entry => entry.value);

    if (chartInstance) {
        chartInstance.destroy(); // Clear previous chart
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Progress Over Time",
                data: values,
                borderColor: "blue",
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Date & Time" } },
                y: { title: { display: true, text: "Reps" }, beginAtZero: true }
            }
        }
    });
}
