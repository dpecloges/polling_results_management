'use strict';

angular.module('SmartAdmin.Forms').directive('smartCkEditor', function () {
    return {
        restrict: 'A',
        compile: function ( tElement) {
            tElement.removeAttr('smart-ck-editor data-smart-ck-editor');

            CKEDITOR.replace( tElement.attr('name'), { height: '380px', startupFocus : true} );

            CKEDITOR.on('instanceReady', function() {
                
                var iframe = $('.cke_wysiwyg_frame').contents();

                iframe.find('html').css({ 'background-color': '#b0b0b0' });

                iframe.find('body').css({
                    'width': '170mm',
                    //'height': '297mm',
                    'background-color': '#ffffff',
                    'margin': '0mm',
                    'padding': '5mm'
                });

                iframe.find('td').css({ 'padding': '-1px' });
            });
        }
    }
});