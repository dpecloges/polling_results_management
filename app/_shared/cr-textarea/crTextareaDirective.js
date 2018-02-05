'use strict';
angular.module('app.utils')
    .directive('crTextarea', function () {
      return {
        restrict: 'E',
        templateUrl: 'app/_shared/cr-textarea/cr-textarea.tpl.html',
        replace: true,
        controller: 'CrTextareaController',
        scope: {
          textareaModel: "=",
          size: "=",
          rows: "@",
          name: "@",
          readonly: '=ngReadonly'
        }
      };
    });