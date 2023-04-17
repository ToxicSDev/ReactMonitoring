const cron = require('../utils/cron');
const { getCurTimeColored } = require('../utils/timeUtils');

class Client {
    /**
     * @param  {SocketIO.Socket} client
     */
    constructor (client) {
        this.socket = client;
        console.log(getCurTimeColored(), '\t\x1b[36mINFO\x1b[37m\t\t Client connected!');
        this.client = this;

        client.on('disconnect', () => {
            this.remove.bind(this);
            console.log(getCurTimeColored(), '\t\x1b[36mINFO\x1b[37m\t\t Client disconnected!');
        });
    }

    sendServerData(data) {
        try {
            this.socket.emit('info', data);
        } catch (error) {
            console.error(getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to send server data:', error.message);
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
            console.error(getCurTimeColored(), '\t\x1b[31mERROR\x1b[37m\t\tFailed to remove client:', error.message);
            process.exit(1);
        }
    }
}

module.exports = Client;
