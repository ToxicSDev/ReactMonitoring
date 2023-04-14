const config = require('./config/config.json');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cron = require('./server/cron');

const Client = require('./server/models/client');

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
    console.error('\x1b[31mERROR: \x1b[37mFailed to start server:', error.message);
    process.exit(1);
});

module.exports.clients = clients;
