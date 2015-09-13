'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sentService = require('../../services/sentiment');

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	from: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	content: {
		type: String,
        default: '',
        trim: true
	},
	senti_score: {
		type: Number,
		default: 0
	},
	createAt: {
        type: Date, 
        default: Date.now
    },
    conversation: {
        type: Schema.Types.ObjectId, 
        ref: 'Conversation'
    }
});

MessageSchema.index({conversation: 1});

MessageSchema.pre('save', function (next) {
	var that = this;
	this.content = (this.content || '').trim();
	if (!this.content) return next();
	//that.senti_score = sentService.getSentiment(this.content);
	//next();
	sentService.getMixSentiment(this.content, function (err, score) {
		if (!err) that.senti_score = score;
		next();
	});
});

module.exports = mongoose.model('Message', MessageSchema);


