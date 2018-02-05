"use strict"

/**
 * Controller για το ckEditor Directive
 */
angular.module('app.utils').controller('CkEditorController', [
    '$scope',
    function ($scope) {

        /**
         * Απόκρυψη των borders πριν από την εκτύπωση
         * @param classname
         */
        $scope.hideBorderZeroOnPrint = function(classname) {
            var node = $scope.ckeditor.document.$.getElementsByTagName('body')[0];
            var elements = node.getElementsByTagName('table');
            for (var i = 0, len = elements.length; i < len; i++) {
                var helper = elements[i].getAttribute('class');
                if (helper)
                    elements[i].setAttribute('class', helper.replace(classname, ''));
            }
        }

        /**
         * Εμφάνιση των borders μετά από την εκτύπωση
         * @param classname
         */
        $scope.showBorderZeroAfterPrint = function(classname) {
            var node = $scope.ckeditor.document.$.getElementsByTagName('body')[0];
            var elements = node.getElementsByTagName('table');
            for (var i = 0, len = elements.length; i < len; i++) {
                var bor = elements[i].getAttribute('border');
                if (bor && bor == 0) {
                    var helper = elements[i].getAttribute('class');
                    elements[i].setAttribute('class', helper ? helper.concat(classname) : classname);
                }
            }
        }

        /**
         * Απόκρυψη των page breaks πριν από την εκτύπωση
         * @param classname
         */
        $scope.hidePageBreaksOnPrint = function(classname){
            var node = $scope.ckeditor.document.$.getElementsByTagName( 'body' )[0];
            var regExp = new RegExp( '\\b' + classname + '\\b' );
            var elements = node.getElementsByTagName( 'div' );
            for( var i=0, len=elements.length ; i<len ; i++ ){
                if( regExp.test( elements[i].className)  ){
                    elements[i].setAttribute('style', elements[i].getAttribute('style').concat('; visibility: hidden;'));
                }
            }
        }

        /**
         * Εμφάνιση των page breaks πριν από την εκτύπωση
         * @param classname
         */
        $scope.showPageBreaksAfterPrint = function(classname){
            var node = $scope.ckeditor.document.$.getElementsByTagName( 'body' )[0];
            var regExp = new RegExp( '\\b' + classname + '\\b' );
            var elements = node.getElementsByTagName( 'div' );
            for( var i=0, len=elements.length ; i<len ; i++ ){
                if( regExp.test( elements[i].className)  ){
                    elements[i].setAttribute('style', elements[i].getAttribute('style').replace('visibility: hidden;', ''));
                }
            }
        }

        /**
         * Καταχώριση (προγραμματιστική) δεδομένων στον ckEditor
         * @param data
         */
        $scope.setCkEditorData = function (data) {
            $scope.ckeditor.setData(data);
        };

        /**
         * Exposed functions
         * @type {{setCkEditorData: (*)}}
         */
        $scope.api = {
            setCkEditorData: $scope.setCkEditorData
        };

    }]);
