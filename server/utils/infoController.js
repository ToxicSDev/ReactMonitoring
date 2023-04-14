const config = require('../../config/config.json');
const system = require('./systemInfo');
const main = require('../server');

async function getInformation() {
    const result = {};

    for (const key of Object.keys(config.data)) {
        if (!config.data[key].active) continue;

        try {
            const data = await system[key]();
            result[key] = data;

            const keyName = key.charAt(0).toUpperCase() + key.slice(1);
            if (data >= config.data[key].warning && data < config.data[key].alert) {
                console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is above', config.data[key].warning, '%!');
            }

            if (data >= config.data[key].alert) {
                console.log('\x1b[31mALARM: \x1b[37m', keyName, 'usage is above', config.data[key].alert, '%!');
            }

            if (data == 'N/A' || data == 'NaN') {
                console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is not available!');
            }

            if (data < 0) {
                console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is below 0%!');
            }

        } catch (error) {
            console.error('\x1b[31mERROR: \x1b[37mFailed to get information for', key, ':', error.message);
            process.exit(1);
        }
    }

    return result;
}

function sendInformation(data) {
    main.clients.forEach((e) => e.sendServerData(data));
}

async function run() {
    try {
        let result = await getInformation();
        sendInformation(JSON.parse(JSON.stringify(result)));
    } catch (error) {
        console.error('\x1b[31mERROR: \x1b[37mFailed to run information retrieval:', error.message);
        process.exit(1);
    }
}

module.exports = run;
