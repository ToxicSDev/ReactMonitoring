let config;

function fetchConfigData(callback) {
    fetch('/config')
        .then(response => response.json())
        .then(configData => {
            config = configData;
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Failed to load config.json:', error);
        });
}


fetchConfigData(() => {
    var socket = io(config.server.Backend.host + ':' + config.server.Backend.port);
    socket.on('info', data => {
        let container = document.getElementById('chart-container');
        container.innerHTML = '';
        container.classList.add("active");
        for (const key of Object.keys(data)) {
            if (key === 'cpu') {
                generatePieChart('Cpu Usage', key, data[key], container);
            } else if (key === 'mem') {
                generatePieChart('Memory Usage', key, data[key], container);
            } else if (key === 'disk') {
                generatePieChart('Disk Usage', key, data[key], container);
            }
        }
    });
});

function generatePieChart(chartTitle, key, chartData, container) {

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

    if (chartData < config.data[key].warning) {
        status = "Normal";
        statusTitle.classList.add('normal');
    } else if (chartData >= config.data[key].warning && chartData < config.data[key].alert) {
        status = "Warning";
        statusTitle.classList.add('warning');
    } else if (chartData >= config.data[key].alert) {
        status = "Alert";
        statusTitle.classList.add('alert');
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