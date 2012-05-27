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
require([
	'chapters',
	'renderer',
	'vendor/order!vendor/libraries',
	'vendor/order!plugins/own'
],
function (chapters, renderer) {

	var BremenjsRouter = Backbone.Router.extend({
		routes: {
			'chapters/:id': 'chapters',
			'*path': 'home'
		},

		home : function () {
			chapters.current().then(function (chapter) {
				renderer.exec(chapter);
			});
		},

		chapters : function (id) {
			if (chapters.exists(id)) {
				chapters.get(id).then(function (chapter) {
					renderer.exec(chapter);
				});
			} else {
				// TODO: 404
			}
		}
	});

	// Load all meetups
	chapters.load().then(function () {
		new BremenjsRouter();
		
		Backbone.history.start();
	});
});