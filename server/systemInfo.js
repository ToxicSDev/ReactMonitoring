const si = require('systeminformation');

exports.cpu = async () => {
    const cpuUsage = await si.currentLoad();

    return cpuUsage.currentload.toFixed(1);
};

exports.mem = async () => {
    const memUsage = await si.mem();
    const totalMemory = memUsage.total;
    const usedMemory = memUsage.used;
    const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

    return usedMemoryPercentage.toFixed(1);
};

exports.disk = async () => {
    const diskUsage = await si.fsSize();
    let totalUsedSpace = 0;
    let totalTotalSpace = 0;

    diskUsage.forEach(fs => {
        totalUsedSpace += fs.used;
        totalTotalSpace += fs.size;
    });

    const totalUsedSpacePercentage = (totalUsedSpace / totalTotalSpace) * 100;

    return totalUsedSpacePercentage.toFixed(1);
};