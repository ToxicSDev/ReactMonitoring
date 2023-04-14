const main = require('../../server');
const cron = require('../utils/cron');

class Client {
    /**
     * @param  {SocketIO.Socket} client
     */
    constructor (client) {
        this.socket = client;
        console.log('\x1b[36mINFO: \x1b[37mClient connected!');
        this.client = this;

        client.on('disconnect', () => {
            this.remove.bind(this);
            console.log('\x1b[36mINFO: \x1b[37mClient disconnected!');
        });
    }

    sendServerData(data) {
        try {
            this.socket.emit('info', data);
        } catch (error) {
            console.error('\x1b[31mERROR: \x1b[37mFailed to send server data:', error.message);
            process.exit(1);
        }
    }

    remove() {
        try {
            const index = main.clients.findIndex(
                (val) => val.socket.id == this.socket.id
            );
            if (index != -1) main.clients.splice(index, 1);
            if (main.clients.length == 0) cron.destroyTask();
        } catch (error) {
            console.error('\x1b[31mERROR: \x1b[37mFailed to remove client:', error.message);
            process.exit(1);
        }
    }
}

module.exports = Client;
