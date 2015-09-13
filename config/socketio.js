'use strict';

var eventRegister = require('../app/events');

/**
 * Socket.io configuration
 */
module.exports = function (io) {
    //connection handler
    io.on('connection', function (socket) {
        console.info('Socket: "%s" CONNECTED at ', socket.id, new Date());

        //add events
        eventRegister(socket);

        //on disconnect
        socket.on('disconnect', function () {
            console.info('Socket: "%s" DISCONNECTED at ', socket.id, new Date());
        }); // end disconnect
    });
};