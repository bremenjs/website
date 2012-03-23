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
module.exports = function (app) {
	
	app.get('/meetups', function (req, res) {
		res.send('/meetups');
	});
};