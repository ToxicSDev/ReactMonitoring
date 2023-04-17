const config = require('../config/config.json');
const cron = require('node-cron');
const core = require('./infoController');
const main = require('../server');

let task;

exports.getTask = () => task;

exports.startTask = () => {
    try {
        let sec = config.server.refreshRate;
        if (sec < 1) sec = 10;
        core();
        task = cron.schedule(`*/${sec} * * * * *`, () => {
            core();
        });
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to start cron task:', error.message);
        process.exit(1);
    }
};

exports.destroyTask = () => {
    try {
        if (task) {
            task.destroy();
            task = null;
        }
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to destroy cron task:', error.message);
        process.exit(1);
    }
};
