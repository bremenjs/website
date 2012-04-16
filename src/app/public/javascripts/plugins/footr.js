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
    'vendor/libraries'
], function () {
	var nodes = {
		footer: $('body > footer')
	};

	var isSliding = false;

	$(window).scroll(function() {
		var percentage = ((($(window).scrollTop() + $(window).height()) * 100 ) / $(document).height());

	    if ( percentage >= 99 ) {
	    	isSliding = true;

	   	    nodes.footer.slideDown(100, function () {
	   	    	isSliding = false;
	   	    });
	    } else if (nodes.footer.is(':visible') && !isSliding) {
	    	nodes.footer.slideUp(100);
	    }
	});
}());