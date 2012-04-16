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
			meetups: '/meetups',
			meetup: '/meetup'
		};

		return  {
			get : {
				allMeetups : function () {
					var deferred = $.Deferred();

					$.getJSON(urls.meetups, deferred.resolve);

					return deferred.promise();
				},
				oneMeetup : function (id) {
					var deferred = $.Deferred();

					$.getJSON(urls.meetup + '/' + id, deferred.resolve);

					return deferred.promise();
				},
				file : function (name) {
					return {
						fromMeetup : function (id) {
							var deferred = $.Deferred();

							$.get(urls.meetup + '/' + id + '/file/' + name, deferred.resolve);

							return deferred.promise();
						}
					}
				}
			}
		}
	}());
});