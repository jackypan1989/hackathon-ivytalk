'use strict';

var mongoose = require('mongoose'),
	db_conn = 'mongodb://localhost/ivy-talk',
	path = require('path'),
	loader = require('../services/loader'),
	MODELS_PATH = path.join(__dirname, '..', 'app', 'models');

mongoose.connect(db_conn, function (err) {
    if (err) {
        console.error('\x1b[31m', 'Could not connect to MongoDB!');
    } else {
        // Globbing model files
        console.log('connect to mongoDB');
    }
});
