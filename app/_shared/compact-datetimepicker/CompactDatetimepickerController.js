'use strict';

angular.module('app.utils').controller('CompactDatetimepickerController', [
    '$scope',
    '$timeout',
    'DateService',
    function($scope, $timeout, DateService) {
        
        $scope.isOpenDt = false;
        $scope.isOpenD = false;
        $scope.isOpenY = false;
        
        $scope.openCalendarDt = function() {
            $scope.isOpenDt = true;
            $scope.isOpenD = false;
            $scope.isOpenY = false;
        };
        
        $scope.openCalendarD = function() {
            $scope.isOpenDt = false;
            $scope.isOpenD = true;
            $scope.isOpenY = false;
        };
        
        $scope.openCalendarY = function($event) {
            if($scope.isOpenY) {
                //Prevent datepicker from closing this calendar popup
                $event.preventDefault();
                $event.stopPropagation();
            }
            else {
                //Delay opening until next tick, otherwise calendar popup will be immediately closed
                $timeout(function () {
                    $scope.isOpenDt = false;
                    $scope.isOpenD = false;
                    $scope.isOpenY = true;
                });
            }
        };
        
        $scope.yearOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'year'
        };

        $scope.dateChanged = function() {
            if($scope.model) {
                $scope.model = DateService.getFormattedMomentWithTzFromMomentDate($scope.model);
            }
        };
        
    }
]);
