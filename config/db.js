'use strict';

var mongoose = require('mongoose'),
	db_conn = 'mongodb://localhost/ivy-talk';

mongoose.connect(db_conn, function (err) {
    if (err) {
        console.error('\x1b[31m', 'Could not connect to MongoDB!');
    } else {
        // Globbing model files
        console.log('connect to mongoDB');
    }
});