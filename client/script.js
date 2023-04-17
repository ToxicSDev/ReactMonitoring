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
            generatePieChart(key, data[key], container);
        }
    });
});

function generatePieChart(key, percentage, container) {

    const chartTitle = config.data[key].chart.title;
    const dataLabel = config.data[key].chart.dataLabel;
    const remainingLabel = config.data[key].chart.remainingLabel;

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

    if (percentage < config.data[key].warning) {
        status = "Normal";
        statusTitle.classList.add('normal');
    } else if (percentage >= config.data[key].warning && percentage < config.data[key].alert) {
        status = "Warning";
        statusTitle.classList.add('warning');
    } else if (percentage >= config.data[key].alert) {
        status = "Alert";
        statusTitle.classList.add('alert');
    }
    statusTitle.textContent = status;
    chartDiv.appendChild(statusTitle);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [dataLabel, remainingLabel],
            datasets: [{
                data: [percentage, (100 - percentage)],
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