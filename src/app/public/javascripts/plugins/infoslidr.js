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
    var activeClass = 'info-slider-on',
        nodes = {
            logo: $('body > header'),
            body: $('body'),
            slider: $('#info-slider'),
            toogle: $('a[href="#info"]')
        },
        sliderHeight;

    nodes.toogle.on('click', function (event) {
        if (nodes.body.hasClass(activeClass)) {
            nodes.logo.fadeOut(50);
            nodes.slider.animate({
                height: '+=50'
            }, 400, function() {
                nodes.slider.slideUp(200, function () {
                    nodes.body.removeClass(activeClass);

                    nodes.slider.height(sliderHeight);

                    nodes.logo.fadeIn(100);
                });
            });
        } else {
            if (!sliderHeight) {
                sliderHeight = nodes.slider.height();
            }

            nodes.slider.slideDown(200);
            nodes.body.addClass(activeClass);
        }
    })
});