"use strict";
angular.module('app.utils')
    
    .controller('CrTextareaController', ['$scope', '$filter', function ($scope, $filter) {
      /*
       * Υπολογισμός εναπομείναντων χαρακτήρων στο textarea
       * Κάνει trim χρησιμοποιώντας το $filter('limitTo')(input, limit, begin) αν ξεπεράσουν το size
       */
      $scope.trimIfLengthExceedsSize = function (size) {
        if ($scope.textareaModel.length > size) {
          $scope.textareaModel = $filter('limitTo')($scope.textareaModel, size, 0);
        }
      };
    }]);