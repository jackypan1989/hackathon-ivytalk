var userEvent = require('./user.event'),
	chatEvent = require('./chat.event');

module.exports = function (socket) {
	userEvent(socket);
	chatEvent(socket);
};