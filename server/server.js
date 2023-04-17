const config = require('./config/config.json');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cron = require('./utils/cron');

const Client = require('./models/client');

const HOST = config.server.Backend.host || 'http://localhost';
const PORT = config.server.Backend.port || 3031;

const clients = [];
io.on('connection', (socket) => {
    const client = new Client(socket);
    clients.push(client);

    if (!cron.getTask()) cron.startTask();
});

http.listen(PORT, () => {
    console.log(`\x1b[36m`);
    console.log(`    \x1b[36m╭────────────────────────────────────────╮`);
    console.log(`    \x1b[36m│      \x1b[31m> SystemMonitoring Started <      \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m            Backend                 \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m                                    \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m      ${HOST}:${PORT}         \x1b[36m│`);
    console.log(`    \x1b[36m╰────────────────────────────────────────╯`);
    console.log(`\x1b[0m`);
}).on('error', (error) => {
    console.error(getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to start server:', error.message);
    process.exit(1);
});

function getCurTimeColored() {
    const now = new Date();

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    return `\x1b[36m${getTimeEdited(day)}/${getTimeEdited(month)}/${year} ${getTimeEdited(hours)}:${getTimeEdited(minutes)}:${getTimeEdited(seconds)}\x1b[37m`;
}

function getTimeEdited(time) {
    return time < 10 ? '0' + time : time;
}

module.exports.clients = clients;
module.exports.getCurTimeColored = getCurTimeColored;
