'use strict';

var eventRegister = require('../app/events');

/**
 * Socket.io configuration
 */
module.exports = function (io) {
    //connection handler
    io.on('connection', function (socket) {
        console.info('User: "%s" CONNECTED at ', new Date());

        //add events
        eventRegister(socket);

        //on disconnect
        socket.on('disconnect', function () {
            console.info('User: "%s" DISCONNECTED at ', socket, new Date());
        }); // end disconnect
    });
};