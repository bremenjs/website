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
define([
	'backend',
    'vendor/order!vendor/libraries'
],
function (backend) {

	function MarkdownDownloader (chapterId) {
		var batch = [];

		this.queue = function (filename) {
			var result;

			batch.push(function (callback) {

	    	backend.get.file(filename).fromChapter(chapterId)
	    		.then(function (markdown) {
			    	var converter = new Markdown.Converter();
			    		result = converter.makeHtml(markdown);

			    		callback();
			    	});
				});

			return {
				toHTML: function () {
					return result;
				}
			};
		};

		this.execute = function () {
			var deferred = $.Deferred();
			
			async.series(batch, function () {
				deferred.resolve();
			});

			return deferred.promise();
		};
	}

	var helpers = {
		downloadMarkdown : function (chapter) {
			var deferred = $.Deferred();

			// Download all markdown files.
			var markdownDownload = new MarkdownDownloader(chapter.id);

			// Grab the markdown files from the server.
			chapter.description = markdownDownload.queue(chapter.description);

			for (var i = 0; i < chapter.topics.length; i++) {
				chapter.topics[i].description = markdownDownload.queue(chapter.topics[i].description);
			}

			// Push the markdown into the object for the template.
			markdownDownload.execute().then(function () {
				chapter.description = chapter.description.toHTML();

				for (var i = 0; i < chapter.topics.length; i++) {
					chapter.topics[i].description = chapter.topics[i].description.toHTML();
				}

				deferred.resolve(chapter);
			});

			return deferred.promise();
		}
	};

	return (function () {

		var ids, index, _nextId, _previousId;

		index = 0;

		_nextId = function () {
			return ids[index - 1];
		};

		_previousId = function () {
			return ids[index + 1];
		};

	   	return {
	   		load : function () {
	   			var deferred = $.Deferred();

	   			backend.get.allChapters().then(function (chapterIds) {
	   				ids = chapterIds;
	   				deferred.resolve();
	   			});

	   			return deferred.promise();
	   		},
	   		exists : function (id) {
	   			return (_.indexOf(ids, id) !== -1);
	   		},
	   		current : function () {
	   			var deferred = $.Deferred(),
	   			    id = _.first(ids);

	   			backend.get.oneChapter(id).then(function (chapter) {
	   				index = 0;

	   				chapter.no = (ids.length - index);

	   				chapter.previousId = _previousId();
	   				chapter.nextId = _nextId();

					helpers.downloadMarkdown(chapter).then(function () {
						deferred.resolve(chapter);
					});
	   			});

	   			return deferred.promise();
	   		},
	   		get : function (id) {
	   			var deferred = $.Deferred();

	   			var position = _.indexOf(ids, id);

	   			if (position !== -1) {
	   				backend.get.oneChapter(id).then(function (chapter) {
	   					index = position;

	   					chapter.no = (ids.length - index);

	   					chapter.previousId = _previousId();
	   					chapter.nextId = _nextId();

	   					helpers.downloadMarkdown(chapter).then(function () {
	   						deferred.resolve(chapter);
	   					});
	   				});
	   			}

	   			return deferred.promise();
	   		},
	   		getFile : function (filename) {
	   			return {
	   				fromChapter : function (id) {
	   					var deferred = $.Deferred();

	   					backend.get.file(filename).fromChapter(id).then(function (markdown) {
	   						deferred.resolve(markdown);
	   					});

	   					return deferred.promise();
	   				}
	   			}
	   		}
	   	}
	}());
});