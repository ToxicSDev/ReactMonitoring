module.exports = {
    data: {
        cpu: {
            active: true,
        },
        mem: {
            active: true,
        },
        disk: {
            active: true,
        },
    },
    server: {
        port: 3030,
        refreshRate: 10
    },
    limits: {
        cpu: {
            max: 50,
        },
        mem: {
            max: 40,
        },
        disk: {
            max: 40,
        },
    },
};
