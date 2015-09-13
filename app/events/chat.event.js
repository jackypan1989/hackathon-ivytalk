/**
 * Module dependencies.
 */
var User = require('../models/user.model'),
	Conversation = require('../models/Conversation.model'),
	Message = require('../models/Message.model'),
	async = require('async'),
	errService = require('../../services/error');

function initConv (socket, toUserId, cb) {
	var from = socket.user,
		toUser;
	async.waterfall([
		function (callback) {
			User.findOne({
				userId: toUserId
			}, callback);
		},
		function (user, callback) {
			if (!user) return cb('USER_NOT_FOUND');
			Conversation.loadOne(from, user, callback);
		}
	], cb);
}

module.exports = function (socket) {
	/**
	 * message:list
	 * @params: userId
	 * @ack: messages
	 */
	socket.on('message:list', function (data, ack) {
		var toUserId = data.userId;

		async.waterfall([
			function (callback) {
				initConv(socket, toUserId, callback);
			},
			function (conv, callback) {
				Message.find({
					conversation: conv._id
				})
				.populate('from')
				.sort('createAt')
				.exec(callback);
			}
		], function (err, messages) {
			if (err) return ack(errService(err));
			ack(null, messages);
		});
	});

	/**
	 * message:create
	 * @params: userId, content
	 * @broadcast: from, message, conv
	 * @ack: message, conversation
	 */
	socket.on('message:create', function (data, ack) {
		var from = socket.user,
			toUserId = data.userId,
			content = data.content;
		async.waterfall([
			function (callback) {
				initConv(socket, toUserId, callback);
			},
			function (conv, callback) {
				new Message({
					from: from._id,
					content: content,
					createAt: Date.now(),
					conversation: conv._id
				}).save(function (err, message) {
					callback(err, message, conv);
				});
			}
		], function (err, message, conv) {
			if (err) return ack(errService(err));
			socket.broadcast.to(toUserId).emit('message', {
				from: from,
				message: message
			});
			ack(null, message);
		});
	});
};