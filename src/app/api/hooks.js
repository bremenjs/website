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

module.exports = function (app, repo, options) {
	app.post('/hooks/reload/:secret', function(req, res, next) {
		if (req.params.secret === options.secret) {
			repo.init();
			res.send();
		} else {
			next(new Error('Unauthorized'));			
		}
	});	
};