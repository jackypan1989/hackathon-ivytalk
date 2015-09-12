var IvyTalk = (function () {
	var USER_REGISTER = 'user:register',
		MESSAGE_LIST = 'message:list',
		MESSAGE_CREATE = 'message:create';

	function handleError (error) {
		alert(error.err_description);
	}

	function Ivy (io, user, onReceiveMsg) {
		var that = this;

		this.convs = {};

		this.socket = io.connect();
		
		this.onReceiveMsg = onReceiveMsg || function () {};

		//on connect
		this.socket.on('connect', function () {
			that.socket.emit(USER_REGISTER, user, function (err, data) {
				if (err) return handleError(err);
				that.user = data;
			});
		});

		//on message
		this.socket.on('message', function (data) {
			var from = data.from,
				message = data.message;
			that.onReceiveMsg(from, message);
		});
	}

	Ivy.prototype.initConv = function (userId) {
		if (!this.convs[userId]) {
			this.convs[userId] = {
				messages: [],
				total_score: 0
			};
		}
	}

	Ivy.prototype.pushMessage = function (userId, message) {
		this.initConv(userId);

		if (Array.isArray(message)) {
			this.convs[userId].messages.concat(message);
		} else {
			this.convs[userId].push(message);
		}
	}

	Ivy.prototype.listMessages = function (userId, cb) {
		var that = this;
		this.socket.emit(MESSAGE_LIST, {
			userId: userId
		}, function (err, messages) {
			if (err) {
				handleError(err);
				cb(err);
			} else {
				that.pushMessage(userId, messages);
				cb(null, messages);
			}
		});
	};

	Ivy.prototype.createMessage = function (userId, content, cb) {
		var that = this;
		this.socket.emit(MESSAGE_CREATE, {
			userId: userId,
			content: content
		}, function (err, message) {
			if (err) {
				handleError(err);
				cb(err);
			} else {
				that.pushMessage(userId, message);
				cb(null, message);
			}
		});
	};

	return Ivy;
})();
