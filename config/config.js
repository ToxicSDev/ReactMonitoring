module.exports = {
    data: {
        cpu: {
            active: true,
            activeFields: ['manufacturer', 'brand', 'speed', 'cores', 'physicalCores', 'socket'],
        },
        cpuCurrentspeed: {
            active: false,
        },
        mem: {
            active: true,
        },
        disk: {
            active: true,
        },
        network: {
            active: true,
        },
    },
    server: {
        port: 3030,
        refreshRate: 10
    },
};
