const EventEmitter = require('events');

class AppEmitter extends EventEmitter {
    logActivity(page) {
        this.emit('visit', { page, time: new Date().toLocaleString() });
    }
}

module.exports = new AppEmitter();