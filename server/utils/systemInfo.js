const si = require('systeminformation');

exports.cpu = async () => {
    try {
        const cpuUsage = await si.currentLoad();
        return cpuUsage.currentload.toFixed(1);
    } catch (error) {
        console.error('\x1b[31mERROR: \x1b[37mFailed to get CPU usage:', error.message);
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
        console.error('\x1b[31mERROR: \x1b[37mFailed to get memory usage:', error.message);

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
        console.error('\x1b[31mERROR: \x1b[37mFailed to get disk usage:', error.message);

        process.exit(1);
    }
};

exports.battery = async () => {
    try {
        const batteryInfo = await si.battery();
        return batteryInfo.hasbattery ? batteryInfo.percent.toFixed(1) : 'N/A';
    } catch (error) {
        console.error('\x1b[31mERROR: \x1b[37mFailed to get battery percentage:', error.message);
        
        process.exit(1);
    }
};
