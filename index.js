const config = require('./config/config');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cron = require('./server/cron');

const Client = require('./server/models/client');
const indexRoute = require('./server/routes/router');

const PORT = config.server.port || 3030;
const clients = [];
app.use(express.json());
app.use('/', indexRoute);

io.on('connection', (socket) => {
    const client = new Client(socket);
    clients.push(client);

    if (!cron.getTask()) cron.startTask();
});

http.listen(PORT, () => {
    console.log(`\x1b[36m`);
    console.log(`    \x1b[36m╭────────────────────────────────────────╮`);
    console.log(`    \x1b[36m│      \x1b[37m> SystemMonitoring Started <      \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m                                    \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m      http://localhost:${PORT}         \x1b[36m│`);
    console.log(`    \x1b[36m╰────────────────────────────────────────╯`);
    console.log(`\x1b[0m`);
});

module.exports.clients = clients;
