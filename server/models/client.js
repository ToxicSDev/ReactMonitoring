const main = require('../../index');
const cron = require('../cron');
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
        this.socket.emit('info', data);
    }

    remove() {
        const index = main.clients.findIndex(
            (val) => val.socket.id == this.socket.id
        );
        if (index != -1) main.clients.splice(index, 1);
        if (main.clients.length == 0) cron.destroyTask();
    }
}

module.exports = Client;
