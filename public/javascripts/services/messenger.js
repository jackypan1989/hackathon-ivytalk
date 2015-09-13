angular.module('ivyTalk')
.factory('Messenger', function () {
	var USER_REGISTER = 'user:register',
		MESSAGE_LIST = 'message:list',
		MESSAGE_CREATE = 'message:create',
		socket = io.connect(),
		convs = {},
		listeners = [],
		me = null;

	function handleError (error) {
		alert(error.err_description);
	}

	function initConv (targetId) {
		if (!convs[targetId]) {
			convs[targetId] = {
				messages: [],
				my_total_score: 0,
				my_scores: [],
				target_total_score: 0,
				target_scores:[]
			};
		}
	}

	function isMyMsg (msg) {
		return me && me._id === msg.from;
	}

	function pushMessage (targetId, message) {
		initConv(targetId);
		convs[targetId].messages.push(message);
		if (isMyMsg(message)) {
			convs[targetId].my_total_score += message.senti_score;
			convs[targetId].my_scores.push(message.senti_score);
		} else {
			convs[targetId].target_total_score += message.senti_score;
			convs[targetId].target_scores.push(message.senti_score);
		}
		console.log(convs[targetId]);
	}	

	listeners.push(function (from, message) {
		pushMessage(from.userId, message);
	});

	socket.on('message', function (data) {
		listeners.forEach(function (listener) {
			listener(data.from, data.message);
		});
	});

	return {
		socket: socket,

		convs: convs,

		user: null,

		initConv: initConv,

		pushMessage: pushMessage,

		isMyMsg: isMyMsg,

		registerUser: function (user, cb) {
			var that = this;
			socket.emit(USER_REGISTER, user, function (err, data) {
				if (err) return handleError(err.err_description);
				that.user = data;
				me = data;
				if (cb) cb();
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
					pushMessage(targetId, message);
					cb(null, message);
				}
			});
		}
	};
});