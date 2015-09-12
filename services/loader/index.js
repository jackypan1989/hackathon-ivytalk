'use strict';

var fs = require('fs'),
	path = require('path');

function loadModules (filePath, loadFunc) {
	fs.lstat(filePath, function (err, stat) {
		if (!stat.isDirectory()) return loadFunc(filePath);
		fs.readdir(filePath, function (err, files) {
			var f, l = files.length, i = 0;
	        for (i; i < l; i++) {
	            f = path.join(filePath, files[i]);
	            loadModules(f, loadFunc);
	        }
		});
	});
}

module.exports = loadModules;