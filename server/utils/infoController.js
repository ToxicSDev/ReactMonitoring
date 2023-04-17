const config = require('../config/config.json');
const system = require('./systemInfo');
const main = require('../server');

async function getInformation() {
    const result = {};

    for (const key of Object.keys(config.data)) {
        if (!config.data[key].active) continue;

        try {
            const warning_level = config.data[key].warning;
            const alert_level = config.data[key].alert;
            const percent = await system[key]();

            let status = "";

            if (key == 'battery')
                status = checkBattery(percent, warning_level, alert_level);
            else
                status = checkItemsWithUsage(percent, warning_level, alert_level);

            // result[key] = { 'status': status, 'percent': percent };
            result[key] = percent;

        } catch (error) {
            console.error('\x1b[31mERROR: \x1b[37mFailed to get information for', key, ':', error.message);
            process.exit(1);
        }
    }

    return result;
}

function checkBattery(percent, warning_level, alert_level) {
    const keyName = key.charAt(0).toUpperCase() + key.slice(1);
    var status = "normal";

    if (percent == 'N/A' || percent == 'NaN') {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'is not available!');
        status = "warning";
    }else if (warning_level >= percent && percent < alert_level) {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'is under', warning_level, '%!');
        status = "warning";
    }else if (percent < 0) {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'is below 0%!');
        status = "warning";
    } else if (alert_level >= percent) {
        console.log('\x1b[31mALARM: \x1b[37m', keyName, 'is critically low ->', alert_level, '%!');
        status = "alert";
    }

    return status;
}

function checkItemsWithUsage(percent, warning_level, alert_level) {
    const keyName = key.charAt(0).toUpperCase() + key.slice(1);
    var status = "normal";
    
    if (percent == 'N/A' || percent == 'NaN') {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is not available!');
        status = "warning";
    }else if (percent >= warning_level && percent < alert_level) {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is above', warning_level, '%!');
        status = "warning";
    }else if (percent < 0) {
        console.log('\x1b[33mWARNING: \x1b[37m', keyName, 'usage is below 0%!');
        status = "warning";
    }else if (percent >= alert_level) {
        console.log('\x1b[31mALARM: \x1b[37m', keyName, 'usage is above', alert_level, '%!');
        status = "alert";
    }

    return status;
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
