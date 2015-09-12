var users = require('./user.event');

module.exports = function (socket) {
	users(socket);
};