const config = require('../config/config');
const system = require('./systemInfo');
const main = require('../index');

async function getInformation() {
    const result = {};
    const promises = [];

    for (const key of Object.keys(config.data)) {
        if (!config.data[key].active) continue;
        if (!typeof system[key] == 'function') continue;

        const data = await system[key]();
        result[key] = data;
    }

    return result;
}

function sendInformation(data) {
    main.clients.forEach((e) => e.sendServerData(data));
}

async function run() {
    let result = await getInformation();
    sendInformation(JSON.parse(JSON.stringify(result)));
}

module.exports = run;