'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    async = require('async');

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

/**
 * Statics
 */
ConversationSchema.statics.loadOne = function (from, to, cb) {
    var Conversation = this;

    async.waterfall([
        function (callback) {
            Conversation.findOne({
                participants: { $all: [from._id, to._id] }
            }, callback);
        },
        function (conv, callback) {
            if (conv) return callback(null, conv, 0);
            conv = new Conversation({
                participants: [from, to]
            });
            conv.save(callback);
        },
        function (conv, numberAffedted, callback) {
            conv.populate('participants', callback);
        }
    ], function (err, conv) {
        cb(err, conv);
    });
};

module.exports = mongoose.model('Conversation', ConversationSchema);
