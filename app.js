let chartInstance = null;

document.getElementById('rollBtn').addEventListener('click', () => {
    const numDice = parseInt(document.getElementById('numDice').value);
    const numRolls = parseInt(document.getElementById('numRolls').value);

    if (isNaN(numDice) || numDice < 1 || numDice > 10) {
        alert("Please enter a valid number of dice (1-10).");
        return;
    }
    
    if (isNaN(numRolls) || numRolls < 1) {
        alert("Please enter a valid number of rolls.");
        return;
    }

    simulateDice(numDice, numRolls);
});

function simulateDice(numDice, numRolls) {
    const minSum = numDice;
    const maxSum = numDice * 6;
    const frequencies = {};

    // Initialize frequencies to 0 for all possible sums
    for (let i = minSum; i <= maxSum; i++) {
        frequencies[i] = 0;
    }

    // Roll the dice and calculate sum for each roll
    for (let i = 0; i < numRolls; i++) {
        let currentSum = 0;
        for (let d = 0; d < numDice; d++) {
            currentSum += Math.floor(Math.random() * 6) + 1; // Random number 1-6
        }
        frequencies[currentSum]++;
    }

    // Prepare data for UI and Chart
    const labels = [];
    const dataCounts = [];
    
    let statsHtml = `<h3>Simulation Statistics</h3>`;
    statsHtml += `<p>Total Rolls: <strong>${numRolls.toLocaleString()}</strong> | Dice per Roll: <strong>${numDice}</strong></p>`;
    statsHtml += `<div class="stats-grid">`;

    for (let i = minSum; i <= maxSum; i++) {
        labels.push(i);
        dataCounts.push(frequencies[i]);
        
        // Calculate experimental probability
        const probability = ((frequencies[i] / numRolls) * 100).toFixed(2);
        
        statsHtml += `
            <div class="stat-card">
                Sum <strong>${i}</strong>
                <div>Count: ${frequencies[i].toLocaleString()}</div>
                <div>Prob: ${probability}%</div>
            </div>`;
    }
    statsHtml += `</div>`;
    
    // Output numerical results clearly
    document.getElementById('stats').innerHTML = statsHtml;

    // Output visual results (Chart)
    updateChart(labels, dataCounts, numDice);
}

function updateChart(labels, data, numDice) {
    const ctx = document.getElementById('resultChart').getContext('2d');

    // Destroy existing chart to prevent overlap
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency of Sums',
                data: data,
                backgroundColor: 'rgba(243, 178, 41, 0.8)', // Gold
                borderColor: 'rgba(0, 45, 98, 1)', // Navy Blue
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: numDice === 1 ? 'Uniform Distribution (1 Die)' : 'Normal-like Distribution (Multiple Dice)',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `Frequency: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Occurrences',
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sum of Dice',
                        font: { weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Waiting for user input instead of default simulation on load
// Removed window.addEventListener('DOMContentLoaded', ...);