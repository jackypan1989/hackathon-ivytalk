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

	function initConv (targetId) {
		if (!convs[targetId]) {
			convs[targetId] = {
				messages: [],
				score: 0
			};
		}
	}

	function pushMessage (targetId, message) {
		initConv(targetId);
		if (Array.isArray(message)) {
			convs[targetId].messages.concat(message);
		} else {
			convs[targetId].messages.push(message);
		}
		console.log(convs);
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
				console.log("Registered Successfully: " + data.name);
				console.log(data);
			});
		},

		registerListener: function (listener) {
			listeners.push(listener);
		},

		// listMessages: function (userId, targetId, cb) {
		// 	socket.emit(MESSAGE_LIST, {
		// 		userId: userId
		// 	}, function (err, messages) {
		// 		if (err) {
		// 			handleError(err);
		// 			cb(err);
		// 		} else {
		// 			pushMessage(userId, targetId, messages);
		// 			cb(null, messages);
		// 		}
		// 	});
		// },

		createMessage: function (targetId, content, cb) {
			socket.emit(MESSAGE_CREATE, {
				userId: targetId,
				content: content
			}, function (err, message) {
				if (err) {
					handleError(err);
					cb(err);
				} else {
					console.log("done createMessage: "+ message);
					pushMessage(targetId, message);
					cb(null, message);
				}
			});
		}
	};
});