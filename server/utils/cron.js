const config = require('../config/config.json');
const cron = require('node-cron');
const core = require('./infoController');

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
        console.error('\x1b[31mERROR: \x1b[37mFailed to start cron task:', error.message);
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
        console.error('\x1b[31mERROR: \x1b[37mFailed to destroy cron task:', error.message);
        process.exit(1);
    }
};
