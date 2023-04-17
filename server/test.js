const si = require('systeminformation');

async function tester() {
    const batteryInfo = await si.battery();

    return batteryInfo.hasbattery ? batteryInfo.percent.toFixed(1) : 'N/A';
}

async function tester_tester() {
    const r = await tester();
    console.log(r);
}

tester_tester();