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

var async = require('async');
var express = require('express');
var winston = require('winston');

var Repository = require('./app/repo');

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

// Init the chapter repository
var CHAPTER_ROOT = process.env.CHAPTERS || process.cwd(),
    repo = new Repository(CHAPTER_ROOT);

// Configuration
console.log(CHAPTER_ROOT);

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/app/public'));
    app.use(express.static(CHAPTER_ROOT));
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
    //res.redirect('https://plus.google.com/109791724606817042533/about');
    res.sendfile(__dirname + '/app/public/index.html');
});

// Init the API
require('./app/api')(app, repo);

app.listen(meta.application.port);
console.log(meta.application.name + " listening on port %d in %s mode", app.address().port, app.settings.env);