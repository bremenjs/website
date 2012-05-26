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
	'backend',
	"vendor/text!templates/chapter.html",
	'vendor/order!vendor/libraries',
	'vendor/order!plugins/own'
],
function (chapters, backend, templateSource) {

	var $main, $loading, template, Router;

	$main = $('#main');

	$loading = $('#loading');

	template = (function () {
		var compiled = _.template(templateSource);

		return {
			compile : function (data) {
				return $(compiled(data));
			}
		}
	}());

	BremenjsRouter = Backbone.Router.extend({
		routes: {
			"chapters/:id": "chapters"
		},

		chapters : function (id) {
			chapters.getCurrent(id).then(function (details) {
				// TOGGLE CONTROLS

				var batch = [];

				var markdownDownloader = (function (filename) {
					var result;

				    batch.push(function (callback) {

				    	// TODO: Move this to the chapters abstraction.
				    	backend.get.file(filename).fromMeetup(id)
				    		.then(function (markdown) {
				    			var converter = new Markdown.Converter();
				    			result = converter.makeHtml(markdown);

				    		   	callback();
				    		});
				   	});

				   	return {
				   		markdownToHTML: function () {
				   			return result;
				   		}
				   	};
				});

				// Grab the markdown files from the server.
				details.description = markdownDownloader(details.description);

				for (var i = 0; i < details.topics.length; i++) {
					details.topics[i].description = markdownDownloader(details.topics[i].description);
				}

				// Download all markdown files in a serie.
				async.series(batch, function () {
					// Push the markdown into the object for the template.
					details.description = details.description.markdownToHTML();
					for (var i = 0; i < details.topics.length; i++) {
						details.topics[i].description = details.topics[i].description.markdownToHTML();
					}

					var $chapter = template.compile({chapter: details});
					$chapter.hide();

					$main.append($chapter);

					$loading.fadeOut('slow', function () {
						$chapter.fadeIn();
					});
				});
			});
		}
	});

	// Load all meetups
	chapters.load().then(function () {
		new BremenjsRouter();
		
		Backbone.history.start();
	});
});
