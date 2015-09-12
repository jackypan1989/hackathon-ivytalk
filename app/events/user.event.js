'use stricts';

/**
 * Module dependencies.
 */
var User = require('../models/user.model'),
	async = require('async'),
	errService = require('../../services/error');

module.exports = function (socket) {
	/**
	 * user:register
	 * @params: userId, name, gender
	 * @ack: user
	 */
	socket.on('user:register', function (data, ack) {
		var userId = data.userId;
		async.waterfall([
			function (callback) {
				User.findOne({
					userId: userId
				}, callback);
			},
			function (user, callback) {
				if (user) return callback(null, user, 0);
				user = new User(data);
				user.save(callback);
			}
		], function (err, user, numberAffected) {
			if (err) return errService(socket, 'REGISTER_ERR', err);
			socket.user = user;
			socket.join(userId);
			ack(user);
		});
	});
}