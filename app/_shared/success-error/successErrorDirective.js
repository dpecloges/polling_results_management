'use strict';

angular.module('app.utils').directive('successError', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/_shared/success-error/successerror.tpl.html',
        replace: false,
        scope: {
            alerts: '='
        },
        controller: function($rootScope, $scope) {
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
                $rootScope.errorList.errors.splice(index, 1);
            };
        }
    };
});
