var socket = io('http://localhost:3031');
socket.on('info', data => {
    let container = document.getElementById('chart-container');
    container.innerHTML = '';
    container.classList.add("active");
    for (const key of Object.keys(data)) {
        if (key === 'cpu') {
            generatePieChart('Cpu Usage', data[key], container);
        } else if (key === 'mem') {
            generatePieChart('Memory Usage', data[key], container);
        } else if (key === 'disk') {
            generatePieChart('Disk Usage', data[key], container);
        }
    }
});

function generatePieChart(chartTitle, chartData, container) {

    var chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    container.appendChild(chartDiv);

    var titleElement = document.createElement('h2');
    titleElement.textContent = chartTitle;
    chartDiv.appendChild(titleElement);

    var inElement = document.createElement('div');
    inElement.className = 'chart-in';
    chartDiv.appendChild(inElement);

    var canvas = document.createElement('canvas');
    inElement.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var statusTitle = document.createElement('h2');
    statusTitle.className = 'status';

    if (chartData < 50) {
        status = "Normal";
        statusTitle.classList.add('normal');
    } else if (chartData >= 50 && chartData <= 75) {
        status = "Warning";
        statusTitle.classList.add('warning');
    } else if (chartData > 75) {
        status = "Alarm";
        statusTitle.classList.add('Alarm');
    }
    statusTitle.textContent = status;
    chartDiv.appendChild(statusTitle);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                data: [chartData, (100 - chartData)],
                backgroundColor: ['#ff6384', '#36a2eb'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: chartTitle
            }
        }
    });
}