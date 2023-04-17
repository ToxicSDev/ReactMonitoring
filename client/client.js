const express = require('express');
const favicon = require('serve-favicon');
const config = require('./config/config.json');

const HOST = config.server.Frontend.host || 'http://frontend';
const PORT = config.server.Frontend.port || 3030;

const app = express();
const http = require('http').createServer(app);

const indexRoute = require('./routes/index');

app.use(express.json());
app.use(express.static('./'));
app.use(favicon('./assets/favicon.ico'));
app.use('/', indexRoute);

http.listen(PORT, () => {
    console.log(`\x1b[36m`);
    console.log(`    \x1b[36m╭────────────────────────────────────────╮`);
    console.log(`    \x1b[36m│      \x1b[31m> SystemMonitoring Started <      \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m           Frontend                 \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m                                    \x1b[36m│`);
    console.log(`    \x1b[36m│    \x1b[37m      ${HOST}:${PORT}         \x1b[36m│`);
    console.log(`    \x1b[36m╰────────────────────────────────────────╯`);
    console.log(`\x1b[0m`);
}).on('error', (error) => {
    console.error('\x1b[31mERROR: \x1b[37mFailed to start server:', error.message);
    process.exit(1);
});