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
	"vendor/text!templates/chapter.html",
    'vendor/order!vendor/libraries'
],
function (templateSource) {

	var $main, $loading, template;

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

	return {
		exec : function (chapter) {
			var $chapter = template.compile({chapter: chapter});
			$chapter.hide();

			$main.empty().append($chapter);

			$loading.fadeOut('slow', function () {
				$chapter.fadeIn();
			});
		}
	}
});