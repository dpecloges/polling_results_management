(function () {

    'use strict';

    angular.module('app.utils')
        .controller('crDatepickerCtrl', ['$scope', '$timeout', 'DateService', function ($scope, $timeout, DateService) {
            
            //Εκέλεση calcAge() στη φόρτωση του directive (αν έχει δηλωθεί)
            if($scope.calcAge) {
                $scope.calcAge({elem: $scope.model});
            }
            
            // open/close popup
            $scope.open = function ($event) {
                if ($scope.opened) {
                    //  Prevent datepicker from closing this calendar popup
                    $event.preventDefault();
                    $event.stopPropagation();
                } else {
                    //  Delay opening until next tick, otherwise calendar popup will be immediately closed
                    $timeout(function () {
                        $scope.opened = true;
                    });
                }
            };

            $scope.dateChanged = function () {

                if ($scope.model) {
                    $scope.model = DateService.getFormattedMomentWithTzFromMomentDate($scope.model);
                }

                if ($scope.calcAge) {
                    $scope.calcAge({elem: $scope.model});
                }
                
                if($scope.change) {
                    $scope.change();
                }
            };

        }]);

})();
