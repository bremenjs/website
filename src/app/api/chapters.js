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
	
	app.get('/chapters', function (req, res) {
		var chapters = repo.index.sort(function (a, b) {
			return b-a;
		});
		res.send(chapters);
	});

	app.get('/chapter/:id', function (req, res) {
		res.send(repo.get(req.params.id));
	});

	app.get('/chapter/:id/file/*', function(req, res) {
		var root = repo.path(req.params.id);

		res.sendfile(path.join(root, _.first(req.params)));
	});
};