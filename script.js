document.addEventListener('DOMContentLoaded', (event) => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(jsonData => {
            // Extracting data from JSON
            const authorWorklog = jsonData.data.AuthorWorklog;
            const totalActivity = authorWorklog.rows[0].totalActivity;
            const dayWiseActivity = authorWorklog.rows[0].dayWiseActivity;

            // Update statistics in the HTML
            totalActivity.forEach(activity => {
                const element = document.getElementById(activity.name.toLowerCase().replace(/ /g, '-'));
                if (element) {
                    element.innerText = activity.value;
                }
            });

            // Data for the charts
            const labels = dayWiseActivity.map(activity => activity.date);
            const datasets = authorWorklog.activityMeta.map(meta => {
                return {
                    label: meta.label,
                    backgroundColor: meta.fillColor,
                    borderColor: meta.fillColor,
                    borderWidth: 1,
                    data: dayWiseActivity.map(activity => {
                        const item = activity.items.children.find(child => child.label === meta.label);
                        return item ? parseInt(item.count) : 0;
                    })
                };
            });

            // Line chart for activity
            const activityChart = new Chart(document.getElementById('activityChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Column chart for activity
            const columnChart = new Chart(document.getElementById('columnChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Bar chart for activity
            const barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    indexAxis: 'y', // This makes the bar chart horizontal
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Show initial chart (line chart)
            showChart('activityChart');
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
});

// Function to show the selected chart
function showChart(chartId) {
    const charts = document.querySelectorAll('canvas');
    charts.forEach(chart => {
        chart.style.display = chart.id === chartId ? 'block' : 'none';
    });
}