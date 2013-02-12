/*!
 * Bremen.js
 *
 * Copyright(c) 2012 Bremen, Germany
 *
 * Authors:
 *
 *     Malte Legenhausen <mlegenhausen@gmail.com>
 *     André König <andre.koenig@gmail.com>
 *
 * MIT Licensed
 *
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var _ = require('underscore');
var async = require('async');
var winston = require('winston');

function Repository(root) {
	this.root = root;
	this.init();
}

Repository.prototype.init = function() {
	this.mapping = {};
	this.index = [];
	this.paths = {};
	var self = this;
	winston.info('Initializing repository...');
	this.pull(function(err) {
		if (err) return winston.error(err);
		winston.info('Loading chapters...');
		self.load(function(err, chapters) {
			if (err) {
				console.log(err);
				return;
			}
			self.createMapping(chapters);
		    self.createIndex(chapters);
		    winston.info('Chapters loading finished.');
		});
	});
};

Repository.prototype.pull = function(callback) {
	winston.info('Pulling from git...');
	cp.execFile('git', ['pull'], {
		cwd: this.root
	}, callback);
};

Repository.prototype.load = function(callback) {
	var self = this;
	// Load all chapters
	fs.readdir(self.root, function(err, files) {
	    if (err) return winston.error(err);

	    async.map(files, function(file, callback) {

	        fs.stat(self.root + '/' + file, function(err, stat) {
	            if (err) return callback(err);

	            var dir = path.join(self.root, file), manifest;

	            if (stat.isDirectory() && file[0].indexOf('.') !== 1 ) {
	                manifest = path.join(dir, 'chapter.json');
	                // Check if a chapter.json exists
	                fs.exists(manifest, function(exists) {
	                    if (exists) {
	                        // look for chapter.json
	                        fs.readFile(manifest, 'utf8', function(err, data) {
	                            if (err) return callback(err);
	                            var chapter;
	                            try {
	                            	chapter = JSON.parse(data);
	                            	chapter.id = chapter.id.toLowerCase();
		                            chapter.createdAt = stat.ctime;
		                            self.paths[chapter.id] = dir;
		                            winston.info('Chapter ' + chapter.id + ' wurde geladen.');
	                            } catch(err) {
	                            	winston.error('Unable to load chapter from file ' + manifest);
	                            	winston.error(err);
	                            }
	                            return callback(null, chapter);
	                        });
	                    } else {
	                        winston.warn('Unable to find chapter file ' + manifest);
	                        return callback();
	                    }
	                });
	            } else {
	                winston.debug(file + ' skipped');
	                return callback();
	            }
	        });
	    }, function(err, chapters) {
	        if (err) return callback(err);
	        return callback(null, _.compact(chapters));
	    });
	});
};

Repository.prototype.createMapping = function(chapters) {
	_.each(chapters, function(chapter) {
		if (this.mapping[chapter.id]) {
			winston.error('Duplicated id ' + chapter.id);
			return;
		}
		this.mapping[chapter.id] = chapter;
	}, this);
};

Repository.prototype.createIndex = function(chapters) {
	this.index = _.pluck(chapters.sort(function(a, b) {
        a = a.createdAt.getTime(), b = b.createdAt.getTime();
        return a < b ? 1 : a > b ? -1 : 0;
    }), 'id');
};

Repository.prototype.get = function(key) {
	return this.mapping[key.toLowerCase()];
};

Repository.prototype.index = function() {
	return this.index;
};

Repository.prototype.path = function(key) {
	return this.paths[key];
};

module.exports = Repository;