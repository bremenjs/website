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
	'backend',
	"vendor/text!templates/chapter.html",
	'vendor/order!vendor/libraries',
	'vendor/order!plugins/own'
],
function (backend, templateSource) {

	var mainNode = $('#main'),
	    loadingNode = $('#loading');

	var template = (function () {
		var compiled = _.template(templateSource);

		return {
			compile : function (data) {
				return $(compiled(data));
			}
		}
	}());

	backend.get.allMeetups().then(function (ids) {
		var firstMeetup = ids[0];

		backend.get.oneMeetup(firstMeetup).then(function (details) {
			details.no = 1; // Just for the first chapter.

			var batch = [];

			var markdownDownloader = (function (filename) {
				var result;

			    batch.push(function (callback) {
			    	backend.get.file(filename).fromMeetup(firstMeetup)
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

				var chapterNode = template.compile({chapter: details});
				chapterNode.hide();

				mainNode.append(chapterNode);

				loadingNode.fadeOut('slow', function () {
					chapterNode.fadeIn();
				});
			});
		});
	});
});
