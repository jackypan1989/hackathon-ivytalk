'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Conversation Schema
 */
var ConversationSchema = new Schema({
    participants: {
        type: [{type: Schema.Types.ObjectId, ref: 'User'}],
        default: []
    },
    createAt: {
        type: Date, 
        default: Date.now
    },
    updateAt: {
        type: Date, 
        default: Date.now
    }
});

/**
 * Ensure index
 */
ConversationSchema.index({participants: 1});

mongoose.model('Conversation', ConversationSchema);
