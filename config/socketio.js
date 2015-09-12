'use strict';

/**
 * Socket.io configuration
 */
module.exports = function (io) {
    //connection handler
    io.on('connection', function (socket) {
        var userId = Math.floor(Math.random() * 10000);

        console.info('User: "%s" CONNECTED at ', new Date());

        socket.on('user:register', function (data) {
            var userId = data.userId;
            // join room & attach event listeners
            socket.userId = userId;
            socket.join(userId);
        });

        //on disconnect
        socket.on('disconnect', function () {
            console.info('User: "%s" DISCONNECTED at ', socket.userId, new Date());
        }); // end disconnect
    });
};