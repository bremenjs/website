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

	  	var data = null,
	  		index = 0;

	   	return {
	   		load : function () {
	   			var deferred = $.Deferred();

	   			backend.get.allMeetups().then(function (ids) {
	   				data = ids;

	   				deferred.resolve();
	   			});

	   			return deferred.promise();
	   		},
	   		hasNext : function () {
	   			return (data[index + 1]);
	   		},
	   		hasPrevious : function () {
	   			return (data[index - 1]);
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