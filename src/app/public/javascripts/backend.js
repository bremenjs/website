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
	'vendor/order!vendor/libraries'
],
function () {
	return (function () {
		var urls = {
			chapters: '/chapters',
			chapter: '/chapter'
		};

		return  {
			get : {
				allChapters : function () {
					var deferred = $.Deferred();

					$.getJSON(urls.chapters, deferred.resolve);

					return deferred.promise();
				},
				oneChapter : function (id) {
					var deferred = $.Deferred();

					$.getJSON(urls.chapter + '/' + id, deferred.resolve);

					return deferred.promise();
				},
				file : function (name) {
					return {
						fromChapter : function (id) {
							var deferred = $.Deferred();

							$.get(urls.chapter + '/' + id + '/file/' + name, deferred.resolve);

							return deferred.promise();
						}
					}
				}
			}
		}
	}());
});