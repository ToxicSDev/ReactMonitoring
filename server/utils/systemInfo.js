const si = require('systeminformation');
const main = require('../server');

exports.cpu = async () => {
    try {
        const cpuUsage = await si.currentLoad();
        return cpuUsage.currentload.toFixed(1);
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to get CPU usage:', error.message);
        return 'N/A';
    }
};

exports.mem = async () => {
    try {
        const memUsage = await si.mem();
        const totalMemory = memUsage.total;
        const usedMemory = memUsage.used;
        const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

        return usedMemoryPercentage.toFixed(1);
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to get memory usage:', error.message);

        process.exit(1);
    }
};

exports.disk = async () => {
    try {
        const diskUsage = await si.fsSize();
        let totalUsedSpace = 0;
        let totalTotalSpace = 0;

        diskUsage.forEach(fs => {
            totalUsedSpace += fs.used;
            totalTotalSpace += fs.size;
        });

        const totalUsedSpacePercentage = (totalUsedSpace / totalTotalSpace) * 100;

        return totalUsedSpacePercentage.toFixed(1);
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to get disk usage:', error.message);

        process.exit(1);
    }
};

exports.graphics = async () => {
    try {
        const graphics = await si.graphics();
        let totalMemoryTotal = 0;
        let totalMemoryFree = 0;

        graphics.controllers.forEach(e => {
            totalMemoryTotal += e.memoryTotal ? e.memoryTotal : 0;
            totalMemoryFree += e.memoryFree ? e.memoryFree : 0;
        });

        const totalMemoryUsed = totalMemoryTotal - totalMemoryFree;

        const totalUsedMemoryPercentage = (totalMemoryUsed / totalMemoryTotal) * 100;

        return totalUsedMemoryPercentage.toFixed(1);
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to get graphics usage:', error.message);

        process.exit(1);
    }
}

exports.battery = async () => {
    try {
        const batteryInfo = await si.battery();
        return batteryInfo.hasbattery ? batteryInfo.percent.toFixed(1) : 'N/A';
    } catch (error) {
        console.error(main.getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to get battery percentage:', error.message);
        
        process.exit(1);
    }
};
