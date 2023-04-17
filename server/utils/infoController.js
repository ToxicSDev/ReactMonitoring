const config = require('../config/config.json');
const system = require('./systemInfo');
const main = require('../server');

function processData(key, data) {
    const keyName = key.charAt(0).toUpperCase() + key.slice(1);

    // Checks if data is valid
    if (data == 'N/A' || data == 'NaN') {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is not available!');
        return false;
    }

    if (data < 0) {
        console.log('\x1b[31mAlert: \x1b[37m', keyName, 'usage is below 0%!');
        return false;
    }

    // Checks if data is below warning or alert levels
    if (config.data[key].inverted) {
        if (data <= config.data[key].warning && data > config.data[key].alert) {
            console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is below', config.data[key].warning, '%!');
        }

        if (data <= config.data[key].alert) {
            console.log('\x1b[31mALARM: \x1b[37m', keyName, 'usage is below', config.data[key].alert, '%!');
        }
    }

    // Checks if data is above warning or alert levels
    if (data >= config.data[key].warning && data < config.data[key].alert) {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is above', config.data[key].warning, '%!');
    }

    if (data >= config.data[key].alert) {
        console.log('\x1b[31mALARM: \x1b[37m', keyName, 'usage is above', config.data[key].alert, '%!');
    }

    return true;
}

async function getInformation() {
    const result = {};

    for (const key of Object.keys(config.data)) {
        if (!config.data[key].active) continue;

        try {
            const data = await system[key]();

            if(!processData(key, data)) {
                continue;
            }

            result[key] = data;
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