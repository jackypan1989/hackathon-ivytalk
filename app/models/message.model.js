'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
        default: ''
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

mongoose.model('Message', MessageSchema);


