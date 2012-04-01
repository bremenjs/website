/*!
 * bremen.js
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

var _ = require('underscore');
var async = require('async');
var express = require('express');

var app = module.exports = express.createServer();

var meta = {
    application:{
        name:'Bremen.js - Website',
        version:'0.1.0',
        authors:[
        	{name:'Malte Legenhausen', email:'mlegenhausen@gmail.com'},
            {name:'André König', email:'andre.koenig@gmail.com'}
        ],
        port: process.env.PORT || 8080
    }
};

var CHAPTER_PATH = process.env.CHAPTERS || process.cwd(), CHAPTERS = {};

// Load all chapters
console.log('Loading chapters...');
fs.readdir(CHAPTER_PATH, function(err, files) {
    if (err) return console.error(err);
    async.map(files, function(file, callback) {
        fs.stat(file, function(err, stat) {
            if (err) return callback(err);
            var manifest;
            if (stat.isDirectory() && file[0] !== '.') {
                manifest = path.join(CHAPTER_PATH, file, 'chapter.json');
                // Check if a chapter.json exists
                path.exists(manifest, function(exists) {
                    if (exists) {
                        // look for chapter.json
                        fs.open(manifest, 'r', function(err, data) {
                            if (err) return callback(err);
                            var chapter = JSON.parse(data);
                            console.log('Chapter ' + chapter.id + ' wurde geladen.');
                            return callback(null, chapter);
                        });
                    } else {
                        console.log('Unable to find chapter file ', manifest);
                        return callback();
                    }
                });
            } else {
                return callback();
            }
        });
    }, function(err, chapters) {
        if (err) return console.error(err);
        chapters = _.compact(chapters);
        CHAPTERS = _.groupBy(chapters, 'id');
        console.log('Chapters loading finished.');
    });
});

// Configuration

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/app/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

// Send the frontend to the client
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/app/public/index.html');
});

app.get('/chapters', function(req, res) {
    res.send(_.keys(CHAPTERS));
});

// Init the API
require('./app/api')(app);

app.listen(meta.application.port);
console.log(meta.application.name + " listening on port %d in %s mode", app.address().port, app.settings.env);
