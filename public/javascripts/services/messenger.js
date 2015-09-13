angular.module('ivyTalk')
.factory('Messenger', function () {
	var USER_REGISTER = 'user:register',
		MESSAGE_LIST = 'message:list',
		MESSAGE_CREATE = 'message:create',
		MESSAGE_SCORE = 'message:score',
		socket = io.connect(),
		convs = {},
		listeners = [],
		me = null,
		AVG_RESP_NUM = 3;

	function handleError (error) {
		alert(error.err_description);
	}

	function initConv (targetId) {
		if (!convs[targetId]) {
			convs[targetId] = {
				messages: [],
				//my score
				my_total_score: 0,
				my_scores: [],
				//target score
				target_total_score: 0,
				target_scores:[],
				//target resp time
				resp_times: [],
				last_resp_times: [],
				last_avg_resp_rate: 0 //seconds
			};
		}
	}

	function processAvgResp (targetId, message) {
		var times = convs[targetId].last_resp_times,
			createAt = message.createAt,
			sum = 0,
			i = 0;
		if (times.length === AVG_RESP_NUM + 1) {
			times.shift();
		}
		convs[targetId].resp_times.push(createAt);
		times.push(createAt);
		if (times.length  <= 1) return;
		for (i; i < times.length - 1; i += 1) {
			sum += moment(times[i + 1]).diff(times[i], 'seconds'); 
		}
		convs[targetId].last_avg_resp_rate = sum / times.length; 
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
			processAvgResp(targetId, message);
		}
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
		},

		getContentScore: function (content, cb) {
			socket.emit(MESSAGE_SCORE, {
				content: content
			}, function (err, score) {
				console.log(score);
				cb(null, score || 0);
			});
		}
	};
});