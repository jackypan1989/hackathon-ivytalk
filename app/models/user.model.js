'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String
	},
	userId: {
		type: String,
		unique: true
	},
	gender: {
    	type: String,
    	enum: ['male', 'female']
    },
    photo: {
    	type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
