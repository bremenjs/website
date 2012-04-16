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

var path = require('path');

var _ = require('underscore');

module.exports = function (app, repo) {
	
	app.get('/meetups', function (req, res) {
		res.send(JSON.stringify(repo.index));
	});

	app.get('/meetup/:id', function (req, res) {
		res.send(repo.get(req.params.id));
	});

	app.get('/meetup/:id/file/*', function(req, res) {
		var root = repo.path(req.params.id);

		res.sendfile(path.join(root, _.first(req.params)));
	});
};