const config = require('./config/config.json');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cron = require('./utils/cron');

const Client = require('./models/client');
const { getCurTimeColored } = require('./utils/timeUtils');

const HOST = config.server.Backend.host || 'backend';
const PORT = config.server.Backend.port || 3031;

const clients = [];
io.on('connection', (socket) => {
    const client = new Client(socket);
    clients.push(client);

    if (!cron.getTask()) cron.startTask();
});

http.listen(PORT, HOST, () => {
    console.log(`\x1b[36m`);
    console.log(`    \x1b[36m╭────────────────────────────────────────╮`);
    console.log(`    \x1b[36m│      \x1b[31m> SystemMonitoring Started <      \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m            Backend                 \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m                                    \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m          ${HOST}:${PORT}              \x1b[36m│`);
    console.log(`    \x1b[36m╰────────────────────────────────────────╯`);
    console.log(`\x1b[0m`);
}).on('error', (error) => {
    console.error(getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to start server:', error.message);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Gracefully shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Gracefully shutting down...');
    process.exit(0);
});

module.exports.clients = clients;
