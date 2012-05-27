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
	return (function () {

	  	var ids = null,
	  		index = 0;

	   	return {
	   		load : function () {
	   			var deferred = $.Deferred();

	   			backend.get.allMeetups().then(function (chapterIds) {
	   				ids = chapterIds;

	   				deferred.resolve();
	   			});

	   			return deferred.promise();
	   		},
	   		hasNext : function () {
	   			return (ids[index + 1]);
	   		},
	   		hasPrevious : function () {
	   			return (ids[index - 1]);
	   		},
	   		get : function (id) {
	   			var deferred = $.Deferred();

	   			var position = (_.indexOf(ids, id) !== -1);

	   			if (position) {
	   				index = position;

	   				backend.get.oneMeetup(id).then(function (chapter) {
	   					data[index] = chapter;
	   					deferred.resolve(data[index]);
	   				});	   				
	   			}

	   			return deferred.promise();
	   		},

	   		getCurrent : function () {
	   			var deferred = $.Deferred();

	   			if (typeof data[index] === 'string') {
	   				var id = data[index];

	   				backend.get.oneMeetup(id).then(function (chapter) {
	   					data[index] = chapter;
	   					deferred.resolve(data[index]);
	   				});
	   			} else {
	   				deferred.resolve(data[index]);
	   			}

	   			return deferred.promise();
	   		},
	   		getPrevious : function () {
	   			var deferred = $.Deferred();

	   			index = index - 1;

	   			if (typeof data[index] === 'string') {
	   				var id = data[index];

	   				backend.get.oneMeetup(id).then(function (chapter) {
	   					data[index] = chapter;
	   					deferred.resolve(data[index]);
	   				});
	   			} else {
	   				deferred.resolve(data[index]);
	   			}

	   			return deferred.promise();
	   		},
	   		getNext : function () {
	   			var deferred = $.Deferred();

	   			index = index + 1;

	   			if (typeof data[index] === 'string') {
	   				var id = data[index];

	   				backend.get.oneMeetup(id).then(function (chapter) {
	   					data[index] = chapter;
	   					deferred.resolve(data[index]);
	   				});
	   			} else {
	   				deferred.resolve(data[index]);
	   			}

	   			return deferred.promise();
	   		}
	   	}
	}());
});