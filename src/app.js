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

var app = module.exports = express();

// TODO: Use pkginfo
var meta = {
    application:{
        name:'Bremen.js - Website',
        version:'0.1.0',
        authors:[
            {
                name:'Malte Legenhausen',
                email:'mlegenhausen@gmail.com'
            },
            {
                name:'André König',
                email:'andre.koenig@gmail.com'
            }
        ],
        port: process.env.PORT || 8002,
        chapterRoot: path.resolve(process.env.CHAPTERS) || process.cwd(),
        secret: 'bqlQ7xwJ3wWVVJE7QGJZNAgK'
    }
};

// Init the chapter repository
var repo = new Repository(meta.application.chapterRoot);

// Configuration

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(meta.application.chapterRoot));
    app.use(express.staticCache());
    app.use(express.static(__dirname + '/app/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

// Send the frontend to the client
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/public/index.html');
});

// Init the API
require('./app/api')(app, repo, {
    secret: meta.application.secret
});

app.listen(meta.application.port, '127.0.0.1');
console.log(meta.application.name + " listening on port %d in %s mode", meta.application.port, app.settings.env);