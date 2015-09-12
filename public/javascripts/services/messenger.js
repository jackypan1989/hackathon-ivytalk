angular.module('ivyTalk')
.factory('Messenger', function () {
	var USER_REGISTER = 'user:register',
		MESSAGE_LIST = 'message:list',
		MESSAGE_CREATE = 'message:create',
		socket = io.connect(),
		convs = {},
		listeners = [];

	function handleError (error) {
		alert(error.err_description);
	}

	function initConv (userId) {
		if (!convs[userId]) {
			convs[userId] = {
				messages: [],
				score: 0
			};
		}
	}

	function pushMessage (userId, message) {
		initConv(userId);

		if (Array.isArray(message)) {
			convs[userId].messages.concat(message);
		} else {
			convs[userId].push(message);
		}
	}

	socket.on('message', function (data) {
		var from = data.from,
			message = data.message;

		listeners.forEach(function (listener) {
			listener(from, message);
		});
	});

	return {
		socket: socket,

		convs: convs,

		user: null,

		registerUser: function (user) {
			var that = this;
			socket.emit(USER_REGISTER, user, function (err, data) {
				if (err) return handleError(err);
				that.user = data;
				console.log(data);
			});
		},

		registerListener: function (listener) {
			listeners.push(listener);
		},

		listMessages: function (userId, cb) {
			socket.emit(MESSAGE_LIST, {
				userId: userId
			}, function (err, messages) {
				if (err) {
					handleError(err);
					cb(err);
				} else {
					pushMessage(userId, messages);
					cb(null, messages);
				}
			});
		},

		createMessage: function (userId, content, cb) {
			socket.emit(MESSAGE_CREATE, {
				userId: userId,
				content: content
			}, function (err, message) {
				if (err) {
					handleError(err);
					cb(err);
				} else {
					pushMessage(userId, message);
					cb(null, message);
				}
			});
		}
	};
});